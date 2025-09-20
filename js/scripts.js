
/*=========================================
    PRE-LOADER
==========================================*/
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

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
    TABS
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

        const bannerCarousel = document.querySelector('.carousel-container');
        if (bannerCarousel) {
            const track = bannerCarousel.querySelector('.carousel-track');
            const slides = Array.from(track.children);
            const nextButton = bannerCarousel.querySelector('.carousel-button--right');
            const prevButton = bannerCarousel.querySelector('.carousel-button--left');
            const dotsNav = bannerCarousel.querySelector('.carousel-nav');
            let currentIndex = 0;
            let autoPlayInterval;

            if (slides.length > 0) {
                slides.forEach((slide, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('carousel-indicator');
                    if (index === 0) dot.classList.add('current-slide');
                    dotsNav.appendChild(dot);
                });
            }

            const dots = Array.from(dotsNav.children);

            const moveToSlide = (targetIndex) => {
                track.style.transform = 'translateX(-' + (targetIndex * 100) + '%)';
                if (dots.length > 0) {
                    dots[currentIndex].classList.remove('current-slide');
                    dots[targetIndex].classList.add('current-slide');
                }
                currentIndex = targetIndex;
            };

            const startAutoPlay = () => {
                autoPlayInterval = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                }, 5000);
            };

            const resetAutoPlay = () => {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            };

            nextButton.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slides.length;
                moveToSlide(nextIndex);
                resetAutoPlay();
            });

            prevButton.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                moveToSlide(prevIndex);
                resetAutoPlay();
            });

            dotsNav.addEventListener('click', e => {
                const targetDot = e.target.closest('button');
                if (!targetDot) return;
                const targetIndex = dots.findIndex(dot => dot === targetDot);
                moveToSlide(targetIndex);
                resetAutoPlay();
            });

            if (slides.length > 1) {
                startAutoPlay();
            }
        }

        document.querySelectorAll('a').forEach(link => {
            const url = new URL(link.href, window.location.origin);
            if (link.target === '_blank' ||
                link.getAttribute('href').startsWith('#') ||
                link.classList.contains('agregar-carrito') ||
                link.classList.contains('borrar-producto') ||
                link.id === 'cambiarTema' ||
                url.hostname !== window.location.hostname) {
                return;
            }

            link.addEventListener('click', e => {
                e.preventDefault();
                const destination = link.href;
                document.body.classList.add('page-fade-out');
                setTimeout(() => {
                    window.location.href = destination;
                }, 500);
            });
        });
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

/*=========================================
    FORMULARIO LOGIN
==========================================*/
const formLogin = document.getElementById('formLogin');

if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username.trim() === '' || password.trim() === '') {
            mostrarAlerta('Todos los campos son obligatorios', 'error', this);
            return;
        }

        fetch(`http://localhost:3000/users?username=${username}&password=${password}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    mostrarAlerta('Inicio de sesión exitoso. Redirigiendo...', 'exito', this);
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                } else {
                    mostrarAlerta('Usuario o contraseña incorrectos', 'error', this);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarAlerta('No se pudo conectar con el servidor. Asegúrate de que JSON Server esté corriendo.', 'error', this);
            });
    });
}

/*=========================================
    FORMULARIO NEWSLETTER (FOOTER)
    Y MODAL
==========================================*/
const modal = document.getElementById('newsletterModal');
const openModalBtn = document.getElementById('openNewsletterModal');
const closeModalBtn = document.querySelector('.close-button');
const newsletterForm = document.getElementById('modalNewsletterForm');

if (modal && openModalBtn && closeModalBtn && newsletterForm) {
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    const closeModal = () => {
        modal.style.display = 'none';
        newsletterForm.reset();
        clearAllFeedback();
    };

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    const fields = {
        name: document.getElementById('modalName'),
        email: document.getElementById('modalEmail'),
        phone: document.getElementById('modalPhone'),
        birthdate: document.getElementById('modalBirthdate'),
        interest: document.getElementById('modalInterest'),
        notifications: document.querySelectorAll('input[name="notifications"]'),
        terms: document.getElementById('terms')
    };

    const setFeedback = (element, message, isValid) => {
        const formGroup = element.closest('.form-group');
        const feedbackEl = formGroup.querySelector('.feedback');
        
        element.classList.remove('is-valid', 'is-invalid');
        feedbackEl.classList.remove('is-valid', 'is-invalid');
        feedbackEl.textContent = '';

        if (message) {
            const statusClass = isValid ? 'is-valid' : 'is-invalid';
            element.classList.add(statusClass);
            feedbackEl.classList.add(statusClass);
            feedbackEl.textContent = message;
        }
    };
    
    const clearAllFeedback = () => {
        newsletterForm.querySelectorAll('input, select').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        newsletterForm.querySelectorAll('.feedback').forEach(el => {
            el.textContent = '';
            el.classList.remove('is-valid', 'is-invalid');
        });
    };

    const validateField = (field) => {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.required && ((field.type !== 'checkbox' && value === '') || (field.type === 'checkbox' && !field.checked))) {
            isValid = false;
            message = 'Este campo es obligatorio.';
        } else if (value !== '' || field.type === 'checkbox') {
            switch (field.id) {
                case 'modalName':
                    if (value.length < 3) {
                        isValid = false;
                        message = 'El nombre debe tener al menos 3 caracteres.';
                    }
                    break;
                case 'modalEmail':
                    if (!validarEmail(value)) {
                        isValid = false;
                        message = 'Por favor, ingresa un correo electrónico válido.';
                    }
                    break;
                case 'modalPhone':
                    if (value !== '' && !/^\d{7,15}$/.test(value)) {
                        isValid = false;
                        message = 'Ingresa un número de teléfono válido (solo números).';
                    }
                    break;
                case 'modalBirthdate':
                    const birthDate = new Date(value);
                    const today = new Date();
                    birthDate.setHours(0,0,0,0);
                    today.setHours(0,0,0,0);
                    if (birthDate >= today) {
                        isValid = false;
                        message = 'La fecha no puede ser hoy o en el futuro.';
                    }
                    break;
            }
        }
        
        setFeedback(field, message, isValid);
        return isValid;
    };

    const validateCheckboxGroup = (checkboxes) => {
        const isChecked = Array.from(checkboxes).some(cb => cb.checked);
        const message = isChecked ? '' : 'Debes seleccionar al menos una opción.';
        setFeedback(checkboxes[0], message, isChecked);
        return isChecked;
    };

    Object.values(fields).forEach(fieldOrNodeList => {
        const elements = fieldOrNodeList.nodeName ? [fieldOrNodeList] : Array.from(fieldOrNodeList);
        elements.forEach(el => {
            const eventType = ['checkbox', 'select-one', 'date'].includes(el.type) ? 'change' : 'input';
            el.addEventListener(eventType, () => {
                if (el.name === 'notifications') {
                    validateCheckboxGroup(fieldOrNodeList);
                } else {
                    validateField(el);
                }
            });
        });
    });

    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isNameValid = validateField(fields.name);
        const isEmailValid = validateField(fields.email);
        const isPhoneValid = validateField(fields.phone);
        const isBirthdateValid = validateField(fields.birthdate);
        const isInterestValid = validateField(fields.interest);
        const areNotificationsValid = validateCheckboxGroup(fields.notifications);
        const areTermsValid = validateField(fields.terms);

        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isBirthdateValid && isInterestValid && areNotificationsValid && areTermsValid;

        if (isFormValid) {
            const formData = {
                name: fields.name.value,
                email: fields.email.value,
                phone: fields.phone.value,
                birthdate: fields.birthdate.value,
                interest: fields.interest.value,
                notifications: Array.from(fields.notifications).filter(cb => cb.checked).map(cb => cb.value),
                subscribedAt: new Date().toISOString()
            };

            const submitButton = document.getElementById('submitNewsletter');
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';

            fetch('http://localhost:3000/subscriptions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) throw new Error('Error en el servidor.');
                return response.json();
            })
            .then(data => {
                console.log('Suscripción exitosa:', data);
                mostrarAlerta('¡Gracias por suscribirte! Revisa tu correo.', 'exito', this.parentElement);
                setTimeout(closeModal, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
                mostrarAlerta('Hubo un problema al procesar tu suscripción. Inténtalo más tarde.', 'error', this.parentElement);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Suscribirme';
            });
        } else {
            mostrarAlerta('Por favor, corrige los errores en el formulario.', 'error', this.parentElement);
        }
    });
}

/*=========================================
    FUNCIONES DE UTILIDAD
==========================================*/
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function mostrarAlerta(mensaje, tipo, formulario) {
    const alertaExistente = formulario.parentElement.querySelector('.alerta');
    if (alertaExistente) {
        alertaExistente.remove();
    }

    const alerta = document.createElement('div');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta', `alerta-${tipo}`);

    formulario.parentElement.insertBefore(alerta, formulario);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}
