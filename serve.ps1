# =============================================================
# serve.ps1 - Servidor estatico de demo do Uva & Via, SEM dependencias.
# Usa System.Net.HttpListener (.NET, presente em qualquer Windows), entao
# funciona mesmo em PC sem Python, Node ou XAMPP (ex.: PC da escola).
# Servidor estatico: o app e guest-first/100% client-side, nao precisa do
# backend PHP. Chamado pelo iniciar-demo.bat como ultimo recurso.
# =============================================================
$ErrorActionPreference = 'Stop'
# Raiz: funciona tanto via "-File serve.ps1" quanto via "iex (Get-Content serve.ps1)".
# Nesse ultimo caso nao ha contexto de script, entao caimos no diretorio atual
# (o iniciar-demo.bat faz cd para a pasta do projeto antes de chamar).
$root = if ($PSScriptRoot) { $PSScriptRoot }
        elseif ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path }
        else { (Get-Location).Path }
$port = 8000

$mime = @{
    '.html'        = 'text/html; charset=utf-8'
    '.htm'         = 'text/html; charset=utf-8'
    '.js'          = 'application/javascript; charset=utf-8'
    '.mjs'         = 'application/javascript; charset=utf-8'
    '.css'         = 'text/css; charset=utf-8'
    '.json'        = 'application/json; charset=utf-8'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
    '.svg'         = 'image/svg+xml'
    '.png'         = 'image/png'
    '.jpg'         = 'image/jpeg'
    '.jpeg'        = 'image/jpeg'
    '.gif'         = 'image/gif'
    '.ico'         = 'image/x-icon'
    '.webp'        = 'image/webp'
    '.woff'        = 'font/woff'
    '.woff2'       = 'font/woff2'
    '.ttf'         = 'font/ttf'
    '.map'         = 'application/json; charset=utf-8'
    '.txt'         = 'text/plain; charset=utf-8'
    '.md'          = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
# Prefixo "localhost" e permitido sem admin na maioria dos Windows.
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
} catch {
    Write-Host ""
    Write-Host "[ERRO] Nao consegui abrir a porta ${port}: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host " - Talvez a porta ja esteja em uso (feche outra janela do servidor)."
    Write-Host ""
    Read-Host "Pressione Enter para fechar"
    exit 1
}

Write-Host "[OK] Servindo a pasta da demo em http://localhost:$port  (servidor PowerShell, sem dependencias)."
Write-Host "DEIXE ESTA JANELA ABERTA. Para encerrar: feche a janela ou pressione Ctrl+C."
$rootFull = [System.IO.Path]::GetFullPath($root)

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
    } catch {
        break
    }
    $req = $ctx.Request
    $res = $ctx.Response
    try {
        $rel = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath)
        if ($rel -eq '/' -or $rel -eq '') { $rel = '/index.html' }

        $ext = [System.IO.Path]::GetExtension($rel).ToLowerInvariant()
        # Sem backend: o app cai em modo convidado (guest-first). Responder 404
        # para .php deixa o api-client tratar como "backend ausente" de forma limpa.
        if ($ext -eq '.php') {
            $res.StatusCode = 404
            $res.Close()
            continue
        }

        $path = Join-Path $root ($rel.TrimStart('/') -replace '/', '\')
        $full = [System.IO.Path]::GetFullPath($path)

        # Bloqueia path traversal (sair da pasta raiz).
        if (-not $full.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
            $res.StatusCode = 403
            $res.Close()
            continue
        }
        if (Test-Path -LiteralPath $full -PathType Container) {
            $full = Join-Path $full 'index.html'
        }

        if (Test-Path -LiteralPath $full -PathType Leaf) {
            $ct = $mime[[System.IO.Path]::GetExtension($full).ToLowerInvariant()]
            if (-not $ct) { $ct = 'application/octet-stream' }
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $res.ContentType = $ct
            $res.Headers['Cache-Control'] = 'no-cache'
            $res.ContentLength64 = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 - arquivo nao encontrado')
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        try { $res.StatusCode = 500 } catch {}
    } finally {
        try { $res.OutputStream.Close() } catch {}
    }
}
