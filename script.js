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

        // Converter o Set de datas para um array e ordenar em ordem decrescente
        const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));

        // Adicionar as datas à sidebar
        sortedDates.forEach(date => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${date.replace(/\s+/g, '-')}`;
            a.textContent = date;
            li.appendChild(a);
            dateList.appendChild(li);
        });

        // Exibir apenas os posts da data mais recente por padrão
        if (sortedDates.length > 0) {
            const mostRecentDate = sortedDates[0];
            filterPostsByDate(mostRecentDate.replace(/\s+/g, '-'));
        }
    }

    // Função para filtrar posts por data
    function filterPostsByDate(date) {
        const posts = document.querySelectorAll('.card.neon-card');

        posts.forEach(post => {
            const dateElement = post.querySelector('.post-date');
            if (dateElement) {
                const postDate = dateElement.textContent.trim().replace(/\s+/g, '-');
                if (date === postDate) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            }
        });
    }

    // Adicionar datas à sidebar ao carregar a página
    addDatesToSidebar();

    // Filtrar posts por data ao clicar em uma data na sidebar
    document.querySelectorAll('.date-list a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const date = this.textContent.replace(/\s+/g, '-');
            window.location.hash = date;
            filterPostsByDate(date);
        });
    });

    // Filtrar posts por data ao carregar a página com hash na URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        filterPostsByDate(hash);
    }

    // Carregar conteúdo da Wikipedia
    fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/Teoria_musical')
        .then(response => response.json())
        .then(data => {
            document.getElementById('wikipedia-content').innerHTML = data.extract;
        });

    // Controle do toggle e sidebar
    const navbarToggler = document.querySelector('.navbar-toggler');
    const sidebar = document.querySelector('.sidebar');

    navbarToggler.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Fecha a sidebar ao clicar fora dela (opcional)
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !navbarToggler.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });

    // Fixar a sidebar ao rolar a página
    const navbarHeight = 190;
    window.addEventListener('scroll', function() {
        if (window.scrollY >= navbarHeight) {
            sidebar.classList.add('fixed');
        } else {
            sidebar.classList.remove('fixed');
        }
    });
});
