// ── Landing Page ─────────────────────────────────────────
const app = document.getElementById('app');

const FEATURES = [
  { icon: '⚡', title: 'Instant Invoices', desc: 'Create professional invoices in seconds. No account required — start immediately.' },
  { icon: '🎨', title: '5 Premium Templates', desc: 'Choose from Modern, Minimalist, Corporate, Dark, and Creative invoice layouts.' },
  { icon: '👁️', title: 'Live Preview', desc: 'Watch your invoice update in real-time as you fill in the form details.' },
  { icon: '📥', title: 'PDF Export', desc: 'Download print-ready PDF invoices with a single click.' },
  { icon: '💱', title: 'Multi-Currency', desc: 'Support for USD, EUR, IDR, GBP, JPY and 10+ other currencies.' },
  { icon: '📊', title: 'Dashboard & Analytics', desc: 'Track revenue, invoice status, and business performance at a glance.' },
  { icon: '🔗', title: 'Shareable Links', desc: 'Share invoices via a unique URL — no download required.' },
  { icon: '💾', title: 'Auto-Save Drafts', desc: 'Never lose your work. Drafts save automatically as you type.' },
];

export function renderLanding() {
  app.innerHTML = `
    <div class="gradient-bg" style="min-height:100vh;">
      <!-- Navbar -->
      <nav style="
        position:fixed; top:0; left:0; right:0; z-index:100;
        padding:16px 48px;
        display:flex; align-items:center; justify-content:space-between;
        background:rgba(15,15,26,0.8); backdrop-filter:blur(12px);
        border-bottom:1px solid var(--border);
      ">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:36px; height:36px; background:var(--primary); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; box-shadow:0 4px 12px rgba(99,102,241,0.4);">⚡</div>
          <span style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:#fff;">InvoiceFlow</span>
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <a href="#/dashboard" class="btn btn-ghost btn-sm">Dashboard</a>
          <a href="#/invoices/create" class="btn btn-primary btn-sm" id="landing-cta-nav">Create Invoice →</a>
        </div>
      </nav>

      <!-- Hero -->
      <section style="
        min-height:100vh; display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        padding:120px 48px 80px; text-align:center; position:relative; overflow:hidden;
      ">
        <!-- Floating orbs -->
        <div style="position:absolute; top:15%; left:8%; width:300px; height:300px; background:var(--primary); border-radius:50%; opacity:0.08; filter:blur(60px); animation:float 6s ease-in-out infinite;"></div>
        <div style="position:absolute; bottom:15%; right:8%; width:240px; height:240px; background:#a78bfa; border-radius:50%; opacity:0.07; filter:blur(50px); animation:float 8s ease-in-out infinite reverse;"></div>
        <div style="position:absolute; top:50%; left:50%; width:400px; height:400px; background:#3b82f6; border-radius:50%; opacity:0.04; filter:blur(80px); transform:translate(-50%,-50%);"></div>

        <div style="position:relative; z-index:1;">
          <div style="
            display:inline-flex; align-items:center; gap:8px;
            background:var(--primary-alpha); border:1px solid rgba(99,102,241,0.3);
            border-radius:var(--radius-full); padding:6px 16px; margin-bottom:28px;
            font-size:0.8rem; font-weight:600; color:var(--primary-light);
            animation: fadeInDown 0.6s ease forwards;
          ">
            ✨ No Login Required · Free Forever
          </div>

          <h1 style="
            font-family:var(--font-display);
            font-size:clamp(2.5rem, 6vw, 5rem);
            font-weight:900;
            line-height:1.08;
            color:#fff;
            margin-bottom:24px;
            animation: fadeInUp 0.6s 0.1s ease both;
          ">
            Create Stunning<br>
            <span class="gradient-text">Invoices in Minutes</span>
          </h1>

          <p style="
            font-size:clamp(1rem, 2vw, 1.25rem);
            color:var(--text-secondary);
            max-width:580px;
            margin:0 auto 48px;
            line-height:1.75;
            animation: fadeInUp 0.6s 0.2s ease both;
          ">
            Professional invoice generator with 5 premium templates, real-time preview, PDF export, and multi-currency support.
            <strong style="color:var(--text-primary);">No signup needed.</strong>
          </p>

          <div style="
            display:flex; gap:16px; justify-content:center; flex-wrap:wrap;
            animation: fadeInUp 0.6s 0.3s ease both;
          ">
            <a href="#/invoices/create" class="btn btn-primary btn-lg" id="landing-main-cta" style="font-size:1rem; padding:16px 36px; border-radius:14px; box-shadow:0 8px 32px rgba(99,102,241,0.4);">
              ⚡ Create Your First Invoice
            </a>
            <a href="#/dashboard" class="btn btn-secondary btn-lg" style="font-size:1rem; padding:16px 36px; border-radius:14px;">
              📊 View Dashboard
            </a>
          </div>

          <!-- Social proof -->
          <div style="
            margin-top:56px;
            display:flex; align-items:center; justify-content:center; gap:32px; flex-wrap:wrap;
            animation: fadeInUp 0.6s 0.4s ease both;
          ">
            ${[
              { num: '5', label: 'Invoice Templates' },
              { num: '10+', label: 'Currencies' },
              { num: '0', label: 'Account Needed' },
              { num: '100%', label: 'Free to Use' },
            ].map(s => `
              <div style="text-align:center;">
                <div style="font-family:var(--font-display); font-size:1.75rem; font-weight:900; color:#fff;">${s.num}</div>
                <div style="font-size:0.78rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">${s.label}</div>
              </div>
            `).join('<div style="width:1px; height:40px; background:var(--border);"></div>')}
          </div>
        </div>
      </section>

      <!-- Features -->
      <section style="padding:80px 48px; max-width:1100px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:56px;">
          <h2 style="font-family:var(--font-display); font-size:2.25rem; font-weight:800; color:#fff; margin-bottom:12px;">Everything You Need</h2>
          <p style="color:var(--text-secondary); font-size:1.05rem;">All the tools to manage your invoices like a pro — without the complexity.</p>
        </div>
        <div class="grid-4 stagger-children">
          ${FEATURES.map(f => `
            <div class="card" style="text-align:center; padding:28px 20px;">
              <div style="font-size:2.2rem; margin-bottom:12px;">${f.icon}</div>
              <h3 style="font-family:var(--font-display); font-size:1rem; font-weight:700; margin-bottom:8px;">${f.title}</h3>
              <p style="font-size:0.84rem; color:var(--text-secondary); line-height:1.65;">${f.desc}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Templates Preview -->
      <section style="padding:80px 48px; max-width:1100px; margin:0 auto;">
        <div style="text-align:center; margin-bottom:56px;">
          <h2 style="font-family:var(--font-display); font-size:2.25rem; font-weight:800; color:#fff; margin-bottom:12px;">5 Stunning Templates</h2>
          <p style="color:var(--text-secondary);">Choose the perfect look for your brand.</p>
        </div>
        <div style="display:flex; gap:16px; flex-wrap:wrap; justify-content:center;">
          ${[
            { name:'Modern', color:'#6366f1', icon:'🎨' },
            { name:'Minimalist', color:'#10b981', icon:'⬜' },
            { name:'Corporate', color:'#1e293b', icon:'🏢' },
            { name:'Dark', color:'#818cf8', icon:'🌑' },
            { name:'Creative', color:'#f59e0b', icon:'✨' },
          ].map(t => `
            <div style="
              background:var(--bg-card); border:1px solid var(--border); border-top:3px solid ${t.color};
              border-radius:var(--radius-lg); padding:20px 24px;
              display:flex; align-items:center; gap:12px; min-width:160px;
              cursor:pointer; transition:all 0.2s;
            " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 40px rgba(0,0,0,0.4)'" onmouseout="this.style.transform=''; this.style.boxShadow=''">
              <span style="font-size:1.5rem;">${t.icon}</span>
              <div>
                <div style="font-weight:700; font-size:0.9rem;">${t.name}</div>
                <div style="font-size:0.72rem; color:var(--text-muted);">Template</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="text-align:center; margin-top:32px;">
          <a href="#/templates" class="btn btn-outline">Browse All Templates →</a>
        </div>
      </section>

      <!-- CTA Banner -->
      <section style="padding:80px 48px; max-width:800px; margin:0 auto; text-align:center;">
        <div style="
          background:var(--primary-alpha); border:1px solid rgba(99,102,241,0.3);
          border-radius:var(--radius-xl); padding:56px 48px;
          position:relative; overflow:hidden;
        ">
          <div style="position:absolute; top:-40px; right:-40px; width:200px; height:200px; background:var(--primary); border-radius:50%; opacity:0.12; filter:blur(40px);"></div>
          <h2 style="font-family:var(--font-display); font-size:2rem; font-weight:900; color:#fff; margin-bottom:12px;">Ready to Get Started?</h2>
          <p style="color:var(--text-secondary); margin-bottom:32px; font-size:1.05rem;">Create your first invoice now. No sign-up, no credit card, no hassle.</p>
          <a href="#/invoices/create" class="btn btn-primary btn-lg" id="landing-bottom-cta" style="font-size:1rem; padding:16px 40px;">
            ⚡ Start Creating — It's Free
          </a>
        </div>
      </section>

      <!-- Footer -->
      <footer style="padding:32px 48px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:24px; height:24px; background:var(--primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">⚡</div>
          <span style="font-weight:700; color:var(--text-primary);">InvoiceFlow</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted);">© ${new Date().getFullYear()} InvoiceFlow. Built for freelancers & small businesses.</div>
        <div style="display:flex; gap:16px;">
          <a href="#/dashboard" style="font-size:0.8rem; color:var(--text-muted);">Dashboard</a>
          <a href="#/invoices/create" style="font-size:0.8rem; color:var(--text-muted);">Create Invoice</a>
          <a href="#/templates" style="font-size:0.8rem; color:var(--text-muted);">Templates</a>
        </div>
      </footer>
    </div>
  `;
}
