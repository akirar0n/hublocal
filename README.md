# HubLocal 🚀

A plataforma definitiva que conecta **clientes locais** a **trabalhadores autônomos e microempreendedores**. O HubLocal permite o cálculo de proximidade geográfica real entre a necessidade e o prestador, suporte à economia circular através de **Propostas de Permuta**, e um ciclo de vida de serviço transparente.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js + Express** (API REST)
- **TypeScript** (Tipagem forte)
- **Prisma ORM** (Modelagem de Banco de Dados)
- **MySQL 8+** (Persistência com suporte rápido a dados espaciais via Haversine no App)
- **Zod** (Validação de schemas)
- **JWT + bcrypt** (Autenticação Stateless Segura)
- **Jest + Supertest** (Testes de integração)

### Frontend
- **React + Vite** (Performance e HMR)
- **React Router DOM** (Navegação baseada em funções `CLIENTE` e `TRABALHADOR`)
- **React Bootstrap** (Design moderno, flexível e responsivo)
- **Leaflet + React-Leaflet** (Mapas interativos e geolocalização por navegador)
- **Axios** (Integração com API)

---

## 📂 Estrutura de Pastas (Monorepo Simulado)
```text
/hublocal
  ├── backend/           # API e Banco de dados
  │   ├── prisma/        # Schema e Seed (População de dados)
  │   ├── src/           # Controllers, Services, Middlewares
  │   ├── package.json
  │   └── .env.example
  ├── frontend/          # Single Page Application
  │   ├── src/           # Componentes, Páginas, AuthContext
  │   ├── package.json
  │   └── .env.example
  ├── docker-compose.yml # Orquestração completa
  └── README.md
```

---

## ⚙️ Configurações Iniciais

Você pode executar o projeto **via Docker** ou **Localmente**.

### Opção 1: Via Docker (Mais fácil)
1. Crie os seguintes arquivos `Dockerfile` dentro da pasta `backend` e `frontend` respectivamente (ou simplesmente utilize Node local caso não queira buildar as imagens customizadas).
2. Na raiz do projeto, execute:
```bash
docker-compose up -d --build
```
Isso subirá o MySQL na porta 3306, o Backend na porta 3000 e o Frontend na porta 5173.


### Opção 2: Localmente (Sem Docker)

#### 1. Banco de Dados (MySQL)
Garanta que você possua o MySQL 8+ rodando localmente na porta `3306` com o usuário `root` (sem senha, ou com a senha mapeada no seu `.env`).

#### 2. Configurando o Backend
```bash
cd backend
npm install
```
Copie o arquivo `.env.example` para `.env` e ajuste as credenciais se necessário:
```env
DATABASE_URL="mysql://root:@localhost:3306/hublocal"
```

Execute as migrations e popule o banco (Seed):
```bash
npx prisma migrate dev --name init
```
O Seed criará 2 clientes, 5 trabalhadores e 8 serviços para você testar!

Inicie o backend:
```bash
npm run dev
```

#### 3. Configurando o Frontend
```bash
cd frontend
npm install
```
Copie o arquivo `.env.example` para `.env` e confirme a URL da API:
```env
VITE_API_URL="http://localhost:3000/api"
```
Inicie o frontend:
```bash
npm run dev
```
Acesse: `http://localhost:5173`

---

## 🛡️ Segurança (Regras Implementadas)
- O contato do Trabalhador e do Cliente (`telefone`/`whatsapp`) **nunca viaja pela rede** enquanto a proposta estiver no status `PENDENTE`.
- Usuários autenticados como `CLIENTE` não conseguem acessar rotas de manipulação de serviços de `TRABALHADOR` (Middlewares de Role).
- Propostas que não aceitam Permuta bloqueiam a criação de negociações do tipo `PERMUTA` diretamente na validação do Backend.
- Senhas salvas com hash `bcrypt`. 
- SQL Injections mitigados integralmente com consultas protegidas do Prisma Client.

---

## 🧪 Executando os Testes (Backend)
No diretório `backend`, caso tenha instalado o Jest:
```bash
npm install -D jest ts-jest supertest @types/jest @types/supertest
npx jest
```
*(No código entregue há exemplos das regras centrais testadas como Autenticação e Propostas).*

---

## 📖 Endpoints Principais da API REST

| Rota | Método | Descrição | Roles |
|---|---|---|---|
| `/api/auth/register` | `POST` | Cria nova conta (Cliente ou Trabalhador). | Pública |
| `/api/auth/login` | `POST` | Retorna o JWT. | Pública |
| `/api/servicos` | `GET` | Busca com cálculo Haversine de distância. | Pública |
| `/api/servicos` | `POST` | Cria serviço. | `TRABALHADOR` |
| `/api/propostas` | `POST` | Envia proposta financeira ou permuta. | `CLIENTE` |
| `/api/propostas/:id/aceitar`| `PATCH`| Aceita Proposta e Libera Contato. | `TRABALHADOR` |
| `/api/avaliacoes` | `POST` | Avalia um serviço (Somente p/ status Concluído). | `CLIENTE` |

---
**HubLocal** — Conectando habilidades vizinhas! 🤝
