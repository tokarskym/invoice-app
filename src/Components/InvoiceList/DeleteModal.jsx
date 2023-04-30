export default function DeleteModal({ onCancel, onDelete, id }) {
  return (
    <div className="delete-modal">
      <div className="delete-modal__content">
        <div className="modal-content">
          <h2>Confirm deletion</h2>
          <p>Are you sure you wanna delete invoice #{id}? This action cannot be undone.</p>
        </div>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="delete-button" onClick={() => onDelete(id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
