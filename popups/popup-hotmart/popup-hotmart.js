document.addEventListener('DOMContentLoaded', function () {
  // Verifica se o popup existe
  const popupContainer = document.getElementById('hotmart-popup-container');
  if (!popupContainer) {
    console.error('Popup container não encontrado');
    return;
  }

  // Função de confetti
  const triggerConfetti = () => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        gravity: 0.5,
        ticks: 200,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
    } else {
      console.warn('Confetti não está carregado');
    }
  };

  // Mostrar/ocultar popup
  const showPopup = () => {
    popupContainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  const hidePopup = () => {
    popupContainer.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // Evento quando mouse sai pelo topo
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY < 50) showPopup();
  });

  // Fechar ao clicar fora
  popupContainer.addEventListener('click', (e) => {
    if (e.target === popupContainer) hidePopup();
  });

  // Configuração dos botões
  const initButton = (selector, callback) => {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.addEventListener('click', callback);
    } else {
      console.warn(`Botão ${selector} não encontrado`);
    }
  };

  // Botão Mostrar Conteúdos
  initButton('#mostrarConteudosPopup', function () {
    const conteudos = document.getElementById('listaConteudosPopup');
    if (conteudos) {
      const isHidden = conteudos.style.display === 'none' || !conteudos.style.display;
      conteudos.style.display = isHidden ? 'block' : 'none';
      this.textContent = isHidden ? 'Ocultar Conteúdos' : 'Mostrar Conteúdos';

      if (isHidden) {
        setTimeout(() => conteudos.scrollIntoView({ behavior: 'smooth' }), 50);
      }
    }
  });

  // Botão Hotmart
  initButton('#hotmart-button-popup', (e) => {
    e.preventDefault();
    triggerConfetti();

    setTimeout(() => {
      hidePopup();
      const iframe = document.getElementById('hotmartIframe');
      if (iframe) {
        iframe.src = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
        const modal = document.getElementById('hotmartModal');
        if (modal && typeof bootstrap !== 'undefined') {
          new bootstrap.Modal(modal).show();
        } else {
          console.error('Bootstrap modal não inicializado');
          window.open("https://pay.hotmart.com/T41807997K?checkoutMode=2", "_blank");
        }
      }
    }, 800);
  });

  // Botão Udemy
  initButton('#udemyButtonPopup', (e) => {
    e.preventDefault();
    triggerConfetti();
    setTimeout(() => {
      window.open('https://www.udemy.com/course/violao-pratico-aprenda-principais-acordes-e-ritmos-basicos/?couponCode=KEEPLEARNINGBR', '_blank');
    }, 1000);
  });

  // Botão Jornada Musical
  initButton('#jornada-musical-btn', (e) => {
    e.preventDefault();
    triggerConfetti();

    setTimeout(() => {
      hidePopup();
      if (window.matchMedia('(min-width: 768px)').matches) {
        const iframe = document.getElementById('hotmartIframe');
        if (iframe) {
          iframe.src = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
          const modal = document.getElementById('hotmartModal');
          if (modal && typeof bootstrap !== 'undefined') {
            new bootstrap.Modal(modal).show();
          } else {
            console.error('Bootstrap modal não inicializado');
            window.location.href = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
          }
        }
      } else {
        window.location.href = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
      }
    }, 800);
  });

  // Mostra o popup depois de 5 segundos (opcional)
  // setTimeout(showPopup, 5000);
});
