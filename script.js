document.addEventListener('DOMContentLoaded', function() {
    // Função para adicionar datas à sidebar
    function addDatesToSidebar() {
        const dateList = document.getElementById('date-list');
        const posts = document.querySelectorAll('.card.neon-card');
        const dates = new Set();

        // Coletar todas as datas dos posts
        posts.forEach(post => {
            const dateElement = post.querySelector('.post-date');
            if (dateElement) {
                const date = dateElement.textContent.trim();
                dates.add(date);
            }
        });

        // Adicionar as datas à sidebar
        dates.forEach(date => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${date.replace(/\s+/g, '-')}`;
            a.textContent = date;
            li.appendChild(a);
            dateList.appendChild(li);
        });
    }

    // Função para filtrar posts por data
    function filterPostsByDate() {
        const hash = window.location.hash.substring(1);
        const posts = document.querySelectorAll('.card.neon-card');

        posts.forEach(post => {
            const dateElement = post.querySelector('.post-date');
            if (dateElement) {
                const date = dateElement.textContent.trim().replace(/\s+/g, '-');
                if (hash === date) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            }
        });
    }

    // Adicionar datas à sidebar ao carregar a página
    addDatesToSidebar();

    // Filtrar posts por data ao carregar a página
    filterPostsByDate();

    // Adicionar evento de clique para filtrar posts por data
    document.querySelectorAll('.date-list a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const date = this.textContent.replace(/\s+/g, '-');
            window.location.hash = date;
            filterPostsByDate();
        });
    });

    // Carregar conteúdo da Wikipedia
    fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/Teoria_musical')
      .then(response => response.json())
      .then(data => {
          document.getElementById('wikipedia-content').innerHTML = data.extract;
      });
});

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const navbarHeight = 190; // Altura da navbar

    window.addEventListener('scroll', function() {
        if (window.scrollY >= navbarHeight) {
            sidebar.classList.add('fixed'); // Fixa a sidebar no topo
        } else {
            sidebar.classList.remove('fixed'); // Retorna à posição inicial
        }
    });
});