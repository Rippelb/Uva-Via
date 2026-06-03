<?php
require __DIR__ . '/config/helpers.php';

json_response([
    'nome' => 'Uva & Via API',
    'versao' => '2.0',
    'base' => '/Uva-Via/api',
    'auth' => 'Sessao PHP via cookie UVAVIA_SID. POST/PUT/DELETE exigem header X-CSRF-Token (obtido em /auth/me.php ou /auth/login.php).',
    'roles' => ['adm_supremo', 'adm_vinicola', 'usuario'],
    'endpoints' => [
        // Auth
        'POST /auth/login.php'           => 'Login { email, senha } -> { user, csrf }',
        'POST /auth/logout.php'          => 'Destroi sessao',
        'POST /auth/register.php'        => 'Cria usuario role=usuario { nome_completo, email, senha }',
        'GET  /auth/me.php'              => 'Retorna { user, csrf }. user=null se anonimo',
        'POST /auth/change-password.php' => 'Troca senha { senha_atual, senha_nova }',
        'POST /auth/forgot-password.php' => 'Gera token de recuperacao (anon) { email } -> { token, expira_em }',
        'POST /auth/reset-password.php'  => 'Troca senha com token (anon) { token, senha_nova }',

        // Catalogo publico (GET sem auth)
        'GET  /vinicolas.php'            => 'Lista vinicolas',
        'GET  /vinicolas.php?id={id}'    => 'Detalhe + experiencias',
        'GET  /experiencias.php'         => 'Filtros: vinicola_id, categoria_id, tags=1,2,3, preco_max, busca',
        'GET  /horarios.php'             => 'Filtros: vinicola_id, experiencia_id, data, data_inicio, data_fim',
        'GET  /tags.php'                 => 'Tags de interesse',
        'GET  /perfis.php'               => 'Perfis de viagem',
        'GET  /categorias.php'           => 'Categorias de experiencia',

        // CRUD vinicolas (adm_supremo)
        'POST   /vinicolas.php'          => '[adm_supremo] cria vinicola',
        'PUT    /vinicolas.php?id={id}'  => '[adm_supremo] atualiza vinicola',
        'DELETE /vinicolas.php?id={id}'  => '[adm_supremo] remove vinicola',

        // CRUD experiencias (adm_supremo OU adm_vinicola na propria)
        'POST   /experiencias.php'       => '[adm_supremo|adm_vinicola] cria experiencia { vinicola_id, ..., tag_ids:[] }',
        'PUT    /experiencias.php?id={id}' => '[adm_supremo|adm_vinicola] atualiza',
        'DELETE /experiencias.php?id={id}' => '[adm_supremo|adm_vinicola] remove',

        // CRUD horarios (adm_supremo OU adm_vinicola na propria)
        'POST   /horarios.php'           => '[adm_supremo|adm_vinicola] cria horario { vinicola_id, experiencia_id, data, horario, capacidade_maxima }',
        'PUT    /horarios.php?id={id}'   => '[adm_supremo|adm_vinicola] atualiza data/horario/capacidade',
        'DELETE /horarios.php?id={id}'   => '[adm_supremo|adm_vinicola] remove (so se sem reservas)',

        // Usuarios
        'GET  /usuarios.php'             => '[adm_supremo] lista (filtros: role, vinicola_id)',
        'GET  /usuarios.php?id={id}'     => 'Adm ve qualquer; outros ve o proprio',
        'POST /usuarios.php'             => '[adm_supremo] cria usuario com role e vinicola_id',
        'PUT  /usuarios.php?id={id}'     => 'Adm edita role/vinculo; user edita proprio nome/telefone',
        'DELETE /usuarios.php?id={id}'   => '[adm_supremo] remove',

        // Reservas (auth required)
        'GET  /reservas.php'             => 'Lista escopada: usuario ve as proprias, adm_vinicola da vinicola, adm_supremo todas',
        'POST /reservas.php'             => 'Cria reserva { horario_id, num_pessoas } usando user logado',
        'DELETE /reservas.php?id={id}'   => 'Cancela (devolve vagas)',

        // Roteiros (auth required)
        'GET  /roteiros.php'             => 'Lista escopada por role',
        'GET  /roteiros.php?id={id}'     => 'Detalhe com dias e paradas',
        'POST /roteiros.php'             => 'Gera roteiro { num_dias, num_pessoas, orcamento_total, perfil_id, tag_ids:[], data_inicio? }',
    ],
    'admin_default' => [
        'email' => 'admin@uvaevia.local',
        'senha' => 'trocar123',
        'observacao' => 'Forcado a trocar senha no primeiro login (must_change_password=1).',
    ],
]);
