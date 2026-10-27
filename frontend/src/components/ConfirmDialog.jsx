export default function ConfirmDialog({ message, busy, onConfirm, onCancel }) {
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}>
      <div className="modal confirm">
        <div className="modal-header">
          <h2>Xác nhận xóa</h2>
        </div>
        <p>{message}</p>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel} disabled={busy}>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Đang xóa...' : 'Xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
