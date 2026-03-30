// ── Dashboard Page ───────────────────────────────────────
import { invoiceService } from '../services/invoiceService.js';
import { profileService } from '../services/profileService.js';
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { formatAmount, formatDate, statusBadge } from '../utils/formatters.js';
import { Chart } from 'chart.js/auto';

const app = document.getElementById('app');

export function renderDashboard() {
  const profile = profileService.get();
  const stats = invoiceService.getStats();
  const invoices = invoiceService.getAll();
  const recent = invoices.slice(0, 6);
  const monthly = invoiceService.getRecentMonthlyRevenue();
  const currency = profile.defaultCurrency || 'USD';

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar('/dashboard')}
      <div class="page-content">
        ${renderNavbar({ title: 'Dashboard', breadcrumb: [{ label: 'Dashboard', path: '/dashboard' }] })}
        <div class="content-area page-transition">

          <!-- Welcome banner -->
          <div style="
            background:linear-gradient(135deg, var(--primary-alpha), rgba(167,139,250,0.1));
            border:1px solid rgba(99,102,241,0.2);
            border-radius:var(--radius-xl); padding:28px 32px;
            margin-bottom:28px; position:relative; overflow:hidden;
            display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
          ">
            <div style="position:absolute; top:-30px; right:10%; width:200px; height:200px; background:var(--primary); opacity:0.06; border-radius:50%; filter:blur(40px);"></div>
            <div>
              <h1 style="font-family:var(--font-display); font-size:1.5rem; font-weight:800; color:#fff; margin-bottom:4px;">
                Good ${getGreeting()}, ${profile.businessName}! 👋
              </h1>
              <p style="color:var(--text-secondary); font-size:0.9rem;">Here's your business overview for today.</p>
            </div>
            <a href="#/invoices/create" class="btn btn-primary" id="dashboard-create-btn">
              + Create Invoice
            </a>
          </div>

          <!-- Stats Grid -->
          <div class="grid-4 stagger-children" style="margin-bottom:28px;">
            <div class="stat-card" style="--stat-color:var(--primary); --stat-bg:var(--primary-alpha);">
              <div class="stat-icon">📄</div>
              <div class="stat-body">
                <div class="stat-label">Total Invoices</div>
                <div class="stat-value">${stats.total}</div>
                <div class="stat-change">${stats.draft} draft${stats.draft !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div class="stat-card" style="--stat-color:var(--success); --stat-bg:var(--success-alpha);">
              <div class="stat-icon">💰</div>
              <div class="stat-body">
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">${formatAmount(stats.revenue, currency)}</div>
                <div class="stat-change positive">${stats.paid} paid invoice${stats.paid !== 1 ? 's' : ''}</div>
              </div>
            </div>
            <div class="stat-card" style="--stat-color:var(--warning); --stat-bg:var(--warning-alpha);">
              <div class="stat-icon">⏳</div>
              <div class="stat-body">
                <div class="stat-label">Unpaid Total</div>
                <div class="stat-value">${formatAmount(stats.unpaidTotal, currency)}</div>
                <div class="stat-change">${stats.unpaid} sent, ${stats.overdue} overdue</div>
              </div>
            </div>
            <div class="stat-card" style="--stat-color:var(--danger); --stat-bg:var(--danger-alpha);">
              <div class="stat-icon">🚨</div>
              <div class="stat-body">
                <div class="stat-label">Overdue</div>
                <div class="stat-value">${stats.overdue}</div>
                <div class="stat-change negative">${stats.overdue > 0 ? 'Needs attention' : 'All clear!'}</div>
              </div>
            </div>
          </div>

          <!-- Charts + Recent Invoices -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:28px;">
            <!-- Revenue Chart -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">📈 Monthly Revenue</span>
                <span style="font-size:0.78rem; color:var(--text-muted);">Last 6 months</span>
              </div>
              <canvas id="revenue-chart" height="200"></canvas>
            </div>
            <!-- Status Breakdown -->
            <div class="card">
              <div class="card-header">
                <span class="card-title">🥧 Invoice Status</span>
              </div>
              <div style="display:flex; align-items:center; gap:24px;">
                <canvas id="status-chart" width="160" height="160" style="flex-shrink:0;"></canvas>
                <div style="display:flex; flex-direction:column; gap:10px; flex:1;">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:10px; height:10px; border-radius:50%; background:#6366f1;"></div><span style="font-size:0.82rem; color:var(--text-secondary);">Draft</span></div>
                    <span style="font-size:0.82rem; font-weight:600;">${stats.draft}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:10px; height:10px; border-radius:50%; background:#3b82f6;"></div><span style="font-size:0.82rem; color:var(--text-secondary);">Sent</span></div>
                    <span style="font-size:0.82rem; font-weight:600;">${stats.unpaid}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:10px; height:10px; border-radius:50%; background:#10b981;"></div><span style="font-size:0.82rem; color:var(--text-secondary);">Paid</span></div>
                    <span style="font-size:0.82rem; font-weight:600;">${stats.paid}</span>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:10px; height:10px; border-radius:50%; background:#ef4444;"></div><span style="font-size:0.82rem; color:var(--text-secondary);">Overdue</span></div>
                    <span style="font-size:0.82rem; font-weight:600;">${stats.overdue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Invoices -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">🗂️ Recent Invoices</span>
              <a href="#/invoices" class="btn btn-ghost btn-sm">View All →</a>
            </div>
            ${recent.length === 0 ? `
              <div class="empty-state" style="padding:40px;">
                <div class="empty-icon">📄</div>
                <div class="empty-title">No invoices yet</div>
                <div class="empty-desc">Create your first invoice to get started</div>
                <a href="#/invoices/create" class="btn btn-primary mt-4" id="dashboard-first-invoice">+ Create Invoice</a>
              </div>
            ` : `
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recent.map(inv => `
                      <tr>
                        <td><span style="font-family:monospace; font-size:0.82rem; color:var(--primary);">${inv.number}</span></td>
                        <td><span style="font-weight:500;">${inv.clientName || '—'}</span></td>
                        <td style="color:var(--text-muted);">${formatDate(inv.invoiceDate)}</td>
                        <td><strong>${formatAmount(inv.grandTotal || 0, inv.currency || currency)}</strong></td>
                        <td>${statusBadge(inv.status)}</td>
                        <td>
                          <a href="#/invoices/${inv.id}" class="btn btn-ghost btn-sm">View</a>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>

        </div>
      </div>
    </div>
  `;

  initSidebar();
  initCharts(monthly, stats);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function initCharts(monthly, stats) {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  // Revenue bar chart
  const revCtx = document.getElementById('revenue-chart');
  if (revCtx) {
    new Chart(revCtx, {
      type: 'bar',
      data: {
        labels: monthly.map(m => m.label),
        datasets: [{
          data: monthly.map(m => m.revenue),
          backgroundColor: 'rgba(99,102,241,0.7)',
          borderColor: 'rgba(99,102,241,1)',
          borderWidth: 2,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(99,102,241,0.9)',
        }]
      },
      options: {
        ...baseOptions,
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 11 } }, beginAtZero: true }
        }
      }
    });
  }

  // Status doughnut chart
  const statusCtx = document.getElementById('status-chart');
  if (statusCtx) {
    const total = stats.total || 1;
    new Chart(statusCtx, {
      type: 'doughnut',
      data: {
        labels: ['Draft', 'Sent', 'Paid', 'Overdue'],
        datasets: [{
          data: [stats.draft, stats.unpaid, stats.paid, stats.overdue],
          backgroundColor: ['#6366f1', '#3b82f6', '#10b981', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4,
        }]
      },
      options: {
        ...baseOptions,
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }
}
