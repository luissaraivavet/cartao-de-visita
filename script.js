// ========================================
// CARTÃO DE VISITA DIGITAL — INTERATIVIDADE
// Luís Henrique Saraiva — Veterinária & IA
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  bindActions();
  initParticles();
  initCardTilt();
});

// ---------------------------------------------------------------------------
// Bindings e Eventos
// ---------------------------------------------------------------------------
function bindActions() {
  const saveBtn = document.getElementById('btn-save-contact');
  const shareBtn = document.getElementById('btn-share');

  if (saveBtn) saveBtn.addEventListener('click', downloadVCard);
  if (shareBtn) shareBtn.addEventListener('click', shareCard);

  // Efeito Ripple em todos os botões interativos
  document.querySelectorAll('.contact-btn, .btn').forEach(btn => {
    btn.addEventListener('click', createRipple);
  });
}

// ---------------------------------------------------------------------------
// Download do vCard (.vcf)
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
    'NOTE:Médico Veterinário especialista em sanidade animal\\, patologia suína\\, biossegurança\\, Inteligência Artificial no Agronegócio.',
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
// Compartilhamento do Cartão (Web Share API com Fallback)
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

  // Fallback: Copiar URL
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copiado para a área de transferência!');
  } catch {
    showToast('⚠️ Não foi possível copiar o link.');
  }
}

// ---------------------------------------------------------------------------
// Toast Notification
// ---------------------------------------------------------------------------
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('toast--visible');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('toast--visible'), 3000);
}

// ---------------------------------------------------------------------------
// Partículas Dinâmicas no Background
// ---------------------------------------------------------------------------
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3.5 + 1.5; // 1.5px a 5px
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 15 + 12; // 12s a 27s
    const delay = Math.random() * -20; // Inicia imediatamente
    const opacity = Math.random() * 0.2 + 0.08;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posY}%;
      opacity: ${opacity};
      --dur: ${duration}s;
      --del: ${delay}s;
    `;
    container.appendChild(particle);
  }
}

// ---------------------------------------------------------------------------
// Efeito Tilt Parallax 3D no Card (Desktop Only)
// ---------------------------------------------------------------------------
function initCardTilt() {
  const card = document.getElementById('card');
  const wrapper = document.querySelector('.card-wrapper');
  if (!card || !wrapper) return;

  if (window.matchMedia('(hover: hover)').matches) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Inclinação suave de até 8 graus
      const rotateX = -(y - centerY) / (rect.height / 16);
      const rotateY = (x - centerX) / (rect.width / 16);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.005, 1.005, 1.005)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease-out';
    });

    wrapper.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  }
}

// ---------------------------------------------------------------------------
// Efeito Ripple no Clique dos Botões
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
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 0;
  `;

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}
