FROM node:20-alpine

WORKDIR /app

# Cài thư viện trước để tận dụng cache của Docker
COPY package*.json ./
RUN npm ci --omit=dev

# Chép mã nguồn (.env bị loại bởi .dockerignore)
COPY . .

ENV NODE_ENV=production
EXPOSE 5000

USER node
CMD ["node", "server.js"]
