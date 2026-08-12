# Souza Bebidas — Sistema de Comércio e Gestão

Este repositório contém o frontend (React + Vite + Tailwind) e o backend (Node + Express + Prisma + PostgreSQL) do projeto Souza Bebidas.

Este README descreve como configurar o ambiente de desenvolvimento local, rodar o banco, aplicar migrations e popular dados (seed), além de executar frontend e backend.

## Requisitos
- Node.js (>= 18)
- npm ou yarn
- Docker & Docker Compose (recomendado para rodar o Postgres localmente)

Se não tiver Docker, você pode usar um PostgreSQL local e ajustar `DATABASE_URL` conforme mostrado abaixo.

---

## Variáveis de ambiente

Crie um arquivo `.env` dentro de `backend/` com a variável:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/souza_db"
```

No frontend, é possível apontar a API com `VITE_API_BASE` (ex.: em `.env` na pasta `frontend`):

```
VITE_API_BASE=http://localhost:5000
```

---

## Rodar com Docker Compose (recomendado)

1) Subir apenas o banco (útil antes de rodar migrations/seed):

```bash
docker compose up -d db
```

2) Instalar dependências do backend e gerar cliente Prisma / rodar migrations e seed:

```bash
cd backend
npm install
npx prisma generate
npm run db:setup
```

`npm run db:setup` executa `prisma migrate dev --name init` e em seguida `node prisma/seed.js` (popula categorias e produtos iniciais).

3) Subir backend e frontend (dev):

Backend (em `backend/`):
```bash
npm run dev
```

Frontend (em `frontend/`):
```bash
cd frontend
npm install
npm run dev
```

Ou use o Docker Compose para subir os 3 serviços:

```bash
docker compose up --build
```

### Passo a passo (Windows / PowerShell)

1. Subir o banco com Docker (se quiser usar docker):

```powershell
cd "c:\Users\rivia\Documents\Souza Bebidas — Sistema de Comércio e Gestão"
docker compose up -d db
```

2. Preparar backend (instalar deps, gerar cliente Prisma, rodar migrations e seed):

```powershell
cd backend
npm install
npx prisma generate
# script helper: executa migrate + seed
npm run db:setup
```

3. Subir o backend em modo desenvolvimento:

```powershell
npm run dev
```

4. Preparar frontend e rodar dev server:

```powershell
cd ../frontend
npm install
npm run dev
```

5. Acessar frontend: abra `http://localhost:5173` (ou porta indicada pelo Vite) e o backend em `http://localhost:5000`.

### Sem Docker (Postgres local)

Se preferir não usar Docker, crie o banco Postgres local e ajuste `backend/.env` com `DATABASE_URL`. Depois rode os mesmos passos de instalação/migrate/seed acima.

### Arquivo `.env` de exemplo (backend)

Coloque em `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/souza_db"
JWT_SECRET=uma_chave_secreta_aqui
```

E no `frontend/.env` (opcional):

```env
VITE_API_BASE=http://localhost:5000
```

### Verificações rápidas

- Verifique logs do banco: `docker compose logs -f db`
- Se o `npm run db:setup` falhar, rode manualmente:

```powershell
npx prisma migrate dev --name init
node prisma/seed.js
```

---

Se quiser, eu crio um script PowerShell que executa os passos acima (subir DB, instalar dependências e rodar `db:setup`). Deseja que eu crie o script agora?

---

## Rodar sem Docker

Se você já tem um PostgreSQL local, ajuste `backend/.env` com o `DATABASE_URL` apontando para seu banco. Depois execute os passos de instalação/migrations/seed descritos acima (na seção sem Docker).

---

## Endpoints relevantes (dev)

- `GET /api/products` — lista produtos
- `POST /api/orders` — cria pedido (payload: items: [{productId, price, quantity}], phone, name, address, deliveryType, notes)

---

## Observações
- Se o comando `docker` não existir na sua máquina, instale o Docker Desktop (Windows/Mac) ou Docker Engine (Linux) e reabra o terminal.
- As imagens de produtos referenciadas em `seed.js` usam caminhos relativos `/images/products/...` — você pode colocar assets em `frontend/public/images/products`.

---

Se quiser, eu posso:
- gerar um script PowerShell para automatizar `docker compose up` + `npm install` + `npm run db:setup`;
- criar página `/admin` mínima e autenticação JWT;
- configurar CI (GitHub Actions) para rodar migrations/seed no deploy.

Diga qual próximo passo prefere.
# Souza Bebidas — Sistema de Comércio e Gestão

Projeto inicial para um sistema de comércio local com frontend em React e backend em Node.js.

Estrutura proposta e passos iniciais para desenvolvimento local.

## Iniciar (resumo)

No PowerShell:

```powershell
cd "c:\Users\rivia\Documents\Souza Bebidas — Sistema de Comércio e Gestão"
cd frontend
npm install
npm run dev

# em outra aba
cd ..\backend
npm install
npm run dev
```

## Criar repositório remoto (CLI)

Se quiser que eu crie o repositório remoto automaticamente, use a CLI do GitHub (`gh`) e execute o script em `scripts/create_github_repo.ps1`.
