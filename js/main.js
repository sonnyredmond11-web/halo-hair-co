/* ── CART STATE ── */
const cart = [];

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  document.getElementById('cartToggle').textContent = `Bag (${count})`;
  document.getElementById('cartTotal') && (document.getElementById('cartTotal').textContent = `£${total.toFixed(2)}`);

  const cartEmpty   = document.getElementById('cartEmpty');
  const cartItems   = document.getElementById('cartItems');
  const cartFooter  = document.getElementById('cartFooter');

  if (!cartEmpty) return;

  if (cart.length === 0) {
    cartEmpty.style.display  = 'flex';
    cartItems.style.display  = 'none';
    cartFooter.style.display = 'none';
  } else {
    cartEmpty.style.display  = 'none';
    cartItems.style.display  = 'block';
    cartFooter.style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--border);">
        <div>
          <p style="font-family:'Cormorant Garant',serif;font-size:18px;">${item.name}</p>
          <p style="font-size:12px;color:var(--text-light);margin-top:4px;">Qty: ${item.qty}</p>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <span style="font-family:'Jost',sans-serif;font-size:14px;">£${(item.price * item.qty).toFixed(2)}</span>
          <button onclick="removeFromCart(${item.id})" style="background:none;border:none;cursor:pointer;color:var(--text-light);font-size:16px;">✕</button>
        </div>
      </div>
    `).join('');
  }
}

function addToCart(id, name, price) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCartUI();
  openCart();
}

function removeFromCart(id) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) cart.splice(idx, 1);
  updateCartUI();
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── NEWSLETTER ── */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  const btn   = e.target.querySelector('button');
  btn.textContent = '✓ Subscribed';
  btn.style.background = '#6a9';
  input.value = '';
  setTimeout(() => {
    btn.textContent = 'Join';
    btn.style.background = '';
  }, 3000);
}

/* ── SCROLL HEADER ── */
function handleScroll() {
  const header = document.getElementById('siteHeader');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
}

/* ── FILTER TABS (shop page) ── */
function applyFilter(type) {
  const cards = document.querySelectorAll('.product-card[data-type]');
  cards.forEach(card => {
    card.style.display = (!type || card.dataset.type === type) ? '' : 'none';
  });
}

function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;

  const tabTypeMap = { 'All': '', 'Clip-In': 'clip-in', 'Tape-In': 'tape-in', 'Weft': 'weft', 'Micro-Ring': 'micro-ring' };

  function activateTab(tab) {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    applyFilter(tabTypeMap[tab.textContent.trim()] ?? '');
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));

  /* Apply filter from URL param e.g. ?type=clip-in */
  const urlType = new URLSearchParams(window.location.search).get('type');
  if (urlType) {
    const match = [...tabs].find(t => (tabTypeMap[t.textContent.trim()] ?? '') === urlType);
    if (match) activateTab(match);
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  /* Cart controls */
  const cartToggle  = document.getElementById('cartToggle');
  const cartClose   = document.getElementById('cartClose');
  const cartOverlay = document.getElementById('cartOverlay');

  cartToggle  && cartToggle.addEventListener('click', openCart);
  cartClose   && cartClose.addEventListener('click', closeCart);
  cartOverlay && cartOverlay.addEventListener('click', closeCart);

  /* Scroll */
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* Filter tabs */
  initFilterTabs();
});
