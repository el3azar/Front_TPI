document.addEventListener("DOMContentLoaded", () => {
    const puntosCantidad = document.querySelector(".quantity-number-usar"); // Puntos utilizados
    const subtotalField = document.querySelector(".pedido .fw-bold:nth-of-type(2)"); // Campo Subtotal
    const totalField = document.querySelector(".pedido .fw-bold:last-of-type"); // Campo Total
    const addButton = document.querySelector(".btn-red"); // Botón "Añadir Pedido"
    const pedidoSection = document.querySelector(".pedido"); // Contenedor de Pedido
    const finalizarCompraButton = document.getElementById("finalizar-compra"); // Botón Finalizar Compra
    const form = document.querySelector(".form-container form"); // Formulario de datos
    let carrito = []; // Array para almacenar los productos seleccionados

    // Funciones reutilizables
    function obtenerCantidadActual(elemento) {
        return parseInt(elemento.textContent, 10) || 0;
    }

    function establecerCantidad(elemento, cantidad) {
        elemento.textContent = cantidad;
    }

    // Manejo de cantidades en la tabla de productos
    function decreaseTablaCantidad(button) {
        const quantityElement = button.parentElement.querySelector(".quantity-number-table");
        let quantity = obtenerCantidadActual(quantityElement);
        if (quantity > 0) {
            establecerCantidad(quantityElement, quantity - 1);
        }
    }

    function increaseTablaCantidad(button) {
        const quantityElement = button.parentElement.querySelector(".quantity-number-table");
        let quantity = obtenerCantidadActual(quantityElement);
        establecerCantidad(quantityElement, quantity + 1);
    }

    // Delegación de eventos para los botones de cantidad en la tabla
    document.querySelector(".table tbody").addEventListener("click", (event) => {
        if (event.target.classList.contains("decrease")) {
            decreaseTablaCantidad(event.target);
        } else if (event.target.classList.contains("increase")) {
            increaseTablaCantidad(event.target);
        }
    });

    // Agregar productos seleccionados al "carrito"
    addButton.addEventListener("click", () => {
        const rows = document.querySelectorAll(".table tbody tr");
        pedidoSection.innerHTML = `<h5 class="fw-bold mb-3 text-center">Pedido</h5>`;
        carrito = []; // Reiniciar carrito

        rows.forEach((row) => {
            const cantidad = obtenerCantidadActual(row.querySelector(".quantity-number-table"));
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
            establecerCantidad(row.querySelector(".quantity-number-table"), 0);
        });

        limpiarFormulario();
        actualizarCarrito();
    });

    // Función para limpiar el formulario
    function limpiarFormulario() {
        form.reset();
    }

    // Actualizar carrito y totales
    function actualizarCarrito() {
        let subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        let descuentoPuntos = obtenerCantidadActual(puntosCantidad);
        let descuentoCupon = calcularDescuentoCupon(subtotal);
    
        // Actualizar campos de Subtotal, Descuentos y Total
        subtotalField.textContent = `$${subtotal.toFixed(2)}`;
        descuentoPuntosField.textContent = `- $${descuentoPuntos.toFixed(2)}`;
        totalField.textContent = `$${(subtotal - descuentoPuntos - descuentoCupon).toFixed(2)}`;
    
        // Actualizar el campo TOTAL en el HTML
        const campoTotal = document.getElementById("campo-total");
        if (campoTotal) {
            campoTotal.textContent = `$${(subtotal - descuentoPuntos - descuentoCupon).toFixed(2)}`;
        }
    }
    

    // Función para finalizar compra
    finalizarCompraButton.addEventListener("click", () => {
        carrito = [];
        pedidoSection.innerHTML = `<h5 class="fw-bold mb-3 text-center">Pedido</h5>`;
        subtotalField.textContent = `$0.00`;
        totalField.textContent = `$0.00`;
    });
});
