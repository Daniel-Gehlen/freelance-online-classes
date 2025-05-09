// popups/popup-hotmart/popup-module.js
class HotmartPopupLoader {
  constructor() {
    if (!window.hotmartPopupLoaded) {
      window.hotmartPopupLoaded = true;
      this.basePath = this.detectBasePath();
      this.loadResources();
    }
  }

  detectBasePath() {
    // Enhanced path detection for GitHub Pages
    const scriptElements = document.getElementsByTagName('script');
    let scriptPath = '';

    // Find the current script path
    for (let i = 0; i < scriptElements.length; i++) {
      const src = scriptElements[i].src;
      if (src && src.includes('popup-module.js')) {
        scriptPath = src;
        break;
      }
    }

    // Extract base path from script path
    if (scriptPath) {
      const urlObj = new URL(scriptPath);
      const pathParts = urlObj.pathname.split('/');
      // Remove 'popups/popup-hotmart/popup-module.js' from the path
      const baseParts = pathParts.slice(0, pathParts.length - 3);
      return `${urlObj.origin}${baseParts.join('/')}/`;
    }

    // Fallback detection
    const path = window.location.pathname;
    const repoName = this.getRepositoryName();

    // Check if we're on GitHub Pages
    if (window.location.hostname.includes('github.io')) {
      // For GitHub Pages with custom domain or username.github.io/repo format
      if (repoName) {
        return `/${repoName}/`; // e.g., /your-repo/
      }
      return '/'; // For username.github.io (root level)
    }

    // Local development path detection
    if (path.includes('/pages/')) {
      return '../../'; // For pages in /pages/ directory
    }
    return '/'; // For pages at root
  }

  getRepositoryName() {
    // Extract repository name from GitHub Pages URL
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname.endsWith('github.io')) {
      // Get the first directory in the path (repo name)
      const parts = pathname.split('/').filter(p => p);
      if (parts.length > 0) {
        return parts[0];
      }
    }
    return '';
  }

  async loadResources() {
    try {
      console.log("Loading Hotmart popup with base path:", this.basePath);

      // Carrega CSS com caminho corrigido
      await this.loadCSS(`${this.basePath}popups/popup-hotmart/popup-hotmart.css`);
      await this.loadCSS('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css');

      // Obtém HTML e corrige caminhos das imagens
      let popupHTML = this.getPopupHTML();

      // Fix image paths with absolute URLs when applicable
      popupHTML = popupHTML.replace(/src="assets\//g, `src="${this.basePath}assets/`);
      popupHTML = popupHTML.replace(/src="popups\//g, `src="${this.basePath}popups/`);

      const container = document.createElement('div');
      container.innerHTML = popupHTML;
      document.body.appendChild(container);

      // Carrega scripts externos
      await this.loadScriptAsync('https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js');
      await this.loadScriptAsync('https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js');

      // Injeta o JavaScript do popup
      const popupScript = document.createElement('script');
      popupScript.textContent = this.getPopupJS();
      document.body.appendChild(popupScript);

      console.log("Popup Hotmart carregado com sucesso!");
    } catch (error) {
      console.error('Erro ao carregar componentes do popup:', error);
    }
  }

  loadCSS(href) {
    return new Promise((resolve) => {
      const existingLink = document.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => {
        console.log(`CSS loaded successfully: ${href}`);
        resolve();
      };
      link.onerror = () => {
        console.warn(`Falha ao carregar CSS: ${href}`);
        resolve(); // Resolve anyway to continue loading
      };
      document.head.appendChild(link);
    });
  }

  loadScriptAsync(src) {
    return new Promise((resolve) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`Script loaded successfully: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.warn(`Falha ao carregar script: ${src}`);
        resolve(); // Resolve anyway to continue loading
      };
      document.body.appendChild(script);
    });
  }

  getPopupHTML() {
    return `
    <div id="hotmart-popup-container">
      <div class="popup-inner-container">
        <div class="popup-content">
          <div class="popup-card">
            <div class="popup-card-body">
              <img src="assets/eu-hotmart.jpeg" alt="HotMart Preview" class="popup-image">
              <h5 class="popup-title">Compre por aqui</h5>
              <p class="popup-subtitle">ou Acesse o material completo na HotMart.</p>

              <button id="mostrarConteudosPopup" class="popup-btn btn-primary">
                Mostrar Conteúdos
              </button>

              <div id="listaConteudosPopup" class="popup-content-list" style="display: none;">
                <ul>
                  <li><strong>01</strong> - 1º Módulo - iniciação prática musical</li>
                  <li><strong>02</strong> - 2º Módulo - divisão rítmica</li>
                  <li><strong>03</strong> - 3º Módulo - i, m, a, nas três cordas abaixo</li>
                  <li><strong>04</strong> - 4º Módulo - polegar nas três cordas acima</li>
                  <li><strong>05</strong> - 5º Módulo - Início: Notas presas na 6ª, na 5ª e na 4ª corda</li>
                  <li><strong>06</strong> - 6ª Corda</li>
                  <li><strong>07</strong> - 5ª corda</li>
                  <li><strong>08</strong> - 4ª Corda</li>
                  <li><strong>09</strong> - Módulo 5 - Final</li>
                  <li><strong>10</strong> - 6º Módulo - Início: Notas presas na 3ª, na 2ª e na 1ª corda</li>
                  <li><strong>11</strong> - 3ª Corda</li>
                  <li><strong>12</strong> - 2ª Corda</li>
                  <li><strong>13</strong> - 1ª Corda</li>
                  <li><strong>14</strong> - Final do Módulo 6</li>
                  <li><strong>15</strong> - 7º Módulo - Sustenido e bemol: notas alteradas</li>
                  <li><strong>16</strong> - 8º Módulo - Partitura a duas vozes</li>
                  <li><strong>17</strong> - 9º Módulo - Acompanhamentos rítmicos</li>
                  <li><strong>18</strong> - 10º Módulo - Oitavas</li>
                  <li><strong>19</strong> - 11º Módulo - Colcheias</li>
                  <li><strong>20</strong> - Solfejando</li>
                  <li><strong>21</strong> - Tocando</li>
                  <li><strong>22</strong> - 12º Módulo - Músicas Instrumentais</li>
                  <li><strong>23</strong> - Bônus - Doze Dicas Pontuais de Estudos</li>
                </ul>
              </div>

              <div class="popup-highlight">
                <div class="highlight-glow-effect"></div>

                <div class="highlight-header">
                  <h2 class="highlight-title">DESENVOLVA HABILIDADES NO VIOLÃO</h2>
                  <p class="highlight-subtitle">Com <strong>Daniel Gehlen</strong> - 25+ anos transformando iniciantes em músicos</p>
                </div>

                <div class="highlight-features">
                  <div class="feature-card">
                    <h3>🎸 12 Módulos Completos</h3>
                    <p>Do absoluto zero até técnicas intermediárias em um caminho progressivo</p>
                  </div>
                  <div class="feature-card">
                    <h3>🎥 Vídeoaulas Práticas</h3>
                    <p>Instruções claras + dicas exclusivas que aceleram seu aprendizado</p>
                  </div>
                  <div class="feature-card">
                    <h3>⏱️ Seu Ritmo</h3>
                    <p>Sem pressão - estude quando e onde quiser, no seu tempo</p>
                  </div>
                  <div class="feature-card">
                    <h3>🔑 Conhecimento Exclusivo</h3>
                    <p>Atalhos que normalmente levariam anos para descobrir</p>
                  </div>
                </div>

                <div class="highlight-main">
                  <p><strong>Não é um curso profissionalizante</strong>, mas <span class="highlight-text">a base perfeita</span> para iniciantes e entusiastas que desejam uma fundação sólida no violão!</p>
                </div>

                <div class="highlight-cta">
                  <p>Transforme seu desejo de tocar violão em realidade!</p>
                  <button id="jornada-musical-btn">INICIE SUA JORNADA MUSICAL AGORA</button>
                </div>

                <div class="highlight-footer">
                  <p>Obrigado por ler até aqui! Estou genuinamente animado para guiá-lo nessa jornada musical.</p>
                  <p class="highlight-quote">"Um violão, um sonho e a orientação certa - essa é a fórmula para começar."</p>
                </div>
              </div>
            </div>

            <button id="hotmart-button-popup" class="popup-img-btn">
              <img src="https://static.hotmart.com/img/btn-buy-green.png" alt="Comprar no HotMart">
            </button>

            <a href="https://hotmart.com/pt-br/marketplace/produtos/o-caminho-para-tocar-violao/T41807997K"
              target="_blank" class="popup-btn btn-primary">
              Acessar na Hotmart
            </a>

            <button id="udemyButtonPopup" class="popup-btn btn-udemy">
              Acessar Udemy
            </button>
            
            <button id="jornada-musical-btn" class="popup-btn btn-primary">
              Iniciar Jornada Musical
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="hotmartModal" class="modal fade" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body p-0">
            <iframe id="hotmartIframe" src=""></iframe>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  getPopupJS() {
    return `
    document.addEventListener('DOMContentLoaded', function () {
      const popupContainer = document.getElementById('hotmart-popup-container');
      if (!popupContainer) {
        console.error('Popup container não encontrado');
        return;
      }

      let popupShown = false;
      let mouseLeaveEnabled = true;

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

      const showPopup = () => {
        if (!popupShown) {
          popupContainer.style.display = 'block';
          document.body.style.overflow = 'hidden';
          popupShown = true;
        }
      };

      const hidePopup = () => {
        popupContainer.style.display = 'none';
        document.body.style.overflow = 'auto';
        popupShown = false;
        mouseLeaveEnabled = false;
        setTimeout(() => { mouseLeaveEnabled = true; }, 1000);
      };

      document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && mouseLeaveEnabled) {
          showPopup();
        }
      });

      document.addEventListener('click', (e) => {
        if (popupShown) {
          const popupContent = document.querySelector('.popup-content');
          if (popupContent && !popupContent.contains(e.target)) {
            hidePopup();
          }
        }
      });

      const initButton = (selector, callback) => {
        const btn = document.querySelector(selector);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            callback(e);
          });
        } else {
          console.warn(\`Botão \${selector} não encontrado\`);
        }
      };

      initButton('#mostrarConteudosPopup', function (e) {
        e.stopPropagation();
        const conteudos = document.getElementById('listaConteudosPopup');
        if (conteudos) {
          const isHidden = conteudos.style.display === 'none' || !conteudos.style.display;
          conteudos.style.display = isHidden ? 'block' : 'none';
          this.textContent = isHidden ? 'Ocultar Conteúdos' : 'Mostrar Conteúdos';
        }
      });

      const conteudosList = document.getElementById('listaConteudosPopup');
      if (conteudosList) {
        conteudosList.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      initButton('#hotmart-button-popup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerConfetti();
        setTimeout(() => {
          hidePopup();
          const iframe = document.getElementById('hotmartIframe');
          if (iframe) {
            iframe.src = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
            const modal = document.getElementById('hotmartModal');
            if (modal && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
              new bootstrap.Modal(modal).show();
            } else {
              window.open("https://pay.hotmart.com/T41807997K?checkoutMode=2", "_blank");
            }
          }
        }, 800);
      });

      initButton('#udemyButtonPopup', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerConfetti();
        setTimeout(() => {
          window.open('https://www.udemy.com/course/violao-pratico-aprenda-principais-acordes-e-ritmos-basicos/?couponCode=KEEPLEARNINGBR', '_blank');
          hidePopup();
        }, 1000);
      });

      initButton('#jornada-musical-btn', (e) => {
        e.preventDefault();
        e.stopPropagation();
        triggerConfetti();
        setTimeout(() => {
          hidePopup();
          if (window.matchMedia('(min-width: 768px)').matches) {
            const iframe = document.getElementById('hotmartIframe');
            if (iframe) {
              iframe.src = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
              const modal = document.getElementById('hotmartModal');
              if (modal && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                new bootstrap.Modal(modal).show();
              } else {
                window.location.href = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
              }
            }
          } else {
            window.location.href = "https://pay.hotmart.com/T41807997K?checkoutMode=2";
          }
        }, 800);
      });

      const popupContent = document.querySelector('.popup-content');
      if (popupContent) {
        popupContent.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    });

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
    }
    `;
  }
}

// Debug info for path detection
console.log("Loading popup module script...");
console.log("Current URL:", window.location.href);
console.log("Current Pathname:", window.location.pathname);
console.log("Current Hostname:", window.location.hostname);

// Initialize the popup loader
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HotmartPopupLoader());
} else {
  new HotmartPopupLoader();
}
