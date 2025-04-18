document.addEventListener('DOMContentLoaded', function () {
    const posts = document.querySelectorAll('.post');
    const postsPerPage = 6;
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const pagination = document.getElementById('pagination');

    function showPage(page) {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;

        posts.forEach((post, index) => {
            post.style.display = (index >= start && index < end) ? 'block' : 'none';
        });
    }

    function generatePagination() {
        pagination.innerHTML = '';

        const prev = document.createElement('li');
        prev.className = 'page-item';
        prev.innerHTML = '<a class="page-link" href="#">Previous</a>';
        pagination.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item';
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pagination.appendChild(li);
        }

        const next = document.createElement('li');
        next.className = 'page-item';
        next.innerHTML = '<a class="page-link" href="#">Next</a>';
        pagination.appendChild(next);
    }

    function setActivePage(pageNum) {
        const pageItems = pagination.querySelectorAll('li');
        pageItems.forEach(item => item.classList.remove('active'));

        if (pageNum > 0 && pageNum <= totalPages) {
            pageItems[pageNum].classList.add('active');
        }
    }

    pagination.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.tagName !== 'A') return;

        const clickedText = e.target.textContent;
        const currentActive = pagination.querySelector('li.active');
        let currentPage = [...pagination.children].indexOf(currentActive);

        if (clickedText === 'Previous' && currentPage > 1) {
            currentPage--;
        } else if (clickedText === 'Next' && currentPage < totalPages) {
            currentPage++;
        } else if (!isNaN(parseInt(clickedText))) {
            currentPage = parseInt(clickedText);
        }

        if (currentPage >= 1 && currentPage <= totalPages) {
            showPage(currentPage);
            setActivePage(currentPage);
        }
    });

    generatePagination();
    showPage(1);
    setActivePage(1);
});