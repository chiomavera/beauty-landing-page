let mainNav = document.getElementById('js-menu');

let navBarToggle = document.getElementById('js-Navbar-toggle');

navBarToggle.addEventListener('click', function(){
    mainNav.classList.toggle('active');
})