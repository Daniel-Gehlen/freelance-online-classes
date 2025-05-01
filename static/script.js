document.addEventListener('DOMContentLoaded', function () {
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
    document.getElementById('date-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const date = event.target.textContent.replace(/\s+/g, '-');
            window.location.hash = date;
            filterPostsByDate(date);
        }
    });

    // Filtrar posts por data ao carregar a página com hash na URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        filterPostsByDate(hash);
    }

    // Controle do toggle e sidebar
    const navbarToggler = document.querySelector('.navbar-toggler-icon');
    const sidebar = document.querySelector('.sidebar');

    if (navbarToggler && sidebar) {
        navbarToggler.addEventListener('click', function () {
            // Rola a página para o topo suavemente apenas se o usuário não estiver no topo
            if (window.scrollY > 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Abre ou fecha o sidebar
            sidebar.classList.toggle('open');
        });

        // Fecha a sidebar ao clicar fora dela
        document.addEventListener('click', function (event) {
            if (!sidebar.contains(event.target) && !navbarToggler.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Fixar a sidebar ao rolar a página
    const navbarHeight = 190;
    window.addEventListener('scroll', function () {
        if (sidebar) {
            if (window.scrollY >= navbarHeight) {
                sidebar.classList.add('fixed');
            } else {
                sidebar.classList.remove('fixed');
            }
        }
    });

    // Botão de voltar ao topo
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        // Mostra ou esconde o botão conforme o scroll
        window.onscroll = function () {
            if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
                scrollToTopBtn.style.display = 'block';
            } else {
                scrollToTopBtn.style.display = 'none';
            }
        };

        // Função para voltar ao topo
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        });
    }
});

