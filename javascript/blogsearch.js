document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search blog posts...';
    searchInput.className = 'form-control mb-3';
    searchInput.style.maxWidth = '400px';
    searchInput.style.margin = '50px auto 0 auto'; 
    const container = document.querySelector('.container1');
    container.insertBefore(searchInput, container.firstChild);

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        const posts = document.querySelectorAll('.post');

        posts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const description = post.querySelector('.post-description').textContent.toLowerCase();
            const meta = post.querySelector('.post-meta').textContent.toLowerCase();

            if (title.includes(query) || description.includes(query) || meta.includes(query)) {
                post.style.display = 'block';
            } else {
                post.style.display = 'none';
            }
        });
    });
});