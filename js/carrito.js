// ===============================
// CARRITO WEREABLE
// ===============================

// Obtener carrito del localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // AÑADIR PRODUCTOS AL CARRITO
    // ===============================

    let botones = document.querySelectorAll(".btn-comprar");

    botones.forEach(boton => {
        boton.addEventListener("click", function () {

            let card = boton.closest(".card");

            // Obtener nombre sin incluir el precio
            let titulo = card.querySelector(".card-title").cloneNode(true);
            let precioElemento = titulo.querySelector(".price");
            if (precioElemento) {
                precioElemento.remove();
            }

            let nombre = titulo.textContent.trim();

            // Obtener precio
            let precioTexto = card.querySelector(".price").textContent;
            let precio = parseFloat(
                precioTexto.replace("€", "").replace(",", ".")
            );

            // Añadir producto al carrito
            carrito.push({
                nombre: nombre,
                precio: precio
            });

            // Guardar en localStorage
            localStorage.setItem("carrito", JSON.stringify(carrito));

            alert("Producto añadido al carrito 🛒");
        });
    });


    // ===============================
    // MOSTRAR CARRITO (si estamos en carrito.html)
    // ===============================

    let lista = document.getElementById("lista-carrito");

    if (lista) {

        let total = 0;

        carrito.forEach((producto, index) => {

            let li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

            li.innerHTML = `
                ${producto.nombre} - ${producto.precio.toFixed(2)}€
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${index})">
                    X
                </button>
            `;

            lista.appendChild(li);

            total += producto.precio;
        });

        let totalElemento = document.getElementById("total");
        if (totalElemento) {
            totalElemento.textContent = "Total: " + total.toFixed(2) + "€";
        }
    }

});


// ===============================
// ELIMINAR PRODUCTO INDIVIDUAL
// ===============================
function eliminarProducto(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();
}


// ===============================
// VACIAR CARRITO
// ===============================
function vaciarCarrito() {
    localStorage.removeItem("carrito");
    location.reload();
}