//CONEXION ENTRE PANTALLAS
const btn_administrator = document.getElementById('btn_administrator');// Selecciona el botón
btn_administrator.addEventListener('click', function () {// Agrega el evento de clic
    window.location.href = 'loginWorkers.html';// Redirige a la página deseada
});

const btn_menuManager = document.getElementById('btn_menuManager');
btn_menuManager.addEventListener('click', function () {
    window.location.href = 'menuManager.html';
});

const btn_orderManager = document.getElementById('btn_orderManager');
btn_orderManager.addEventListener('click', function () {
    window.location.href = 'orderManager.html';
});

const btn_dispatcher = document.getElementById('btn_dispatcher');
btn_dispatcher.addEventListener('click', function () {
    window.location.href = '';
});

