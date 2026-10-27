#!/bin/sh
set -e
# Ghi địa chỉ Backend API (lấy từ biến môi trường API_URL) vào config.js khi container khởi động
printf 'window.__APP_CONFIG__ = { API_URL: "%s" };\n' "${API_URL}" > /usr/share/nginx/html/config.js
