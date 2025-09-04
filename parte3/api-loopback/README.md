# API LoopBack REST — Gestão de Eventos (Parte 3)

- Porta: **3001**
- Explorer/Swagger: **http://localhost:3001/explorer**

## Endpoints
- `/users`, `/venues`, `/events`, `/tickets` (CRUD)
- `/venues/{id}/events` (1→n)
- `/events/{id}/tickets` (1→n)
- Filtros em `/events`: `?q=`, `?status=`, `?venueId=`, `?dateFrom=`, `?dateTo=`
