// HEADER
/* Auto-highlight menu & smooth-scroll */
document.addEventListener('DOMContentLoaded', () => {
  const sections  = document.querySelectorAll('section[id]'); // target tiap section
  const navLinks  = document.querySelectorAll('.nav-link');

  // Ganti status aktif
  const setActive = id => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href'); // #home, #about, ...
      link.classList.toggle('active', href === `#${id}`);
    });
  };

  // Observer: trigger ketika 50 % tinggi section terlihat
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    rootMargin: '0px 0px -50% 0px', // –50 % di bawah viewport
    threshold : 0
  });

  sections.forEach(sec => observer.observe(sec));

  // Smooth-scroll ketika klik
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href'))
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});

// MY Service Konfigurasi Bot Telegram
const TELEGRAM_BOT_TOKEN = '8041722156:AAGjJ0NyRI3ALokYKnb4l3B3iPid-k6FGhY';
const TELEGRAM_CHAT_ID = '7414025242';

// Buka/Tutup Modal
function toggleOrder(show, service = '') {
  const modal = document.getElementById('orderModal');
  modal.classList.toggle('opacity-0', !show);
  modal.classList.toggle('pointer-events-none', !show);
  
  if (show) {
    document.getElementById('serviceField').value = `${service} Development`;
  }
}

// Ganti tombol lama agar memicu modal
function contactService(serviceName) {
  toggleOrder(true, serviceName);
}

// Kirim ke Telegram
async function sendToTelegram(text) {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown'
    })
  });
  
  if (!res.ok) throw new Error(`Telegram error ${res.status}`);
  return res.json();
}

// Submit Form Langsung
document.getElementById('orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  
  const msg = [
  '📢 *Permintaan Layanan Baru*',
  `Layanan   : *${document.getElementById('serviceField').value}*`,
  `Nama      : ${document.getElementById('nameField').value}`,
  `Kontak    : ${document.getElementById('contactField').value}`,
  `Keterangan: ${document.getElementById('descField').value || '-'}`
].join('\n');
  
  try {
    await sendToTelegram(msg);
    alert('✅ Pesanan berhasil dikirim ke Telegram!');
    toggleOrder(false);
  } catch (err) {
    console.error(err);
    alert('❌ Gagal mengirim pesan. Coba lagi nanti.');
  }
});


/* PTOJECT SLIDER */
  class ProjectSlider {
    constructor() {
      this.currentSlide = 0;
      this.slidesWrapper = document.getElementById('slidesWrapper');
      this.slidesTrack = document.getElementById('slidesTrack');
      this.totalSlides = this.slidesTrack.children.length;
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');
      this.indicators = document.getElementById('indicators');
      this.slideCounter = document.getElementById('slideCounter');
      this.initIndicators();
      this.updateUI();
      this.attachEvents();
      window.addEventListener('resize', () => this.goToSlide(this.currentSlide));
    }
    
    attachEvents() {
      this.prevBtn.addEventListener('click', () => this.prev());
      this.nextBtn.addEventListener('click', () => this.next());
      this.indicators.querySelectorAll('button').forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          this.currentSlide = idx;
          this.updateUI();
        });
      });
    }
    
    prev() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
        this.updateUI();
      }
    }
    
    next() {
      if (this.currentSlide < this.totalSlides - 1) {
        this.currentSlide++;
        this.updateUI();
      }
    }
    
    initIndicators() {
      this.indicators.innerHTML = '';
      for (let i = 0; i < this.totalSlides; i++) {
        const dotBtn = document.createElement('button');
        dotBtn.className = 'h-2 w-2 rounded-full bg-gray-500 focus:outline-none';
        this.indicators.appendChild(dotBtn);
      }
      this.updateIndicators();
    }
    
    updateIndicators() {
      this.indicators.querySelectorAll('button').forEach((btn, idx) => {
        btn.classList.toggle('bg-red-600', idx === this.currentSlide);
        btn.classList.toggle('bg-gray-500', idx !== this.currentSlide);
      });
    }
    
    goToSlide(index) {
      const slideWidth = this.slidesWrapper.clientWidth;
      this.slidesTrack.style.transform = `translateX(-${index * slideWidth}px)`;
      this.slideCounter.textContent = `${index + 1}/${this.totalSlides}`;
      this.updateIndicators();
    }
    
    updateUI() {
      this.goToSlide(this.currentSlide);
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => new ProjectSlider());
  
  // MY CONTACTS
// Inject basic toast animation styles (once)
(function injectToastStyles() {
  if (document.getElementById('toast-styles')) return;
  const style = document.createElement('style');
  style.id = 'toast-styles';
  style.textContent = `
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #22c55e;
      color: #fff;
      padding: .75rem 1.25rem;
      border-radius: .5rem;
      font-weight: 600;
      opacity: 0;
      pointer-events: none;
      animation: fadeInOut 4s ease forwards;
      box-shadow: 0 5px 15px rgba(0,0,0,.1);
      z-index: 9999;
    }
    .toast.error {
      background: #ef4444;
    }
    @keyframes fadeInOut {
      0%   { opacity: 0; transform: translateY(20px); }
      10%,90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(20px); }
    }
  `;
  document.head.appendChild(style);
})();

// Fungsi untuk menampilkan notifikasi toast
function showToast(msg, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Script pengiriman data ke Telegram
document.addEventListener('DOMContentLoaded', () => {
  const TELEGRAM_BOT_TOKEN = '8041722156:AAGjJ0NyRI3ALokYKnb4l3B3iPid-k6FGhY'; // Ganti dengan milikmu
  const TELEGRAM_CHAT_ID = '7414025242'; // Ganti dengan milikmu
  const API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const form = document.forms['contact'];
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
    });
    
    const text = [
  '✅ *Form Pengiriman Telah Diterima*',
  '──────────────────────────────',
  `📅 *Tanggal & Waktu:* ${timestamp}`,
  '',
  `🙋‍♂️ *Nama Lengkap:* ${name.value.trim()}`,
  `📩 *Email:* ${email.value.trim()}`,
  '',
  `🖊️ *Isi Pesan:*`,
  `_${message.value.trim()}_`
].join('\n');
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      });
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      showToast('Pesan berhasil dikirim! Terima kasih 🙌');
      form.reset();
    } catch (err) {
      console.error('Telegram error:', err);
      showToast('Ups, gagal mengirim pesan. Coba lagi ya.', true);
    }
  });
});