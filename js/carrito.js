let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorMenu();
    if (document.getElementById("lista-carrito")) renderizarCarrito();

    document.addEventListener("click", function (e) {
        // Busca cualquier enlace o botón que tenga la palabra "Comprar"
        const btn = e.target.closest("a, button");

        if (btn && btn.innerText.includes("Comprar")) {
            e.preventDefault();
            const card = btn.closest(".card");

            // Limpieza de datos: extraemos solo el nombre (primera línea del título)
            const tituloNodo = card.querySelector(".card-title").cloneNode(true);
            const precioNodo = tituloNodo.querySelector(".price");
            if (precioNodo) precioNodo.remove(); // Quitamos el precio del clon para tener solo el texto

            const nombre = tituloNodo.innerText.trim();
            const precioTexto = card.querySelector(".price").textContent;
            const precio = parseFloat(precioTexto.replace("€", "").replace(",", "."));
            const imagen = card.querySelector("img").src;

            agregarProducto(nombre, precio, imagen);
        }
    });
});

function agregarProducto(nombre, precio, imagen) {
    let indice = carrito.findIndex(p => p.nombre === nombre);
    if (indice !== -1) {
        carrito[indice].cantidad++;
    } else {
        carrito.push({ nombre, precio, imagen, cantidad: 1 });
    }
    guardarYActualizar();
}

function cambiarCantidad(nombre, delta) {
    let indice = carrito.findIndex(p => p.nombre === nombre);
    if (indice !== -1) {
        carrito[indice].cantidad += delta;
        if (carrito[indice].cantidad <= 0) carrito.splice(indice, 1);
    }
    guardarYActualizar();
}

function guardarYActualizar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorMenu();
    if (document.getElementById("lista-carrito")) renderizarCarrito();
}

function renderizarCarrito() {
    let lista = document.getElementById("lista-carrito");
    let totalElemento = document.getElementById("total");
    if (!lista) return;

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach(p => {
        total += p.precio * p.cantidad;
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center p-3 mb-2 shadow-sm rounded";
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${p.imagen}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; margin-right:15px;">
                <div>
                    <h6 class="mb-0">${p.nombre}</h6>
                    <small class="text-muted">${p.precio.toFixed(2)}€ / ud.</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <span class="fw-bold me-3">${(p.precio * p.cantidad).toFixed(2)}€</span>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad('${p.nombre}', -1)">-</button>
                    <span class="btn btn-sm disabled fw-bold">${p.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad('${p.nombre}', 1)">+</button>
                </div>
            </div>`;
        lista.appendChild(li);
    });

    if (totalElemento) totalElemento.textContent = "Total: " + total.toFixed(2) + "€";
}

function actualizarContadorMenu() {
    let totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    let cartLinks = document.querySelectorAll('a[href="carrito.html"]');

    cartLinks.forEach(link => {
        let badge = link.querySelector(".badge") || document.createElement("span");
        badge.className = "badge rounded-pill bg-danger ms-1";
        badge.textContent = totalItems;
        if (!link.querySelector(".badge")) link.appendChild(badge);
        badge.style.display = totalItems > 0 ? "inline-block" : "none";
    });
}

window.vaciarCarrito = function () {
    carrito = [];
    guardarYActualizar();
};