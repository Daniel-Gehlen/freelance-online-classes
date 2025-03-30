class ConsentManager {
  constructor() {
    this.consentCategories = {
      necessary: true, // Sempre ativo
      analytics: false,
      marketing: false
    };
    this.init();
  }

  init() {
    if (!this.getConsent()) this.showBanner();
  }

  showBanner() {
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.innerHTML = `
          <div class="consent-content">
              <p>Usamos cookies para:
                  <a href="/politica-privacidade.html" target="_blank">Detalhes</a>
              </p>
              <div class="toggle-group">
                  <label>
                      <input type="checkbox" id="consent-analytics" disabled checked>
                      Necessários (sempre ativos)
                  </label>
                  <label>
                      <input type="checkbox" id="consent-analytics">
                      Analytics
                  </label>
              </div>
              <button id="accept-all">Aceitar Tudo</button>
              <button id="save-settings">Salvar Preferências</button>
          </div>
      `;
    document.body.appendChild(banner);

    // Event Listeners
    document.getElementById('accept-all').addEventListener('click', () => {
      this.setConsent({ analytics: true, marketing: true });
      this.loadServices();
    });

    document.getElementById('save-settings').addEventListener('click', () => {
      this.setConsent({
        analytics: document.getElementById('consent-analytics').checked
      });
      this.loadServices();
    });
  }

  setConsent(consent) {
    const finalConsent = { ...this.consentCategories, ...consent };
    localStorage.setItem('consentData', JSON.stringify(finalConsent));
    document.getElementById('consent-banner').remove();
  }

  getConsent() {
    return JSON.parse(localStorage.getItem('consentData')) || false;
  }

  loadServices() {
    const consent = this.getConsent();
    if (consent.analytics) this.loadGoogleAnalytics();
  }

  loadGoogleAnalytics() {
    // Implementação GA4 com anonymizeIp
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXX', {
      'anonymize_ip': true,
      'allow_ad_personalization_signals': false
    });
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => new ConsentManager());
