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