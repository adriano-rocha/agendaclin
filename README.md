# AgendaClin

Sistema de agendamento para clínica multiespecialidade (psicólogo, nutricionista, dentista etc.), desenvolvido como projeto didático de portfólio, cobrindo de ponta a ponta as competências técnicas exigidas de um desenvolvedor júnior fullstack.

🔗 **Aplicação em produção:** https://agendaclin-dun.vercel.app
🔗 **API em produção:** https://agendaclin-xqo0.onrender.com

## 🎯 Objetivo

Projeto construído do zero simulando um fluxo profissional de desenvolvimento: levantamento de requisitos, modelagem de negócio, arquitetura em camadas (Clean Architecture), testes automatizados e deploy.

## 🧱 Stack

**Backend**
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- JWT (autenticação) + bcrypt (hash de senha)
- Jest + Supertest (testes unitários e de integração)

**Frontend**
- React + TypeScript + Vite
- Hooks (useState, useEffect)
- Context API
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

**Infraestrutura**
- Docker (backend)
- Deploy: Vercel (frontend) e Render (backend)
- Banco de produção: Neon (PostgreSQL)

## 🏗️ Arquitetura

Backend estruturado em Clean Architecture, separado em camadas `domain`, `application` e `infra`, isolando regra de negócio de detalhes técnicos (banco, framework).

## ✅ Funcionalidades

- Cadastro e autenticação de usuários (paciente/admin)
- CRUD de agendamentos com verificação de conflito de horário (por profissional e por paciente)
- Fluxo de status: pendente → confirmado → concluído/cancelado
- Cancelamento com regra de antecedência mínima
- Dashboard com métricas rápidas
- Gestão de perfil (editar dados, trocar senha)
- Paginação e filtros em listagens
- Notificações (toasts) de sucesso e erro
- Tratamento global de erros
- Testes automatizados (unitários e integração)

## 🚧 Status

Concluído — MVP completo e em produção (frontend, backend e banco de dados).

## 🚀 Como rodar localmente

### Backend

```bash
cd backend
npm install
# configure o .env com base no .env.example (DATABASE_URL, JWT_SECRET)
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# configure o .env com base no .env.example (VITE_API_URL)
npm run dev
```

## 📄 Licença

Projeto de fins didáticos...