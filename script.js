// ========================================
// CARTÃO DE VISITA DIGITAL — INTERATIVIDADE
// Luís Henrique Saraiva
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  bindActions();
});

// ---------------------------------------------------------------------------
// Particles — floating dots in the background
// ---------------------------------------------------------------------------
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 35;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.setProperty('--duration', `${3 + Math.random() * 4}s`);
    p.style.setProperty('--delay', `${Math.random() * 5}s`);

    const size = 1 + Math.random() * 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    container.appendChild(p);
  }
}

// ---------------------------------------------------------------------------
// Button bindings
// ---------------------------------------------------------------------------
function bindActions() {
  const saveBtn = document.getElementById('btn-save-contact');
  const shareBtn = document.getElementById('btn-share');

  if (saveBtn) saveBtn.addEventListener('click', downloadVCard);
  if (shareBtn) shareBtn.addEventListener('click', shareCard);

  // Ripple effect on every interactive button
  document.querySelectorAll('.contact-btn, .btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
}

// ---------------------------------------------------------------------------
// vCard download
// ---------------------------------------------------------------------------
function downloadVCard() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Saraiva;Luís Henrique;;;',
    'FN:Luís Henrique Saraiva',
    'TITLE:Médico Veterinário',
    'ORG:CRMV-MG 17.194',
    'TEL;TYPE=CELL:+55 31 8229-8906',
    'EMAIL:luishenriquesaraiva@gmail.com',
    'URL:https://www.linkedin.com/in/luis-henrique-saraiva',
    'X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/luis-henrique-saraiva',
    'X-SOCIALPROFILE;TYPE=instagram:https://www.instagram.com/luishenriquesaraiva.vet/',
    'ADR;TYPE=HOME:;;;;;;Minas Gerais;Brasil',
    'NOTE:Médico Veterinário especialista em sanidade animal\\, patologia\\, biossegurança\\, docência e gestão de projetos.',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'Luis_Henrique_Saraiva.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('✅ Contato salvo com sucesso!');
}

// ---------------------------------------------------------------------------
// Share (Web Share API → clipboard fallback)
// ---------------------------------------------------------------------------
async function shareCard() {
  const data = {
    title: 'Luís Henrique Saraiva | Médico Veterinário',
    text: 'Conheça o cartão de visita digital de Luís Henrique Saraiva — Médico Veterinário (CRMV-MG 17.194)',
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  // Fallback: copy URL
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copiado para a área de transferência!');
  } catch {
    showToast('⚠️ Não foi possível copiar o link.');
  }
}

// ---------------------------------------------------------------------------
// Toast notification
// ---------------------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---------------------------------------------------------------------------
// Ripple effect on click
// ---------------------------------------------------------------------------
function createRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top: ${e.clientY - rect.top - size / 2}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0);
    animation: rippleAnim 0.6s ease-out;
    pointer-events: none;
    z-index: 0;
  `;

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
