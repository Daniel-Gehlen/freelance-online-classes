document.addEventListener('DOMContentLoaded', function () {
  // Elementos do DOM
  const popup = document.getElementById('hotmart-popup');
  const closeBtn = document.getElementById('close-hotmart-popup');
  const mostrarBtn = document.getElementById('mostrarConteudosPopup');
  const conteudos = document.getElementById('listaConteudosPopup');

  // Verificação de elementos
  if (!popup || !closeBtn || !mostrarBtn || !conteudos) {
    console.error('Elementos do popup não encontrados!');
    return;
  }

  // Mostrar popup quando mouse sai da janela
  document.addEventListener('mouseout', function (e) {
    // Verifica se o mouse saiu pela parte superior da janela
    if (e.clientY < 50) {
      popup.style.display = 'flex';
    }
  });

  // Fechar popup temporariamente
  closeBtn.addEventListener('click', function () {
    popup.style.display = 'none'; // Esconde o popup ao clicar no botão de fechar
  });

  // Mostrar/ocultar conteúdos
  mostrarBtn.addEventListener('click', function () {
    if (conteudos.style.display === 'none' || !conteudos.style.display) {
      conteudos.style.display = 'block';
      mostrarBtn.textContent = 'Ocultar Conteúdos';

      // Rolagem suave para os conteúdos
      setTimeout(() => {
        conteudos.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } else {
      conteudos.style.display = 'none';
      mostrarBtn.textContent = 'Mostrar Conteúdos';
    }
  });

  // Configuração do botão Hotmart
  const hotmartButton = document.getElementById('hotmart-button-popup');
  if (hotmartButton) {
    hotmartButton.addEventListener('click', function (e) {
      e.preventDefault();
      // Efeito confetti (se disponível)
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      // Redirecionamento
      window.open(this.href, '_blank');
    });
  }
});

// Configuração do Hotmart
function importHotmart() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://static.hotmart.com/checkout/widget.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://static.hotmart.com/css/hotmart-fb.min.css';
    document.head.appendChild(link);
  });
}

// Função de confetti
function triggerConfetti() {
  confetti({
    particleCount: 1300,
    spread: 180,
    origin: { y: 0.6 },
    gravity: 0.5,
    ticks: 200,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
  });

  const canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.style.position = 'fixed';
    canvas.style.zIndex = '2147483647';
    canvas.style.pointerEvents = 'none';
  }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
  // Carrega Hotmart
  importHotmart()
    .then(() => console.log('Hotmart carregado'))
    .catch(err => console.error('Erro Hotmart:', err));

  // Popup Hotmart
  const popup = document.getElementById('hotmart-popup');
  const closeBtn = document.getElementById('close-hotmart-popup');
  const mostrarBtn = document.getElementById('mostrarConteudosPopup');
  const conteudos = document.getElementById('listaConteudosPopup');

  // Mostrar/ocultar conteúdos
  if (mostrarBtn && conteudos) {
    mostrarBtn.addEventListener('click', function () {
      conteudos.style.display = conteudos.style.display === 'none' ? 'block' : 'none';
      this.textContent = conteudos.style.display === 'none' ? 'Mostrar Conteúdos' : 'Ocultar Conteúdos';
    });
  }

  // Botão Hotmart
  const hotmartButton = document.getElementById('hotmart-button');
  if (hotmartButton) {
    hotmartButton.addEventListener('click', function (e) {
      e.preventDefault();
      triggerConfetti();

      if (window.matchMedia('(min-width: 768px)').matches) {
        window.open(this.href, '_blank');
      } else {
        setTimeout(() => {
          window.location.href = this.href;
        }, 1500);
      }
    });
  }

  // Botão Udemy
  const udemyButton = document.getElementById('udemyButton');
  if (udemyButton) {
    udemyButton.addEventListener('click', function (e) {
      e.preventDefault();
      triggerConfetti();

      setTimeout(() => {
        window.location.href = this.href;
      }, 1000);
    });
  }

  // Fechar popup
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      popup.style.display = 'none';
    });
  }

  // Mostrar popup quando mouse sai
  document.addEventListener('mouseout', function (e) {
    if (e.clientY < 50) {
      popup.style.display = 'flex';
    }
  });
});
