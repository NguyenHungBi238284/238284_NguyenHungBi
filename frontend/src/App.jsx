import { useCallback, useEffect, useRef, useState } from 'react';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from './api';
import EmployeeModal from './components/EmployeeModal';
import ConfirmDialog from './components/ConfirmDialog';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // { mode: 'add' | 'view' | 'edit', employee }
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const requestId = useRef(0);

  const showToast = useCallback((type, message) => {
    clearTimeout(toastTimer.current);
    setToast({ type, message });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const loadEmployees = useCallback(async (keyword) => {
    const id = ++requestId.current;
    setLoading(true);
    setLoadError('');
    try {
      const data = await getEmployees(keyword);
      if (id !== requestId.current) return;
      setEmployees(data);
    } catch (err) {
      if (id !== requestId.current) return;
      setLoadError(err.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Tải danh sách (có tìm kiếm), chờ 300ms sau khi người dùng ngừng gõ
  useEffect(() => {
    const timer = setTimeout(() => loadEmployees(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search, loadEmployees]);

  const handleSave = async (payload) => {
    setBusy(true);
    try {
      if (modal.mode === 'add') {
        await createEmployee(payload);
        showToast('success', 'Thêm nhân viên thành công');
      } else {
        await updateEmployee(modal.employee._id, payload);
        showToast('success', 'Cập nhật nhân viên thành công');
      }
      setModal(null);
      await loadEmployees(search.trim());
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await deleteEmployee(toDelete._id);
      showToast('success', `Đã xóa nhân viên ${toDelete.fullName}`);
      setToDelete(null);
      await loadEmployees(search.trim());
    } catch (err) {
      showToast('error', err.message);
      setToDelete(null);
    } finally {
      setBusy(false);
    }
  };

  const statusClass = (status) =>
    status === 'Đang làm việc' ? 'badge badge-active' : 'badge badge-other';

  return (
    <div className="container">
      <div className="header">
        <h1>Hệ thống quản lý nhân sự</h1>
        <p>Quản lý hồ sơ nhân viên: xem, thêm, tìm kiếm, cập nhật và xóa.</p>
      </div>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Tìm theo mã nhân viên hoặc họ tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setModal({ mode: 'add', employee: null })}>
          + Thêm nhân viên
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="state">Đang tải dữ liệu...</div>
        ) : loadError ? (
          <div className="state error">
            <p>{loadError}</p>
            <button className="btn btn-secondary" onClick={() => loadEmployees(search.trim())}>
              Thử lại
            </button>
          </div>
        ) : employees.length === 0 ? (
          <div className="state">
            {search ? 'Không tìm thấy nhân viên phù hợp.' : 'Chưa có nhân viên nào.'}
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ và tên</th>
                  <th>Phòng ban</th>
                  <th>Chức vụ</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.fullName}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>
                      <span className={statusClass(emp.status)}>{emp.status}</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setModal({ mode: 'view', employee: emp })}
                        >
                          Xem
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setModal({ mode: 'edit', employee: emp })}
                        >
                          Sửa
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setToDelete(emp)}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && !loadError && <p className="count">Tổng số: {employees.length} nhân viên</p>}

      {modal && (
        <EmployeeModal
          key={`${modal.mode}-${modal.employee ? modal.employee._id : 'new'}`}
          mode={modal.mode}
          employee={modal.employee}
          busy={busy}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onEdit={() => setModal({ mode: 'edit', employee: modal.employee })}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          message={`Bạn có chắc chắn muốn xóa nhân viên "${toDelete.fullName}" (${toDelete.employeeId})? Thao tác này không thể hoàn tác.`}
          busy={busy}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}
