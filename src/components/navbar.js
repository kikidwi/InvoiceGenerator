export function renderNavbar({ title = '', breadcrumb = [], noSidebar = false } = {}) {
  const crumbs = breadcrumb.map((b, i) =>
    i < breadcrumb.length - 1
      ? `<a href="#${b.path}" style="color: var(--text-muted); transition: color 0.15s;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">${b.label}</a><span style="mx:6px">/</span>`
      : `<span>${b.label}</span>`
  ).join('');

  return `
    <header class="navbar${noSidebar ? ' no-sidebar' : ''}" id="app-navbar">
      <div class="navbar-left">
        <button class="hamburger-btn" id="hamburger-btn" aria-label="Toggle sidebar">☰</button>
        <div>
          ${breadcrumb.length > 0 ? `<div class="breadcrumb">${crumbs}</div>` : ''}
          <div class="page-title">${title}</div>
        </div>
      </div>
      <div class="navbar-right">
        <a href="#/invoices/create" class="btn btn-primary btn-sm" id="navbar-create-btn">
          <span>+</span> New Invoice
        </a>
      </div>
    </header>
  `;
}
