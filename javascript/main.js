window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const brand = document.querySelector('.navbar-brand');
    const icon = document.querySelector('.navbar-brand .icon');
    if (window.scrollY > 50) {
        navbar.style.padding = '5px 10px';
        navbar.style.fontSize = '0.9rem';
        brand.style.fontSize = '1.5rem';
        icon.style.width = '50px';
        icon.style.height = '50px';
        navbar.style.transition = 'all 0.3s ease';
        brand.style.transition = 'all 0.3s ease';
        icon.style.transition = 'all 0.3s ease';
    } else {
        navbar.style.padding = '10px 20px';
        navbar.style.fontSize = '1rem';
        brand.style.fontSize = '1.8rem';
        icon.style.width = '60px';
        icon.style.height = '60px';
        navbar.style.transition = 'all 0.3s ease';
        brand.style.transition = 'all 0.3s ease';
        icon.style.transition = 'all 0.3s ease';
    }
});