@echo off
setlocal
title PharmaPro - Sistema de Farmacia
cd /d "%~dp0"

echo ==============================================
echo       INICIANDO PHARMAPRO (SISTEMA DE FARMACIA)
echo ==============================================
echo.

if not exist node_modules (
    echo Instalando dependencias de Node.js...
    call npm install
    if errorlevel 1 (
        echo No se pudieron instalar las dependencias.
        pause
        exit /b 1
    )
)

echo Iniciando API en http://127.0.0.1:3001 ...
start "PharmaPro Backend" /D "%~dp0" cmd /k "node backend/server.js"

echo Iniciando interfaz en http://127.0.0.1:4174 ...
start "PharmaPro Frontend" /D "%~dp0" cmd /k "set VITE_API_URL=http://127.0.0.1:3001&& npm run dev -- --host 127.0.0.1 --port 4174 --strictPort"

echo.
echo Se abrieron dos ventanas de servidor.
echo Interfaz: http://127.0.0.1:4174
echo API:      http://127.0.0.1:3001
echo Manten ambas ventanas abiertas mientras usas la aplicacion.
echo Si MySQL no conecta, activa MySQL en Laragon o XAMPP.
echo.
pause
