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

REM Abre o navegador depois de 3s (tempo do servidor subir), em processo separado.
start "" cmd /c "timeout /t 3 >nul & start http://localhost:8000"

REM Escolhe um servidor disponivel, na ordem mais confiavel (Windows + XAMPP).
REM O PHP do XAMPP serve o site E roda o backend api/*.php (login/Gestao).
REM Sem MySQL ligado, o app continua 100%% funcional em modo convidado.
if exist "C:\xampp\php\php.exe" goto php_xampp
where php  >nul 2>nul && goto php_path
where node >nul 2>nul && goto node
py -3 -c "import sys" >nul 2>nul && goto py
python -c "import sys" >nul 2>nul && goto python
goto erro

:php_xampp
echo [OK] Servindo com PHP do XAMPP (inclui backend).
"C:\xampp\php\php.exe" -S localhost:8000
goto fim

:php_path
echo [OK] Servindo com PHP.
php -S localhost:8000
goto fim

:node
echo [OK] Servindo com Node (http-server).
npx --yes http-server -p 8000 -c-1
goto fim

:py
echo [OK] Servindo com Python (py launcher).
py -3 -m http.server 8000
goto fim

:python
echo [OK] Servindo com Python.
python -m http.server 8000
goto fim

:erro
echo.
echo [ERRO] Nao encontrei PHP, Node nem Python para subir o servidor na porta 8000.
echo  - Com XAMPP, o PHP fica em C:\xampp\php\php.exe (repare a instalacao se sumiu).
echo  - Ou instale Node: https://nodejs.org
echo  - Ou instale Python: https://www.python.org/downloads/ (marque "Add to PATH").
echo.
pause

:fim