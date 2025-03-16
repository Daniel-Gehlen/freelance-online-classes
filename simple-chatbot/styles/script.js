const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

const responses = {
    '1': `Sobre o Funcionamento das Aulas:<br><br>
          - As aulas são individuais (1 hora por semana) ou em dupla (30min cada), com horários flexíveis.<br>
          - O curso é personalizado com as músicas que você quer aprender.<br>
          - Começamos com o básico e avançamos gradualmente.<br>
          - Trabalhamos a teoria e técnica das músicas.<br>
          - Temos material didático pago à parte (vídeos e partituras), se for iniciante.<br>
          - Convide amigos para aprenderem juntos! 😉<br>`,
    '2': 'Resposta para a opção 2.',
    '3': 'Resposta para a opção 3.',
    '4': 'Resposta para a opção 4.',
    '5': 'Resposta para a opção 5.',
    '6': 'Resposta para a opção 6.',
    '7': 'Resposta para a opção 7.',
    '8': 'Resposta para a opção 8.',
};

function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Exibe a mensagem do usuário
    chatBox.innerHTML += `<div class="user-message">Você: ${message}</div>`;

    // Processa a resposta
    if (responses[message]) {
        chatBox.innerHTML += `<div class="bot-message">Bot: ${responses[message]}</div>`;
    } else {
        chatBox.innerHTML += `<div class="bot-message">Bot: Opção inválida. Por favor, escolha uma opção válida.</div>`;
    }

    // Limpa o campo de entrada
    userInput.value = '';

    // Rola a conversa para a última mensagem
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Permite enviar mensagem ao pressionar Enter
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
