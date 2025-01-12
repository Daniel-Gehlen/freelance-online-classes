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

    // Adicionar datas à sidebar
    addDatesToSidebar();

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
