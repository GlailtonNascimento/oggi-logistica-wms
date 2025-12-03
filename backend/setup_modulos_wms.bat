@echo off
echo ================================================
echo   Criando modulos WMS (sem alterar nada existente)...
echo ================================================

REM --- Lista de Modulos ---
set "MODULOS=recebimento maturacao armazenagem expedicao relatorios auditoria friozem produtos"

REM --- Loop para criar a estrutura completa para cada modulo ---
for %%M in (%MODULOS%) do (
    echo Verificando modulo: %%M
    
    REM Garante que a pasta modules dentro de src existe
    if not exist src\modules mkdir src\modules

    REM Criacao das subpastas DENTRO de src\modules\%%M
    if not exist src\modules\%%M mkdir src\modules\%%M
    if not exist src\modules\%%M\controllers mkdir src\modules\%%M\controllers
    if not exist src\modules\%%M\models mkdir src\modules\%%M\models
    if not exist src\modules\%%M\routes mkdir src\modules\%%M\routes
    if not exist src\modules\%%M\services mkdir src\modules\%%M\services

    REM --- Criar arquivo de servico vazio somente se nao existir ---
    if not exist src\modules\%%M\services\%%MService.js (
        echo // Servico de %%M (logica sera adicionada depois) > src\modules\%%M\services\%%MService.js
    )
)

echo ================================================
echo   Estrutura de modulos criada (arquivos existentes preservados)!
echo ================================================
pause

