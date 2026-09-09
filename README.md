# HubLocal 🚀

A plataforma que conecta **clientes locais** a **trabalhadores autônomos e microempreendedores**. O HubLocal permite o cálculo de proximidade geográfica real entre a necessidade e o prestador, suporte à economia circular através de **Propostas de Permuta**, e um ciclo de vida de serviço transparente.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js + Express** (API REST)
- **TypeScript**
- **Prisma ORM**
- **MySQL 8+** (Persistência com suporte a dados espaciais via Haversine)
- **Zod** (Validação)
- **JWT + bcrypt** (Autenticação)
- **Jest + Supertest** (Testes)

### Frontend
- **React + Vite**
- **React Router DOM**
- **React Bootstrap**
- **Leaflet + React-Leaflet** (Mapas interativos)
- **Axios** (Integração com API)

---

## 📂 Estrutura do Projeto
```text
/hublocal
  ├── backend/           # API e Banco de dados
  ├── frontend/          # Single Page Application (React)
  ├── docker-compose.yml # Orquestração dos serviços
  └── README.md
```

---

## ⚙️ Como Executar

### Via Docker
Na raiz do projeto, execute:
```bash
docker-compose up -d --build
```
Isso iniciará o MySQL, o Backend na porta 3000 e o Frontend na porta 5173.

### Localmente (Sem Docker)

#### 1. Banco de Dados
Certifique-se de ter o MySQL 8+ rodando localmente.

#### 2. Backend
```bash
cd backend
npm install
```
Configure o `.env` copiando o `.env.example`:
```env
DATABASE_URL="mysql://root:@localhost:3306/hublocal"
```
Rode as migrations e inicie:
```bash
npx prisma migrate dev
npm run dev
```

#### 3. Frontend
```bash
cd frontend
npm install
```
Configure o `.env`:
```env
VITE_API_URL="http://localhost:3000/api"
```
Inicie o frontend:
```bash
npm run dev
```
Acesse: `http://localhost:5173`

---

## 🛡️ Segurança
- O contato de Trabalhador e Cliente nunca viaja pela rede enquanto a proposta estiver pendente.
- Controle de acesso por Roles (Cliente e Trabalhador).
- Senhas protegidas com bcrypt.

---

## 📖 Endpoints Principais

| Rota | Método | Descrição | Permissão |
|---|---|---|---|
| `/api/auth/register` | `POST` | Cadastro (Cliente ou Trabalhador) | Público |
| `/api/auth/login` | `POST` | Login | Público |
| `/api/servicos` | `GET` | Busca por proximidade | Público |
| `/api/servicos` | `POST` | Criação de serviço | `TRABALHADOR` |
| `/api/propostas` | `POST` | Enviar proposta | `CLIENTE` |
| `/api/propostas/:id/aceitar`| `PATCH`| Aceitar proposta | `TRABALHADOR` |
| `/api/avaliacoes` | `POST` | Avaliar serviço | `CLIENTE` |
