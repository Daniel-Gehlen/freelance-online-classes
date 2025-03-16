// Elementos do DOM
const chatIcon = document.getElementById('chat-icon');
const chatModal = document.getElementById('chat-modal');
const closeChat = document.getElementById('close-chat');
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');

// Abrir ou fechar o chat ao clicar no ícone do robô
chatIcon.addEventListener('click', () => {
    if (chatModal.style.display === 'block') {
        chatModal.style.display = 'none'; // Fecha o chat se já estiver aberto
    } else {
        chatModal.style.display = 'block'; // Abre o chat
    }
});

// Fechar o chat ao clicar no botão "X"
closeChat.addEventListener('click', () => {
    chatModal.style.display = 'none';
});

// Enviar mensagem ao pressionar Enter
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evita o recarregamento da página
        sendMessage();
    }
});

// Função para enviar mensagem
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    // Exibe a mensagem do usuário
    chatBox.innerHTML += `<div class="user-message">Você: ${message}</div>`;

    // Verifica se a mensagem é um número de 1 a 8
    if (/^[1-8]$/.test(message)) {
        try {
            // Carrega o módulo dinamicamente
            const module = await import(`./modulos/modulo${message}.js`);
            // Executa a função do módulo e obtém a resposta
            const response = module.default();
            // Exibe a resposta do bot
            chatBox.innerHTML += `<div class="bot-message">Bot: ${response}</div>`;
        } catch (error) {
            console.error("Erro ao carregar o módulo:", error);
            chatBox.innerHTML += `<div class="bot-message">Bot: Erro ao carregar a resposta. Tente novamente.</div>`;
        }
    } else {
        // Mensagem de erro para entrada inválida
        chatBox.innerHTML += `<div class="bot-message">Bot: Opção inválida. Por favor, digite um número de 1 a 8.</div>`;
    }

    // Limpa o campo de entrada
    userInput.value = '';
    // Rola para a última mensagem
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Mensagem inicial do bot
window.onload = function () {
    chatBox.innerHTML += `<div class="bot-message">Olá! Digite apenas um número e escolha uma opção:<br><br>
    1. Sobre o Funcionamento das Aulas<br>
    2. Valores da mensalidade e Modalidades<br>
    3. Como é feito o pagamento<br>
    4. Sobre Encontros Musicais<br>
    5. Sobre Aula Experimental<br> 
    6. Sobre Reposição de Aulas<br>
    7. Horários disponíveis<br>
    8. Sair do menu e falar diretamente<br>
    </div>`;
};