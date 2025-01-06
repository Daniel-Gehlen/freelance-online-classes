document.getElementById('formContato').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    document.getElementById('formContato').reset();
});
