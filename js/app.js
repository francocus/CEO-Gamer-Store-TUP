
const headerMenu = document.querySelector('.hm-header');

console.log(headerMenu.offsetTop);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        headerMenu.classList.add('header-fixed');
    } else {
        headerMenu.classList.remove('header-fixed');
    }
})

/*=========================================
    Tabs
==========================================*/
if (document.querySelector('.hm-tabs')) {

    const tabLinks = document.querySelectorAll('.hm-tab-link');
    const tabsContent = document.querySelectorAll('.tabs-content');

    tabLinks[0].classList.add('active');

    if (document.querySelector('.tabs-content')) {
        tabsContent[0].classList.add('tab-active');
    }


    for (let i = 0; i < tabLinks.length; i++) {

        tabLinks[i].addEventListener('click', () => {


            tabLinks.forEach((tab) => tab.classList.remove('active'));
            tabLinks[i].classList.add('active');

            tabsContent.forEach((tabCont) => tabCont.classList.remove('tab-active'));
            tabsContent[i].classList.add('tab-active');

        });

    }

}

/*=========================================
    MENU
==========================================*/

const menu = document.querySelector('.icon-menu');
const menuClose = document.querySelector('.cerrar-menu');

menu.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.add('active');
})

menuClose.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.remove('active');
})

/*=========================================
    DARK MODE
==========================================*/

const cambiarTemaBtn = document.getElementById('cambiarTema');
const body = document.body;

if (localStorage.getItem('tema') === 'dark') {
    body.classList.add('dark-mode');
}

if (cambiarTemaBtn) {
    cambiarTemaBtn.addEventListener('click', function (e) {
        e.preventDefault();
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('tema', 'dark');
        } else {
            localStorage.setItem('tema', 'light');
        }
    });
}

/*=========================================
    CARRITO
==========================================*/
const contenedorCarrito = document.getElementById('productos-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const contadoresCarrito = document.querySelectorAll('.hm-icon-cart span');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    document.addEventListener('click', agregarProducto);

    if (contenedorCarrito) {
        contenedorCarrito.addEventListener('click', eliminarProducto);
    }

    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    }

    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        if (contenedorCarrito) {
            carritoHTML();
        }
        actualizarContador();
    });
}

function agregarProducto(e) {
    if (e.target.classList.contains('agregar-carrito')) {
        e.preventDefault();
        const productoSeleccionado = e.target.closest('.product-item');
        leerDatosProducto(productoSeleccionado);
    }
}

function leerDatosProducto(producto) {
    const infoProducto = {
        imagen: producto.querySelector('.p-portada img').src,
        titulo: producto.querySelector('.p-info h3').textContent,
        precio: producto.querySelector('.precio span:first-child').textContent,
        id: producto.dataset.id,
        cantidad: 1
    }

    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        const productos = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                return producto;
            } else {
                return producto;
            }
        });
        articulosCarrito = [...productos];
    } else {
        articulosCarrito = [...articulosCarrito, infoProducto];
    }

    sincronizarStorage();
    actualizarContador();
    if (contenedorCarrito) {
        carritoHTML();
    }
}

function eliminarProducto(e) {
    if (e.target.classList.contains('borrar-producto')) {
        e.preventDefault();
        const productoId = e.target.getAttribute('data-id');

        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);

        carritoHTML();
        sincronizarStorage();
        actualizarContador();
    }
}

function carritoHTML() {
    if (!contenedorCarrito) return;

    limpiarHTML();

    const mensajeVacio = contenedorCarrito.querySelector('.carrito-vacio-mensaje');

    if (articulosCarrito.length > 0) {
        mensajeVacio.style.display = 'none';
        articulosCarrito.forEach(producto => {
            const { imagen, titulo, precio, cantidad, id } = producto;
            const row = document.createElement('div');
            row.classList.add('producto-en-carrito');
            row.innerHTML = `
                <img src="${imagen}" alt="${titulo}" class="img-carrito">
                <div class="info-producto-carrito">
                    <p class="titulo-producto-carrito">${titulo}</p>
                    <p>Precio: ${precio}</p>
                    <p>Cantidad: ${cantidad}</p>
                </div>
                <a href="#" class="borrar-producto" data-id="${id}">X</a>
            `;
            contenedorCarrito.appendChild(row);
        });
    } else {
        mensajeVacio.style.display = 'block';
    }
    actualizarResumen();
}

function actualizarResumen() {
    const subtotalEl = document.getElementById('subtotal-carrito');
    const totalEl = document.getElementById('total-carrito');

    if (subtotalEl && totalEl) {
        let total = 0;
        articulosCarrito.forEach(producto => {
            const precioLimpio = parseFloat(producto.precio.replace(/[S/$. ]/g, ''));
            if (!isNaN(precioLimpio)) {
                total += precioLimpio * producto.cantidad;
            }
        });

        subtotalEl.textContent = `$${total.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }
}

function vaciarCarrito(e) {
    e.preventDefault();
    articulosCarrito = [];
    limpiarHTML();
    carritoHTML();
    sincronizarStorage();
    actualizarContador();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(JSON.parse(JSON.stringify(articulosCarrito))));
}

function limpiarHTML() {
    while (contenedorCarrito.children.length > 1) {
        contenedorCarrito.removeChild(contenedorCarrito.lastChild);
    }
}

function actualizarContador() {
    const totalItems = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    contadoresCarrito.forEach(contador => {
        contador.textContent = totalItems;
    });
}
