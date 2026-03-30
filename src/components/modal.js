// ── Modal ────────────────────────────────────────────────
let activeModal = null;

export function openModal({ title = '', content = '', size = '', onClose } = {}) {
  const container = document.getElementById('modal-container');
  container.classList.add('active');

  const sizeClass = size ? `modal-${size}` : '';
  container.innerHTML = `
    <div class="modal-backdrop" id="modal-backdrop"></div>
    <div class="modal ${sizeClass} animate-scale-in" id="modal-inner">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" id="modal-close-btn" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">${content}</div>
    </div>
  `;

  activeModal = { onClose };

  const close = () => closeModal();
  document.getElementById('modal-close-btn').addEventListener('click', close);
  document.getElementById('modal-backdrop').addEventListener('click', close);

  const handleKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', handleKey);
  activeModal.removeKey = () => document.removeEventListener('keydown', handleKey);

  return container;
}

export function closeModal() {
  const container = document.getElementById('modal-container');
  const inner = document.getElementById('modal-inner');
  if (!inner) return;
  inner.style.animation = 'scaleIn 0.2s cubic-bezier(0.4,0,0.2,1) reverse';
  setTimeout(() => {
    container.classList.remove('active');
    container.innerHTML = '';
    if (activeModal?.onClose) activeModal.onClose();
    if (activeModal?.removeKey) activeModal.removeKey();
    activeModal = null;
  }, 180);
}

export function confirmModal({ title = 'Confirm', message = '', confirmText = 'Confirm', cancelText = 'Cancel', dangerous = false }) {
  return new Promise((resolve) => {
    openModal({
      title,
      content: `
        <p style="color: var(--text-secondary); margin-bottom: 24px; line-height: 1.7;">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-secondary" id="modal-cancel">${cancelText}</button>
          <button class="btn ${dangerous ? 'btn-danger' : 'btn-primary'}" id="modal-confirm">${confirmText}</button>
        </div>
      `,
      onClose: () => resolve(false)
    });
    document.getElementById('modal-confirm').addEventListener('click', () => { closeModal(); resolve(true); });
    document.getElementById('modal-cancel').addEventListener('click', () => { closeModal(); resolve(false); });
  });
}
