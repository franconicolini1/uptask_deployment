let menuIcon = document.getElementById('menu-icon');
let aside = document.querySelector('.main__aside');
let cerrarSesion = document.querySelector('.main__aside__cerrar-sesion');

if (menuIcon) {
    menuIcon.addEventListener('click', () => {
        aside.classList.toggle('show');
        cerrarSesion.classList.toggle('show-cerrar-sesion');

        if (menuIcon.classList.contains('fa-bars')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            menuIcon.classList.add('x');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.remove('x');
            menuIcon.classList.add('fa-bars');
        }
    });
}