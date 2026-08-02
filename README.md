# AgendaClin

Sistema de agendamento para clínica multiespecialidade (psicólogo, nutricionista, dentista etc.), desenvolvido como projeto didático de portfólio, cobrindo de ponta a ponta as competências técnicas exigidas de um desenvolvedor júnior fullstack.

## 🎯 Objetivo

Projeto construído do zero simulando um fluxo profissional de desenvolvimento: levantamento de requisitos, modelagem de negócio, arquitetura em camadas (Clean Architecture), testes automatizados e deploy.

## 🧱 Stack

**Backend**
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- JWT (autenticação) + bcrypt (hash de senha)
- Jest (testes unitários e de integração)

**Frontend**
- React + TypeScript
- Hooks (useState, useEffect)
- Context API

**Infraestrutura**
- Docker + Docker Compose
- Deploy: Vercel (frontend) e Render (backend)

## 🏗️ Arquitetura

Backend estruturado em Clean Architecture, separado em camadas `domain`, `application` e `infra`, isolando regra de negócio de detalhes técnicos (banco, framework).

## ✅ Funcionalidades

- Cadastro e autenticação de usuários (paciente/admin)
- CRUD de agendamentos com verificação de conflito de horário
- Fluxo de status: pendente → confirmado → concluído/cancelado
- Paginação e filtros em listagens
- Tratamento global de erros
- Testes automatizados (unitários e integração)

## 🚧 Status

Em desenvolvimento — projeto de estudo/portfólio.

## 🚀 Como rodar

_(em breve — instruções após o setup do ambiente)_

## 📄 Licença

Projeto de fins didáticos...