# Parte 2 – Gestão de Eventos  
**Design-first API + MySQL + Docker Compose**

## Objetivo
Implementar uma solução de **gestão de eventos** em arquitetura REST, cumprindo os requisitos do enunciado:
- **Design-first** com OpenAPI 3.0 (Swagger).
- CRUD completo para **Users**, **Venues**, **Events** e **Tickets**.
- Pelo menos uma relação **1:n**:
  - Venue → Events  
  - Event → Tickets
- **Filtros adicionais em `/events`**: `q`, `status`, `venueId`, `dateFrom`, `dateTo`.
- **JSON** como formato de dados.
- **MySQL** como base de dados relacional.
- **Node.js/Express** como servidor.
- **Docker Compose multi-serviço** (API + MySQL).
- **Coleção Postman** para testes.

---

## Estrutura do Projeto

```
parte2/
│
├── api/                    # API Node.js (Express + TS + MySQL2)
│   ├── src/                # Código TypeScript (controllers, db)
│   ├── openapi.yaml        # Especificação OpenAPI 3.0 (design-first)
│   ├── package.json
│   └── Dockerfile
│
├── db/                     # Base de dados
│   ├── 01_schema.sql       # Criação do schema
│   └── 02_seed.sql         # Seeds (≥30 registos/tabela)
│
├── postman/                # Coleções Postman
│   ├── Parte2-TESTS.postman_collection.json
│   └── Local-Parte2.postman_environment.json
│
├── relatorio/              # Relatório em PDF (entrega final)
│
├── docker-compose.yml      # Orquestra mysql + api
└── README.md               # Este ficheiro
```

---

## Como executar

### Pré-requisitos
- Docker + Docker Compose instalados.

### Passos
1. Entrar na pasta:
   ```bash
   cd parte2
   ```
2. Construir e subir os serviços:
   ```bash
   docker compose up --build
   ```
3. Confirmar containers:
   ```bash
   docker compose ps
   ```
   Deve aparecer:
   - `p2-mysql` → Running  
   - `p2-api`   → Running (porta 3000)

---

## Serviços Disponíveis

| Serviço   | URL                              | Descrição                |
|-----------|----------------------------------|--------------------------|
| API       | http://localhost:3000            | Endpoints REST           |
| Explorer  | http://localhost:3000/explorer   | Swagger/OpenAPI UI       |

---

## Base de Dados

- Motor: **MySQL 8**
- Porta host: **3307**
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

---

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
  - `?q=` → pesquisa por nome/descrição  
  - `?status=` → filtrar por estado  
  - `?venueId=` → filtrar por local  
  - `?dateFrom=...&dateTo=...` → intervalo de datas  

### Tickets
- CRUD completo  
- `GET /events/{id}/tickets` – listar bilhetes de um evento  

---

## Testes (Postman)

Pasta `/postman` contém:
- **Parte2-TESTS.postman_collection.json**  
- **Local-Parte2.postman_environment.json**

### Como usar
1. Importar os dois ficheiros no Postman.  
2. Selecionar ambiente **Local-Parte2**.  
3. Correr a coleção:  
   - **A) Sanidade** → GET básico  
   - **B) CRUD Encadeado** → Venue → Event → Ticket → Patch → Delete  
   - **C) Users CRUD** → ciclo completo  
   - **D) Filtros & Relações** → queries + relações  
   - **E) Erros/Validação** → casos de falha (400 e 404)

---

## Screenshots (no relatório)

- `docker compose ps` com `p2-mysql` e `p2-api` ativos  
- Swagger (`/explorer`) com endpoints visíveis  
- Exemplo de `GET /events` com resultados  
- Postman Runner com testes todos verdes  

---

## Relatório (a colocar em /relatorio)

Estrutura sugerida:
1. Introdução  
2. Objetivos & Requisitos  
3. Arquitetura (diagrama: mysql ↔ api)  
4. Modelo de Dados (ER simples)  
5. Execução (comandos + prints)  
6. Demonstração dos filtros  
7. Conclusão  

---

## Observações / Dificuldades

- **Formato de datas** → `"YYYY-MM-DD HH:MM:SS"` (sem `Z`).  
- **E-mail duplicado** → `email` em `users` é único.  
- **Seeds só na primeira vez** → necessário resetar volume para reaplicar.  
- **Validações implementadas** → 400 para dados em falta, 404 para recursos inexistentes.  

---

## Conclusão

O sistema cumpre integralmente o enunciado da Parte 2:
- API **design-first** com OpenAPI 3.0  
- MySQL com schema e seeds  
- CRUD e relações 1:n  
- Filtros em `/events`  
- Docker Compose multi-serviço  
- Coleção Postman com testes completos  
