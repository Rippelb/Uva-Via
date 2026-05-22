<?php
require __DIR__ . '/config/db.php';
require __DIR__ . '/config/helpers.php';
require __DIR__ . '/config/auth.php';

require_method('GET', 'POST');
require_csrf();

const PARADAS_POR_DIA = 3;
const HORARIOS_INICIO = ['10:00:00', '13:00:00', '16:00:00'];
const VELOCIDADE_MEDIA_KMH = 50.0;

function distancia_km(float $lat1, float $lon1, float $lat2, float $lon2): float {
    $R = 6371.0;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    $a = sin($dLat / 2) ** 2
        + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;
    return 2 * $R * asin(min(1.0, sqrt($a)));
}

function carregar_roteiro_completo(PDO $pdo, int $roteiroId): array {
    $stmt = $pdo->prepare('
        SELECT r.*, u.nome_completo AS usuario_nome, u.email AS usuario_email
        FROM roteiros r
        JOIN usuarios u ON u.id = r.usuario_id
        WHERE r.id = ?
    ');
    $stmt->execute([$roteiroId]);
    $roteiro = $stmt->fetch();
    if (!$roteiro) return [];

    $diasStmt = $pdo->prepare('SELECT id, numero_dia, data_dia FROM roteiro_dias WHERE roteiro_id = ? ORDER BY numero_dia');
    $diasStmt->execute([$roteiroId]);
    $dias = $diasStmt->fetchAll();

    $paradasStmt = $pdo->prepare('
        SELECT p.id, p.roteiro_dia_id, p.vinicola_id, p.experiencia_id, p.ordem,
               p.horario_sugerido, p.tempo_deslocamento_min,
               v.nome AS vinicola_nome, v.cidade, v.foto_url,
               e.nome AS experiencia_nome, e.duracao_minutos, e.preco_por_pessoa
        FROM roteiro_paradas p
        JOIN vinicolas v ON v.id = p.vinicola_id
        LEFT JOIN experiencias e ON e.id = p.experiencia_id
        WHERE p.roteiro_dia_id IN (SELECT id FROM roteiro_dias WHERE roteiro_id = ?)
        ORDER BY p.roteiro_dia_id, p.ordem
    ');
    $paradasStmt->execute([$roteiroId]);
    $paradas = $paradasStmt->fetchAll();

    $byDia = [];
    foreach ($paradas as $p) {
        $byDia[(int) $p['roteiro_dia_id']][] = $p;
    }
    foreach ($dias as &$d) {
        $d['paradas'] = $byDia[(int) $d['id']] ?? [];
    }

    $roteiro['dias'] = $dias;
    return $roteiro;
}

try {
    $pdo = getDb();
    $me = require_login();

    if (method() === 'GET') {
        if (isset($_GET['id'])) {
            $r = carregar_roteiro_completo($pdo, (int) $_GET['id']);
            if (!$r) json_error('Roteiro nao encontrado', 404);

            // Escopo: usuario so ve os proprios; adm_supremo ve todos.
            if ($me['role'] === 'usuario' && (int) $r['usuario_id'] !== (int) $me['id']) {
                json_error('Sem permissao', 403);
            }
            json_response($r);
        }

        $where = [];
        $params = [];
        if ($me['role'] === 'usuario') {
            $where[] = 'r.usuario_id = ?';
            $params[] = (int) $me['id'];
        }

        $sql = '
            SELECT r.id, r.usuario_id, r.preferencia_id, r.nome, r.total_dias,
                   r.custo_estimado, r.status, r.criado_em,
                   u.email AS usuario_email
            FROM roteiros r
            JOIN usuarios u ON u.id = r.usuario_id
        ';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY r.criado_em DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        json_response($stmt->fetchAll());
    }

    // POST: gerar roteiro otimizado para o usuario logado.
    $body = read_json_body();

    $numDias = max(1, (int) ($body['num_dias'] ?? 1));
    $numPessoas = max(1, (int) ($body['num_pessoas'] ?? 1));
    $orcamentoTotal = (float) ($body['orcamento_total'] ?? 0);
    $perfilId = isset($body['perfil_id']) ? (int) $body['perfil_id'] : null;
    $tagIds = array_values(array_unique(array_filter(array_map('intval', $body['tag_ids'] ?? []))));
    $dataInicio = $body['data_inicio'] ?? null;
    $nomeRoteiro = trim((string) ($body['nome'] ?? 'Roteiro Vale dos Vinhedos'));

    if ($orcamentoTotal <= 0) json_error('orcamento_total obrigatorio', 422);
    if (!$tagIds) json_error('tag_ids obrigatorio (lista de interesses)', 422);
    if ($perfilId === null) json_error('perfil_id obrigatorio', 422);

    $pdo->beginTransaction();

    // Cria preferencia + preferencias_tags
    $orcamentoPorPessoa = $orcamentoTotal / $numPessoas;
    $ins = $pdo->prepare('
        INSERT INTO preferencias_viagem (usuario_id, perfil_id, num_dias, num_pessoas, orcamento_por_pessoa)
        VALUES (?, ?, ?, ?, ?)
    ');
    $ins->execute([(int) $me['id'], $perfilId, $numDias, $numPessoas, $orcamentoPorPessoa]);
    $preferenciaId = (int) $pdo->lastInsertId();

    $insTag = $pdo->prepare('INSERT INTO preferencias_tags (preferencia_id, tag_id) VALUES (?, ?)');
    foreach ($tagIds as $tid) $insTag->execute([$preferenciaId, $tid]);

    // Pontuacao das experiencias por overlap de tags
    $totalParadas = $numDias * PARADAS_POR_DIA;
    $tetoPrecoParada = $orcamentoPorPessoa / max(1, PARADAS_POR_DIA);

    $placeholders = implode(',', array_fill(0, count($tagIds), '?'));
    $sql = "
        SELECT e.id, e.vinicola_id, e.nome, e.duracao_minutos, e.preco_por_pessoa,
               v.nome AS vinicola_nome, v.latitude, v.longitude, v.cidade,
               COUNT(et.tag_id) AS score
        FROM experiencias e
        JOIN vinicolas v ON v.id = e.vinicola_id
        LEFT JOIN experiencias_tags et
          ON et.experiencia_id = e.id AND et.tag_id IN ($placeholders)
        WHERE e.preco_por_pessoa <= ?
        GROUP BY e.id, e.vinicola_id, e.nome, e.duracao_minutos, e.preco_por_pessoa,
                 v.nome, v.latitude, v.longitude, v.cidade
        ORDER BY score DESC, e.preco_por_pessoa ASC
    ";
    $params = array_merge($tagIds, [$tetoPrecoParada]);
    $expStmt = $pdo->prepare($sql);
    $expStmt->execute($params);
    $candidatas = $expStmt->fetchAll();

    if (count($candidatas) < $totalParadas) {
        $sql2 = "
            SELECT e.id, e.vinicola_id, e.nome, e.duracao_minutos, e.preco_por_pessoa,
                   v.nome AS vinicola_nome, v.latitude, v.longitude, v.cidade,
                   COUNT(et.tag_id) AS score
            FROM experiencias e
            JOIN vinicolas v ON v.id = e.vinicola_id
            LEFT JOIN experiencias_tags et
              ON et.experiencia_id = e.id AND et.tag_id IN ($placeholders)
            WHERE e.preco_por_pessoa <= ?
            GROUP BY e.id, e.vinicola_id, e.nome, e.duracao_minutos, e.preco_por_pessoa,
                     v.nome, v.latitude, v.longitude, v.cidade
            ORDER BY score DESC, e.preco_por_pessoa ASC
        ";
        $expStmt = $pdo->prepare($sql2);
        $expStmt->execute(array_merge($tagIds, [$orcamentoPorPessoa]));
        $candidatas = $expStmt->fetchAll();
    }

    if (!$candidatas) {
        $pdo->rollBack();
        json_error('Nenhuma experiencia compativel com o orcamento informado', 422);
    }

    $ins = $pdo->prepare('
        INSERT INTO roteiros (usuario_id, preferencia_id, nome, total_dias, status)
        VALUES (?, ?, ?, ?, ?)
    ');
    $ins->execute([(int) $me['id'], $preferenciaId, $nomeRoteiro, $numDias, 'gerado']);
    $roteiroId = (int) $pdo->lastInsertId();

    $insDia = $pdo->prepare('INSERT INTO roteiro_dias (roteiro_id, numero_dia, data_dia) VALUES (?, ?, ?)');
    $insParada = $pdo->prepare('
        INSERT INTO roteiro_paradas (roteiro_dia_id, vinicola_id, experiencia_id, ordem,
                                     horario_sugerido, tempo_deslocamento_min)
        VALUES (?, ?, ?, ?, ?, ?)
    ');

    $usadas = [];
    $custoTotal = 0.0;
    $dataAtual = $dataInicio ? new DateTimeImmutable($dataInicio) : null;

    for ($d = 1; $d <= $numDias; $d++) {
        $dataDia = $dataAtual ? $dataAtual->modify('+' . ($d - 1) . ' day')->format('Y-m-d') : null;
        $insDia->execute([$roteiroId, $d, $dataDia]);
        $diaId = (int) $pdo->lastInsertId();

        $vinicolasDoDia = [];
        $paradasDoDia = [];
        foreach ($candidatas as $c) {
            if (count($paradasDoDia) >= PARADAS_POR_DIA) break;
            $expId = (int) $c['id'];
            $vId = (int) $c['vinicola_id'];
            if (isset($usadas[$expId])) continue;
            if (isset($vinicolasDoDia[$vId])) continue;
            $paradasDoDia[] = $c;
            $vinicolasDoDia[$vId] = true;
            $usadas[$expId] = true;
        }

        if (count($paradasDoDia) < PARADAS_POR_DIA) {
            foreach ($candidatas as $c) {
                if (count($paradasDoDia) >= PARADAS_POR_DIA) break;
                $expId = (int) $c['id'];
                if (isset($usadas[$expId])) continue;
                $paradasDoDia[] = $c;
                $usadas[$expId] = true;
            }
        }

        if (count($paradasDoDia) > 1) {
            $ordenadas = [array_shift($paradasDoDia)];
            while ($paradasDoDia) {
                $ultima = end($ordenadas);
                $maisProx = 0;
                $menorDist = PHP_FLOAT_MAX;
                foreach ($paradasDoDia as $i => $cand) {
                    $dist = distancia_km(
                        (float) $ultima['latitude'], (float) $ultima['longitude'],
                        (float) $cand['latitude'], (float) $cand['longitude']
                    );
                    if ($dist < $menorDist) {
                        $menorDist = $dist;
                        $maisProx = $i;
                    }
                }
                $ordenadas[] = $paradasDoDia[$maisProx];
                array_splice($paradasDoDia, $maisProx, 1);
            }
            $paradasDoDia = $ordenadas;
        }

        $anterior = null;
        foreach ($paradasDoDia as $ordem => $c) {
            $tempoDeslocamento = null;
            if ($anterior) {
                $dist = distancia_km(
                    (float) $anterior['latitude'], (float) $anterior['longitude'],
                    (float) $c['latitude'], (float) $c['longitude']
                );
                $tempoDeslocamento = (int) round(($dist / VELOCIDADE_MEDIA_KMH) * 60);
            }
            $horarioSugerido = HORARIOS_INICIO[$ordem] ?? '18:00:00';

            $insParada->execute([
                $diaId,
                (int) $c['vinicola_id'],
                (int) $c['id'],
                $ordem + 1,
                $horarioSugerido,
                $tempoDeslocamento,
            ]);

            $custoTotal += (float) $c['preco_por_pessoa'] * $numPessoas;
            $anterior = $c;
        }
    }

    $upd = $pdo->prepare('UPDATE roteiros SET custo_estimado = ? WHERE id = ?');
    $upd->execute([$custoTotal, $roteiroId]);

    $pdo->commit();

    json_response(carregar_roteiro_completo($pdo, $roteiroId), 201);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    json_error($e->getMessage(), 500);
}
