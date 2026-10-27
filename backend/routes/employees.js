const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

const FIELDS = [
  'employeeId', 'fullName', 'gender', 'dateOfBirth', 'department',
  'position', 'email', 'phone', 'hireDate', 'status',
];

const pick = (body) => {
  const data = {};
  FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Tìm theo _id (24 ký tự hex) hoặc theo mã nhân viên
const idFilter = (id) =>
  /^[0-9a-fA-F]{24}$/.test(id)
    ? { $or: [{ _id: id }, { employeeId: id }] }
    : { employeeId: id };

const handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: errors.join('; '), errors });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Mã nhân viên đã tồn tại' });
  }
  console.error(err.message);
  return res.status(500).json({ message: 'Lỗi máy chủ' });
};

// GET /api/employees?search=...
router.get('/', async (req, res) => {
  try {
    const search = (req.query.search || '').trim();
    const filter = search
      ? {
          $or: [
            { employeeId: { $regex: escapeRegex(search), $options: 'i' } },
            { fullName: { $regex: escapeRegex(search), $options: 'i' } },
          ],
        }
      : {};
    const employees = await Employee.find(filter).sort({ employeeId: 1 });
    res.json(employees);
  } catch (err) {
    handleError(err, res);
  }
});

// GET /api/employees/:id
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOne(idFilter(req.params.id));
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json(employee);
  } catch (err) {
    handleError(err, res);
  }
});

// POST /api/employees
router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(pick(req.body));
    res.status(201).json(employee);
  } catch (err) {
    handleError(err, res);
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      idFilter(req.params.id),
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json(employee);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete(idFilter(req.params.id));
    if (!employee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }
    res.json({ message: 'Đã xóa nhân viên', employeeId: employee.employeeId });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
