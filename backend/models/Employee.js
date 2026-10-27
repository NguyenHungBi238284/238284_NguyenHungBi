const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, 'Mã nhân viên là bắt buộc'],
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
    },
    gender: { type: String, trim: true, default: '' },
    dateOfBirth: { type: String, trim: true, default: '' },
    department: { type: String, trim: true, default: '' },
    position: { type: String, trim: true, default: '' },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    phone: { type: String, trim: true, default: '' },
    hireDate: { type: String, trim: true, default: '' },
    status: { type: String, trim: true, default: 'Đang làm việc' },
  },
  { timestamps: true, collection: 'employees' }
);

module.exports = mongoose.model('Employee', employeeSchema);
