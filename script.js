document.addEventListener('DOMContentLoaded', function() {
    // Primeiro script
    function addDatesToSidebar() {
        const dateList = document.getElementById('date-list');
        const posts = document.querySelectorAll('.card.neon-card');
        const dates = new Set();

        posts.forEach(post => {
            const dateElement = post.querySelector('.post-date');
            if (dateElement) {
                const date = dateElement.textContent.trim();
                dates.add(date);
            }
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

    addDatesToSidebar();
    filterPostsByDate();

    document.querySelectorAll('.date-list a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const date = this.textContent.replace(/\s+/g, '-');
            window.location.hash = date;
            filterPostsByDate();
        });
    });

    fetch('https://pt.wikipedia.org/api/rest_v1/page/summary/Teoria_musical')
        .then(response => response.json())
        .then(data => {
            document.getElementById('wikipedia-content').innerHTML = data.extract;
        });

    // Segundo script
    const sidebar = document.querySelector('.sidebar');
    const navbarHeight = 190;

    window.addEventListener('scroll', function() {
        if (window.scrollY >= navbarHeight) {
            sidebar.classList.add('fixed');
        } else {
            sidebar.classList.remove('fixed');
        }
    });
});
