// Popup de saída
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = 'Tem certeza que deseja sair?';
});

// Acordeões
document.querySelectorAll('.neon-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('active');
    });
});

fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/Teoria_musical')
  .then(response => response.json())
  .then(data => {
      document.getElementById('wikipedia-content').innerHTML = data.extract;
  });