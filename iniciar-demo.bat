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

REM Abre o navegador depois de 4s (tempo do servidor subir), em processo separado.
start "" cmd /c "timeout /t 4 >nul & start http://localhost:8000"

REM Escolhe um servidor disponivel. O ultimo recurso (PowerShell) roda em QUALQUER
REM Windows SEM instalar nada - e o que faz funcionar no PC do professor/escola.
if exist "C:\xampp\php\php.exe" goto php_xampp
where php >nul 2>nul && goto php_path
python -c "import sys" >nul 2>nul && goto python
goto powershell

:php_xampp
echo [OK] Servindo com PHP do XAMPP (inclui o backend).
"C:\xampp\php\php.exe" -S localhost:8000
goto fim

:php_path
echo [OK] Servindo com PHP.
php -S localhost:8000
goto fim

:python
echo [OK] Servindo com Python.
python -m http.server 8000
goto fim

:powershell
if not exist "%~dp0serve.ps1" goto erro
echo [OK] Servindo com PowerShell (sem instalar nada).
powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '%~dp0'; iex (Get-Content -Raw -LiteralPath '%~dp0serve.ps1')"
goto fim

:erro
echo.
echo [ERRO] Nao achei o serve.ps1 ao lado do .bat.
echo Baixe a pasta COMPLETA do GitHub (botao Code - Download ZIP) e rode
echo o iniciar-demo.bat de dentro dela (nao mova o .bat sozinho).
echo.
pause

:fim