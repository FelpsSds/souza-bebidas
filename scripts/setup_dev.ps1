<#
  scripts/setup_dev.ps1
  Automatiza o setup de desenvolvimento:
  - sobe o Postgres via Docker Compose (apenas serviço db)
  - instala dependências do backend e frontend
  - gera Prisma client, roda migrations e seed
  - opcional: inicia os servidores dev (backend e frontend)

  Uso:
    .\scripts\setup_dev.ps1           # executa setup (não inicia servidores)
    .\scripts\setup_dev.ps1 -RunServers  # também inicia backend e frontend
#>

param(
  [switch]$RunServers
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

$root = Resolve-Path "$PSScriptRoot\.."
Set-Location $root

Write-Info "Root do projeto: $root"

# 1) subir DB via Docker Compose
if (Get-Command docker -ErrorAction SilentlyContinue) {
  Write-Info "Subindo serviço 'db' com Docker Compose..."
  docker compose up -d db
  if ($LASTEXITCODE -ne 0) { Write-Err "Falha ao subir container db"; exit 1 }
} else {
  Write-Err "Docker não encontrado na máquina. Por favor instale o Docker e reexecute o script.";
}

# 2) backend: instalar deps, gerar prisma, migrations e seed
if (Test-Path "backend"){
  Push-Location backend
  Write-Info "Instalando dependências do backend..."
  npm install

  if (Get-Command npx -ErrorAction SilentlyContinue) {
    Write-Info "Gerando Prisma client..."
    npx prisma generate
  } else {
    Write-Err "npx não encontrado. Verifique sua instalação do Node.js/npm."
  }

  Write-Info "Rodando migrations e seed (prisma)..."
  npm run db:setup
  Pop-Location
} else {
  Write-Err "Pasta 'backend' não encontrada"
}

# 3) frontend: instalar deps
if (Test-Path "frontend"){
  Push-Location frontend
  Write-Info "Instalando dependências do frontend..."
  npm install
  Pop-Location
} else {
  Write-Err "Pasta 'frontend' não encontrada"
}

if ($RunServers) {
  Write-Info "Iniciando servidores de desenvolvimento (background)..."
  # backend
  Start-Process -NoNewWindow -FilePath "npm" -ArgumentList 'run','dev' -WorkingDirectory "$root\backend"
  Start-Sleep -Seconds 2
  # frontend
  Start-Process -NoNewWindow -FilePath "npm" -ArgumentList 'run','dev' -WorkingDirectory "$root\frontend"
  Write-Info "Servidores iniciados. Verifique terminais para logs.";
}

Write-Info "Setup concluído."
