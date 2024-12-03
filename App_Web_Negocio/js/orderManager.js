document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos del DOM
    const puntosCantidad = document.querySelector(".quantity-number-usar"); // Puntos utilizados
    const puntosAcumulados = document.querySelector("input[readonly]"); // Puntos acumulados
    const cuponesDescuento = document.querySelector("select"); // Dropdown de cupones
    const subtotalField = document.querySelector("aside .border-bottom .fw-bold:nth-child(2)"); // Campo Subtotal
    const descuentoPuntosField = document.getElementById("descuento-puntos"); // Campo descuento por puntos
    const totalField = document.querySelector("aside .mt-3 .fw-bold.bg-body-tertiary"); // Campo Total
    const addButton = document.querySelector(".btn-red"); // Botón "Añadir Pedido"
    const pedidoSection = document.querySelector("article.col-md-6"); // Contenedor de Pedido
    const finalizarCompraButton = document.getElementById("finalizar-compra"); // Botón Finalizar Compra
    const cerrarPaginaButton = document.getElementById("cerrar-pagina"); // Botón Cerrar Página
    const form = document.querySelector(".form-container form"); // Formulario de datos
     
    
     
     

    let carrito = []; // Array para almacenar los productos seleccionados

    // *** Manejo de cantidades en la tabla de productos ***
    function decreaseTablaCantidad(button) {
        const quantityElement = button.parentElement.querySelector(".quantity-number-table");
        let quantity = parseInt(quantityElement.textContent, 10);
        if (quantity > 0) {
            quantity--;
            quantityElement.textContent = quantity;
        }
    }

    function increaseTablaCantidad(button) {
        const quantityElement = button.parentElement.querySelector(".quantity-number-table");
        let quantity = parseInt(quantityElement.textContent, 10);
        quantity++;
        quantityElement.textContent = quantity;
    }
     // Función para finalizar compra
     finalizarCompraButton.addEventListener("click", () => {
        carrito = []; // Vaciar el carrito
        pedidoSection.innerHTML = `<h5 class="fw-bold mb-3 text-center">Pedido</h5>`; // Limpiar sección de pedidos
        subtotalField.textContent = `$0.00`; // Resetear subtotal
        descuentoPuntosField.textContent = `- $0.00`; // Resetear descuento por puntos
        totalField.textContent = `$0.00`; // Resetear total
        cuponesDescuento.selectedIndex = 0; // Reiniciar combo box de cupones
        puntosCantidad.textContent = "0"; // Reiniciar puntos a utilizar
    });

    // Función para redirigir al index
    cerrarPaginaButton.addEventListener("click", () => {
        window.location.href = "./index.html"; // Redirigir a la página principal
    });

    // Asignar eventos a los botones de la tabla de productos
    document.querySelectorAll(".table .quantity-text:first-child").forEach((button) => {
        button.addEventListener("click", () => decreaseTablaCantidad(button));
    });

    document.querySelectorAll(".table .quantity-text:last-child").forEach((button) => {
        button.addEventListener("click", () => increaseTablaCantidad(button));
    });

    // *** Manejo de puntos a utilizar ***
    // Funciones de manejo de puntos a utilizar
    function decreasePuntosCantidad() {
        let puntos = parseInt(puntosCantidad.textContent, 10);
        if (puntos > 0) {
            puntos--;
            puntosCantidad.textContent = puntos;
            actualizarCarrito(); // Actualizar resumen al cambiar puntos
        }
    }

    function increasePuntosCantidad() {
        let puntos = parseInt(puntosCantidad.textContent, 10);
        let maxPuntos = parseInt(puntosAcumulados.value, 10);
        if (puntos < maxPuntos) {
            puntos++;
            puntosCantidad.textContent = puntos;
            actualizarCarrito(); // Actualizar resumen al cambiar puntos
        }
    }
        // Función para limpiar el formulario
    const limpiarFormulario = () => {
        form.reset(); // Reinicia todos los campos del formulario
    };

    // Asignar eventos a los botones de puntos a utilizar
    const puntosContainer = document.querySelector(".quantity-container.points-quantity"); // Contenedor exclusivo de puntos
    puntosContainer.querySelector(".quantity-text:first-child").addEventListener("click", decreasePuntosCantidad);
    puntosContainer.querySelector(".quantity-text:last-child").addEventListener("click", increasePuntosCantidad);

    // *** Agregar productos seleccionados al "carrito" ***
    addButton.addEventListener("click", () => {
        const rows = document.querySelectorAll(".table tbody tr");
        pedidoSection.innerHTML = `<h5 class="fw-bold mb-3 text-center">Pedido</h5>`;
        carrito = []; // Reiniciar carrito

        rows.forEach((row) => {
            const cantidad = parseInt(row.querySelector(".quantity-number-table").textContent, 10);
            if (cantidad > 0) {
                const nombre = row.children[1].textContent;
                const precio = parseFloat(row.children[3].textContent.replace("$", ""));
                const imagenSrc = row.querySelector("img").src;

                // Agregar producto al carrito
                carrito.push({ nombre, precio, cantidad, imagenSrc });

                // Renderizar en la sección Pedido
                const pedidoItem = `
                    <div class="d-flex align-items-center mb-3 p-3 card-producto position-relative">
                        <img src="${imagenSrc}" alt="${nombre}" class="img-producto me-3">
                        <section>
                            <p class="mb-1 fw-bold">${nombre}</p>
                            <p class="mb-0 text-muted">x${cantidad}</p>
                        </section>
                        <p class="ms-auto mb-0 fw-bold">$${(precio * cantidad).toFixed(2)}</p>
                       
                    </div>
                `;
                pedidoSection.innerHTML += pedidoItem;
            }

            // Resetear cantidad en la tabla
            row.querySelector(".quantity-number-table").textContent = "0";
        });
        limpiarFormulario(); // Limpia los campos del formulario
        actualizarCarrito();
    });

    // *** Actualizar carrito, descuentos y totales ***
    function actualizarCarrito() {
        let subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        let descuentoPuntos = parseInt(puntosCantidad.textContent, 10) || 0;
        let descuentoCupon = calcularDescuentoCupon(subtotal);

        // Actualizar campos de Subtotal, Descuentos y Total
        subtotalField.textContent = `$${subtotal.toFixed(2)}`;
        descuentoPuntosField.textContent = `- $${descuentoPuntos.toFixed(2)}`;
        totalField.textContent = `$${(subtotal - descuentoPuntos - descuentoCupon).toFixed(2)}`;
    }

    // Calcular descuento por cupón
    function calcularDescuentoCupon(subtotal) {
        const cuponSeleccionado = cuponesDescuento.value;
        let descuento = 0;

        if (cuponSeleccionado.includes("2%")) descuento = subtotal * 0.02;
        if (cuponSeleccionado.includes("5%")) descuento = subtotal * 0.05;
        if (cuponSeleccionado.includes("10%")) descuento = subtotal * 0.1;

        // Mostrar descuento en el campo correspondiente
        const cuponDescuentoField = cuponesDescuento.nextElementSibling;
        cuponDescuentoField.textContent = `- $${descuento.toFixed(2)}`;

        return descuento;
    }

    // Evento para cambios en el cupón
    cuponesDescuento.addEventListener("change", actualizarCarrito);
});
