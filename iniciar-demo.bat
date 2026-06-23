@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo    Uva ^& Via - servidor local da demo
echo ============================================
echo.
echo O navegador vai abrir em http://localhost:8000
echo DEIXE ESTA JANELA ABERTA durante a apresentacao.
echo Para encerrar: feche a janela ou pressione Ctrl+C.
echo.

REM Abre o navegador depois de 2s (tempo do servidor subir), em processo separado.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8000"

where python >nul 2>nul
if %errorlevel%==0 ( python -m http.server 8000 & goto fim )

where py >nul 2>nul
if %errorlevel%==0 ( py -m http.server 8000 & goto fim )

where node >nul 2>nul
if %errorlevel%==0 ( npx --yes http-server -p 8000 -c-1 & goto fim )

echo [ERRO] Nao encontrei Python nem Node nesta maquina.
echo  - Instale o Python em https://www.python.org/downloads/ (marque "Add to PATH") e rode de novo,
echo  - ou abra a pasta no VS Code e use a extensao "Live Server" sobre o index.html.
echo.
pause
:fim
