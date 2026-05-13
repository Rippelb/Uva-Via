<?php
require __DIR__ . '/config/helpers.php';

json_response([
    'nome' => 'Uva & Via API',
    'versao' => '1.0',
    'base' => '/Uva-Via/api',
    'endpoints' => [
        'GET  /vinicolas.php'                                  => 'Lista vinicolas',
        'GET  /vinicolas.php?id={id}'                          => 'Detalhe da vinicola + experiencias',
        'GET  /experiencias.php'                               => 'Lista experiencias (filtros: vinicola_id, categoria_id, tags=1,2,3, preco_max, busca)',
        'GET  /experiencias.php?id={id}'                       => 'Detalhe da experiencia + tags',
        'GET  /tags.php'                                       => 'Lista tags de interesse',
        'GET  /perfis.php'                                     => 'Lista perfis de viagem',
        'GET  /categorias.php'                                 => 'Lista categorias de experiencia',
        'GET  /horarios.php'                                   => 'Lista horarios (filtros: vinicola_id, experiencia_id, data, data_inicio, data_fim, incluir_lotados)',
        'GET  /visitantes.php?email={email}'                   => 'Busca visitante por email',
        'POST /visitantes.php'                                 => 'Cria/atualiza visitante { nome_completo, email, telefone? }',
        'GET  /reservas.php?email={email}'                     => 'Lista reservas do visitante',
        'POST /reservas.php'                                   => 'Cria reserva { horario_id, num_pessoas, visitante_id | visitante:{...} }',
        'DELETE /reservas.php?id={id}'                         => 'Cancela reserva (devolve vagas)',
        'GET  /roteiros.php?email={email}'                     => 'Lista roteiros do visitante',
        'GET  /roteiros.php?id={id}'                           => 'Detalhe do roteiro com dias e paradas',
        'POST /roteiros.php'                                   => 'Gera roteiro { num_dias, num_pessoas, orcamento_total, perfil_id, tag_ids:[...], data_inicio?, visitante:{...} }',
    ],
]);
