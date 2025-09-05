# 🎟️ Projeto de Gestão de Eventos

Este projeto foi desenvolvido no âmbito da unidade curricular, com o objetivo de criar uma aplicação completa de **gestão de eventos e bilhética**, com backend, frontend e base de dados integrados.

---

## 📌 Estrutura do Projeto
- **Backend (Node.js + Express + MongoDB)**  
  - Implementação das entidades principais: `Users`, `Venues`, `Events`, `Tickets`.
  - Endpoints CRUD para cada entidade.
  - Autenticação e validação de dados.
  - Documentação interativa com **Swagger**.

- **Frontend (React/Vite)**  
  - Interface gráfica para interação com a API.
  - Funcionalidades para visualizar e gerir eventos, locais e bilhetes.
  - Integração direta com o backend.

- **Base de Dados (MongoDB)**  
  - Relações 1:N entre as entidades.
  - Gestão de consistência e integridade referencial.
  - Interface de administração via **Mongo Express**.

---

## 🚀 Como Correr o Projeto

### 1. Pré-requisitos
- [Node.js](https://nodejs.org) (se quiseres correr fora do Docker)  
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)  

### 2. Clonar o repositório
```bash
git clone <URL_DO_REPOSITORIO>
cd <PASTA_DO_PROJETO>
```

### 3. Subir os serviços com Docker
```bash
docker compose build
docker compose up -d
```

### 4. Confirmar serviços
```bash
docker compose ps
```

### 5. Aceder às aplicações
- **API + Swagger** → [http://localhost:3000/api-docs](http://localhost:3000/api-docs)  
- **Frontend** → [http://localhost:3001](http://localhost:3001)  
- **Mongo Express** → [http://localhost:8081](http://localhost:8081)  

### 6. (Opcional) Executar seed de dados
```bash
docker compose exec api npm run seed
```

### 7. Parar os serviços
```bash
docker compose down
```

---

## 📂 Estrutura de Pastas
```
parteX/
│── backend/        # Código da API (Node.js/Express)
│── frontend/       # Código do Frontend (React/Vite)
│── docker-compose.yml
│── README.md
```

---

## ✅ Funcionalidades Implementadas
- CRUD completo para **Users**, **Venues**, **Events** e **Tickets**.
- Documentação automática com **Swagger**.
- Integração Frontend ↔ Backend ↔ Base de Dados.
- Gestão de dados em MongoDB.
- Deploy local com **Docker Compose**.

---

## 📸 Demonstração
- Prints do **Swagger** com endpoints visíveis.  
- Prints de **chamadas GET/POST** no Swagger/Postman.  
- Prints do **frontend a correr**.  

---

## 👥 Autoria
Projeto desenvolvido por **[Teu Nome]**, no âmbito da unidade curricular de [Nome da UC].

---
