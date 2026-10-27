# ---- Giai đoạn 1: build ứng dụng React ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Giai đoạn 2: chạy bằng nginx ----
FROM nginx:alpine
# PORT: cổng nginx lắng nghe (Render sẽ ghi đè). API_URL: địa chỉ Backend API công khai.
ENV PORT=80
ENV API_URL=https://api-238284.onrender.com
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.d/40-runtime-config.sh
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-runtime-config.sh \
 && chmod +x /docker-entrypoint.d/40-runtime-config.sh
EXPOSE 80
