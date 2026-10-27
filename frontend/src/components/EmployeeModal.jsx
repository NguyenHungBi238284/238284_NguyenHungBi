import { useState } from 'react';

const EMPTY = {
  employeeId: '',
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '',
  department: '',
  position: '',
  email: '',
  phone: '',
  hireDate: '',
  status: 'Đang làm việc',
};
const GENDERS = ['Nam', 'Nữ', 'Khác'];
const STATUSES = ['Đang làm việc', 'Nghỉ phép', 'Đã nghỉ việc'];
const TITLES = {
  add: 'Thêm nhân viên mới',
  edit: 'Cập nhật nhân viên',
  view: 'Thông tin nhân viên',
};

export default function EmployeeModal({ mode, employee, busy, onClose, onSave, onEdit }) {
  const readOnly = mode === 'view';
  const [form, setForm] = useState(() => ({ ...EMPTY, ...(employee || {}) }));
  const [errors, setErrors] = useState({});

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!String(form.employeeId).trim()) e.employeeId = 'Mã nhân viên là bắt buộc';
    if (!String(form.fullName).trim()) e.fullName = 'Họ tên là bắt buộc';
    const email = String(form.email).trim();
    if (!email) e.email = 'Email là bắt buộc';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Email không hợp lệ';
    const phone = String(form.phone).trim();
    if (phone && !/^[0-9+\s.-]{8,15}$/.test(phone)) e.phone = 'Số điện thoại không hợp lệ';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const payload = {};
    Object.keys(EMPTY).forEach((k) => {
      payload[k] = typeof form[k] === 'string' ? form[k].trim() : form[k];
    });
    onSave(payload);
  };

  const renderInput = (name, label, { type = 'text', required = false, disabled = false } = {}) => (
    <div className="field">
      <label htmlFor={name}>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        value={form[name] || ''}
        onChange={set(name)}
        disabled={readOnly || disabled}
        className={errors[name] ? 'invalid' : ''}
      />
      {errors[name] && <div className="err">{errors[name]}</div>}
    </div>
  );

  const renderSelect = (name, label, options) => {
    const list = !form[name] || options.includes(form[name]) ? options : [...options, form[name]];
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <select id={name} value={form[name] || ''} onChange={set(name)} disabled={readOnly}>
          {list.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{TITLES[mode]}</h2>
          <button className="close" onClick={onClose} aria-label="Đóng" type="button">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="grid">
              {renderInput('employeeId', 'Mã nhân viên', { required: true, disabled: mode === 'edit' })}
              {renderInput('fullName', 'Họ và tên', { required: true })}
              {renderSelect('gender', 'Giới tính', GENDERS)}
              {renderInput('dateOfBirth', 'Ngày sinh', { type: 'date' })}
              {renderInput('department', 'Phòng ban')}
              {renderInput('position', 'Chức vụ')}
              {renderInput('email', 'Email', { type: 'email', required: true })}
              {renderInput('phone', 'Số điện thoại')}
              {renderInput('hireDate', 'Ngày vào làm', { type: 'date' })}
              {renderSelect('status', 'Trạng thái làm việc', STATUSES)}
            </div>
          </div>
          <div className="modal-footer">
            {readOnly ? (
              <>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Đóng
                </button>
                <button type="button" className="btn btn-primary" onClick={onEdit}>
                  Sửa thông tin
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={busy}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? 'Đang lưu...' : 'Lưu'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
