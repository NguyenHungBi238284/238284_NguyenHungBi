require('dotenv').config();
const dns = require('dns');
if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(',').map((s) => s.trim()));
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 5000;

// CLIENT_URL: địa chỉ Frontend được phép gọi API (nhiều địa chỉ cách nhau bằng dấu phẩy,
// không có dấu / ở cuối). Nếu để trống thì cho phép mọi nguồn.
const allowed = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: allowed.length ? allowed : true }));
app.use(express.json());

app.get('/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    database: states[mongoose.connection.readyState] || 'unknown',
    uptime: Math.round(process.uptime()),
  });
});

app.use('/api/employees', employeeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy đường dẫn' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Dữ liệu JSON không hợp lệ' });
  }
  console.error(err.message);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

if (!process.env.MONGODB_URI) {
  console.error('Thiếu biến môi trường MONGODB_URI');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Đã kết nối MongoDB Atlas');
    app.listen(PORT, () => console.log(`API chạy tại cổng ${PORT}`));
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  });
