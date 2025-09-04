# ---- build ----
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# ---- runtime ----
FROM node:20
WORKDIR /app
# instalar as deps de produção (inclui express)
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production
# servir os ficheiros construídos
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
ENV PORT=3002
EXPOSE 3002
CMD ["node","server.js"]