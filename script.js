document.addEventListener('DOMContentLoaded', function() {
    // Função para adicionar datas à sidebar
    function addDatesToSidebar() {
        const dateList = document.getElementById('date-list');
        const posts = document.querySelectorAll('.card.neon-card');
        const dates = new Set();

        posts.forEach(post => {
            const date = post.querySelector('.post-date').textContent;
            dates.add(date);
        });

        dates.forEach(date => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${date.replace(/\s+/g, '-')}`;
            a.textContent = date;
            li.appendChild(a);
            dateList.appendChild(li);
        });
    }

    // Função para adicionar tópicos à sidebar
    function addTopicsToSidebar() {
        const topicList = document.getElementById('topic-list');
        const topics = [
            "Análise Musical",
            "História da Música",
            "Educação de Jovens e Adultos no Brasil: História e Política",
            "Educação Musical na Infância",
            "Fundamentos da Música",
            "História da Música Brasileira",
            "Harmonia",
            "Instrumento - Canto",
            "Instrumento - Violão",
            "Materiais Didáticos",
            "Prática Musical em Conjunto",
            "Práticas de Composição para Educação Musical",
            "Práticas Vocais para a Educação Musical",
            "Projetos Sociais e Culturais e Educação Musical",
            "Sociologia e Educação Musical",
            "Tecnologias para Educação Musical"
        ];

        topics.forEach(topic => {
            const li = document.createElement('li');
            li.textContent = topic;
            topicList.appendChild(li);
        });
    }

    // Função para filtrar posts por data
    function filterPostsByDate() {
        const hash = window.location.hash.substring(1);
        const posts = document.querySelectorAll('.card.neon-card');

        posts.forEach(post => {
            const date = post.querySelector('.post-date').textContent.replace(/\s+/g, '-');
            if (hash === date) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Função para filtrar posts por tópico
    function filterPostsByTopic(event) {
        const query = event.target.value.toLowerCase();
        const posts = document.querySelectorAll('.card.neon-card');

        posts.forEach(post => {
            const topic = post.querySelector('.post-topic').textContent.toLowerCase();
            if (topic.includes(query)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    }

    // Adicionar datas e tópicos à sidebar
    addDatesToSidebar();
    addTopicsToSidebar();

    // Adicionar evento de filtro por tópico
    document.getElementById('search-bar').addEventListener('input', filterPostsByTopic);

    // Filtrar posts por data ao carregar a página
    filterPostsByDate();
});

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
