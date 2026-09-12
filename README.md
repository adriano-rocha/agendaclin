# AgendaClin

Sistema de agendamento para clínica multiespecialidade (psicólogo, nutricionista, dentista etc.), desenvolvido como projeto didático de portfólio, cobrindo de ponta a ponta as competências técnicas exigidas de um desenvolvedor júnior fullstack — do levantamento de requisitos ao deploy em produção com pagamento real integrado.

🔗 **Aplicação em produção:** https://agendaclin-sp.vercel.app
🔗 **API em produção:** https://agendaclin-xqo0.onrender.com

## 🎯 Objetivo

Projeto construído do zero simulando um fluxo profissional de desenvolvimento: levantamento de requisitos, modelagem de negócio, arquitetura em camadas (Clean Architecture), testes automatizados, deploy em produção e integração com um gateway de pagamento real (em modo de testes).

## 🧱 Stack

**Backend**
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- JWT (autenticação) + bcrypt (hash de senha)
- Stripe (Checkout + Webhooks)
- Jest + Supertest (testes unitários e de integração)

**Frontend**
- React + TypeScript + Vite
- Hooks (useState, useEffect)
- Context API
- Tailwind CSS
- React Router
- Axios
- React Hot Toast
- Recharts (gráficos do dashboard)

**Infraestrutura**
- Docker (backend)
- Deploy: Vercel (frontend) e Render (backend)
- Banco de produção: Neon (PostgreSQL)

## 🏗️ Arquitetura

Backend estruturado em Clean Architecture, separado em camadas `domain`, `application` e `infra`, isolando regra de negócio de detalhes técnicos (banco, framework, gateway de pagamento).

## ✅ Funcionalidades

**Autenticação e perfil**
- Cadastro e autenticação de usuários (paciente/admin) com JWT + bcrypt
- Gestão de perfil (editar dados, trocar senha)

**Agendamentos**
- CRUD de agendamentos com verificação de conflito de horário (por profissional e por paciente)
- Fluxo de status: pendente → confirmado (via pagamento ou admin) → concluído/cancelado
- Cancelamento com regra de antecedência mínima (2h)
- Seleção visual de horário (grade de chips, com horários já ocupados desabilitados automaticamente)
- Mini-calendário visual para seleção de data
- Visualização em lista e em agenda semanal (calendário)
- Agendamentos vencidos somem automaticamente da listagem padrão após 24h

**Pagamento**
- Checkout de pagamento via Stripe, com preço por especialidade
- Confirmação automática do agendamento via webhook, ao pagamento ser aprovado

**Dashboard**
- Dashboard diferenciado por perfil: métricas e gráficos completos para admin (total, pendentes, confirmados, faltas), e visão simplificada com a próxima consulta para o paciente
- Cards de métrica clicáveis, abrindo a lista detalhada de cada categoria

**Geral**
- Paginação e filtros em listagens
- Notificações (toasts) de sucesso e erro
- Tratamento global de erros
- Testes automatizados (unitários e integração)
- Design autoral (paleta própria, sidebar com seções, microinterações), sem visual genérico de template

## 🚧 Status

Concluído — projeto completo e em produção (frontend, backend, banco de dados e pagamento), com todos os fluxos testados de ponta a ponta.

## 🚀 Como rodar localmente

### Backend

```bash
cd backend
npm install
# configure o .env com base no .env.example
# (DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, FRONTEND_URL)
npx prisma migrate dev
npm run dev
```

Para testar o fluxo de pagamento localmente, é necessário também rodar a [Stripe CLI](https://stripe.com/docs/stripe-cli) encaminhando eventos para o backend:

```bash
stripe listen --forward-to localhost:3000/webhooks/stripe
```

### Frontend

```bash
cd frontend
npm install
# configure o .env com base no .env.example (VITE_API_URL)
npm run dev
```

## 📄 Licença

Projeto de fins didáticos, sem finalidade comercial. Dados, profissionais e clínica são fictícios.
