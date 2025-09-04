# Parte 3 – Gestão de Eventos  
**Code-first API + Backoffice (React-Admin) + MySQL + Docker**

## Objetivo
Implementar uma solução completa de **gestão de eventos**, cumprindo os requisitos do enunciado:
- API **code-first** em Node.js, documentada com **OpenAPI 3.0 (Swagger)**.
- **MySQL** como base de dados relacional.
- CRUD completo para **Users**, **Venues**, **Events** e **Tickets**.
- Relações **1:n**:
  - Venue → Events  
  - Event → Tickets
- Filtros adicionais em `/events`: `q`, `status`, `venueId`, `dateFrom`, `dateTo`.
- **Seeds** (≥30 registos por tabela) aplicados no arranque.
- **Backoffice em React-Admin** para gestão gráfica.
- **Docker Compose** para orquestrar `mysql`, `api` e `admin`.
- **Postman Collection** para validar endpoints.

---

## Estrutura do Projeto

```
parte3_gestao_eventos/
│
├── api-loopback/               # API Node.js (LoopBack/Express + MySQL2)
│   ├── src/                    # Código TypeScript (controllers, db)
│   ├── db/                     # Scripts SQL (schema + seeds)
│   └── Dockerfile
│
├── admin-react/                # Backoffice React-Admin
│   ├── src/                    # Código React
│   └── Dockerfile
│
├── postman/                    # Coleções Postman
│   ├── GestaoEventos-Parte3-TESTS.postman_collection.json
│   └── Local-Parte3.postman_environment.json
│
├── relatorio/                  # Relatório em PDF (entrega final)
│
├── docker-compose.yml          # Orquestra mysql + api + admin
└── README.md                   # Este ficheiro
```

---

## Como executar

### Pré-requisitos
- Docker + Docker Compose instalados.

### Passos
1. Clonar/entrar na pasta:
   ```bash
   cd parte3_gestao_eventos
   ```
2. Construir e subir tudo:
   ```bash
   docker compose up --build
   ```
3. Confirmar containers ativos:
   ```bash
   docker compose ps
   ```
   Deve aparecer:
   - `p3-mysql` → Running  
   - `p3-api`   → Running (porta 3001)  
   - `p3-admin` → Running (porta 3002)

---

## Serviços Disponíveis

| Serviço   | URL                              | Descrição                |
|-----------|----------------------------------|--------------------------|
| API       | http://localhost:3001            | Endpoints REST           |
| Explorer  | http://localhost:3001/explorer   | Swagger/OpenAPI UI       |
| Admin     | http://localhost:3002            | Backoffice React-Admin   |

---

## Base de Dados

- Motor: **MySQL 8**
- Nome da BD: `eventosdb`
- Credenciais:  
  - user: `root`  
  - pass: `12345678`

### Estrutura (simplificada)
- **Users**: `id_user`, `name`, `email`
- **Venues**: `id_venue`, `name`, `city`, `capacity`
- **Events**: `id_event`, `id_venue`, `name`, `date`, `status`, `description`
- **Tickets**: `id_ticket`, `id_event`, `type`, `price`, `status`

### Relações
- `venues (1) → (n) events`  
- `events (1) → (n) tickets`

---

## Seeds

- **Users**: 40
- **Venues**: 30
- **Events**: 60
- **Tickets**: ≥180

Scripts:  
- `db/01_schema.sql` → cria tabelas  
- `db/02_seed.sql` → insere registos


## Endpoints Principais

### Users
- `GET /users` – listar  
- `POST /users` – criar  
- `GET /users/{id}` – obter por id  
- `PATCH /users/{id}` – atualizar parcialmente  
- `PUT /users/{id}` – substituir  
- `DELETE /users/{id}` – apagar  

### Venues
- CRUD completo  
- `GET /venues/{id}/events` – listar eventos do local  

### Events
- CRUD completo  
- Filtros:  
  - `?q=` → texto no nome/descrição  
  - `?status=` → por estado  
  - `?venueId=` → por local  
  - `?dateFrom=YYYY-MM-DD HH:MM:SS&dateTo=...`  

### Tickets
- CRUD completo  
- `GET /events/{id}/tickets` – listar bilhetes do evento  

---

## Backoffice (React-Admin)

- Interface gráfica para CRUD de Users, Venues, Events e Tickets.  
- Cada recurso com **listagem, criação, edição e eliminação**.  
- Usa `id_*` → `id` mapping para funcionar corretamente.  

---

## Testes (Postman)

Pasta `/postman` contém:
- **GestaoEventos-Parte3-TESTS.postman_collection.json**  
- **Local-Parte3.postman_environment.json**

### Como usar
1. Importar os dois ficheiros no Postman.  
2. Selecionar ambiente **Local-Parte3**.  
3. Correr a coleção:  
   - **A) Sanidade** → GET básico  
   - **B) CRUD Encadeado** → Venue → Event → Ticket → Patch → Delete  
   - **C) Users CRUD** → ciclo completo  
   - **D) Filtros & Relações** → queries + relações  
   - **E) Erros/Validação** → casos de falha

---

## Screenshots (incluidos no relatório)

- `docker compose ps` com os 3 serviços ativos.  
- Swagger (`/explorer`) com endpoints.  
- `GET /events` com resultados.  
- Admin a mostrar listas (Users, Venues, etc).  

---

## Relatório

Estrutura:
1. Introdução  
2. Objetivos & Requisitos  
3. Arquitetura (diagrama)  
4. Modelo de Dados (ER)  
5. Execução (comandos + prints)  
6. Demonstração dos filtros  
7. Conclusão  

---

## Observações / Dificuldades

- **Formato de datas** → `"YYYY-MM-DD HH:MM:SS"` (sem `Z` nem ms).  
- **E-mail duplicado** → campo `email` em `users` é único.  
- **Seeds só na primeira vez** → necessário resetar volume para reaplicar.  
- **React-Admin** → usado data provider custom para não exigir `Content-Range`.

---

## Conclusão

O sistema cumpre integralmente o enunciado da Parte 3:
- API code-first documentada (OpenAPI 3.0)  
- MySQL com schema e seeds  
- CRUD e relações 1:n  
- Filtros em `/events`  
- Backoffice React-Admin  
- Docker Compose multi-serviço  
- Coleção Postman com testes completos  
