# ---- build ----
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- runtime ----
FROM node:20
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production
COPY --from=build /app/dist ./dist
COPY db ./db
EXPOSE 3001
CMD ["node","dist/index.js"]