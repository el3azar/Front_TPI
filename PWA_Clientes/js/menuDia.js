// Selección de elementos

const carritoModal = document.getElementById("carrito-modal");
const carritoOverlay = document.getElementById("carrito-overlay");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const carritoContenido = document.getElementById("carrito-contenido");
const puntosUtilizados = document.getElementById("puntos-utilizados");
const puntosAcumulados = document.getElementById("puntos-acumulados");
const cuponesDescuento = document.getElementById("cupones-descuento");


let carrito = [];

// Manejo de cantidad
function decreaseQuantity(button) {
  const quantityElement = button.parentElement.querySelector(".quantity-number");
  let quantity = parseInt(quantityElement.textContent, 10);
  if (quantity > 1) {
    quantity--;
    quantityElement.textContent = quantity;
  }
}

function increaseQuantity(button) {
  const quantityElement = button.parentElement.querySelector(".quantity-number");
  let quantity = parseInt(quantityElement.textContent, 10);
  quantity++;
  quantityElement.textContent = quantity;
}


// Abrir el carrito
function abrirCarrito() {
  carritoModal.classList.add("mostrar");
  carritoOverlay.classList.remove("oculto");
}

// Cerrar el carrito
function cerrarCarrito() {
  carritoModal.classList.remove("mostrar");
  carritoOverlay.classList.add("oculto");
}

// Eventos para cerrar el carrito
cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
carritoOverlay.addEventListener("click", cerrarCarrito);

// Agregar productos al carrito
function agregarAlCarrito(button) {
  const card = button.closest(".card");
  const id = card.dataset.id; // Obtener el id único del producto
  const nombre = card.querySelector(".card-title").textContent;
  const precio = parseFloat(card.querySelector(".card-price").textContent.replace("$", ""));
  const cantidad = parseInt(card.querySelector(".quantity-number").textContent);
  const imagen = card.querySelector("img").src; // Obtener la imagen del producto

  // Verificar si el producto ya está en el carrito por su ID
  const productoExistente = carrito.find((producto) => producto.id === id);

  if (productoExistente) {
    productoExistente.cantidad += cantidad; // Sumar la cantidad si ya existe
  } else {
    // Agregar un nuevo producto al carrito
    carrito.push({ id, nombre, precio, cantidad, imagen });
  }

  actualizarCarrito();
  abrirCarrito();
}


// Actualizar el contenido del carrito
function actualizarCarrito() {
  carritoContenido.innerHTML = "";

  let subtotal = 0;
  let totalProductos = 0; // Contador de productos

  carrito.forEach((producto, index) => {
    subtotal += producto.precio * producto.cantidad;
    totalProductos += producto.cantidad; // Sumar cantidad de cada producto

    const item = document.createElement("div");
    item.classList.add("carrito-item");
    item.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <div>
        <p>${producto.nombre}</p>
        <p>${producto.cantidad} x $${producto.precio.toFixed(2)}</p>
      </div>
      <button onclick="eliminarDelCarrito(${index})">X</button>
    `;
    carritoContenido.appendChild(item);
  });

  document.getElementById("icono-carrito").addEventListener("click", abrirCarrito);

  // Actualizar el subtotal y total
  const descuentoTotal = calcularDescuentos(subtotal);
  document.getElementById("subtotal").textContent = `Sub Total: $${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `Total: $${(subtotal - descuentoTotal).toFixed(2)}`;

  // Actualizar el contador del carrito
  const contadorCarrito = document.getElementById("contador-carrito");
  if (totalProductos > 0) {
    contadorCarrito.textContent = totalProductos;
    contadorCarrito.style.display = "inline"; // Mostrar el contador si hay productos
  } else {
    contadorCarrito.style.display = "none"; // Ocultar el contador si no hay productos
  }
}



// Eliminar un producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

// Calcular descuentos
function calcularDescuentos(subtotal) {
  const puntos = parseInt(puntosUtilizados.textContent, 10) || 0;
  const cupon = cuponesDescuento.value;

  let descuentoPuntos = puntos;
  let descuentoCupon = 0;

  if (cupon.includes("2%")) descuentoCupon = subtotal * 0.02;
  if (cupon.includes("5%")) descuentoCupon = subtotal * 0.05;
  if (cupon.includes("10%")) descuentoCupon = subtotal * 0.1;

  document.getElementById("descuento-puntos").textContent = `- $${descuentoPuntos.toFixed(2)}`;
  document.getElementById("descuento-cupon").textContent = `- $${descuentoCupon.toFixed(2)}`;

  return descuentoPuntos + descuentoCupon;
}

// Manejo de puntos acumulados
function decreasePoints() {
  let puntos = parseInt(puntosUtilizados.textContent, 10);
  if (puntos > 0) puntosUtilizados.textContent = puntos - 1;
  actualizarCarrito();
}

function increasePoints() {
  let puntos = parseInt(puntosUtilizados.textContent, 10);
  let maxPuntos = parseInt(puntosAcumulados.textContent, 10);
  if (puntos < maxPuntos) puntosUtilizados.textContent = puntos + 1;
  actualizarCarrito();
}