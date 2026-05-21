
let currentCategory = 'todos';

// --- FUNCIÓN PARA MOSTRAR LOS PRODUCTOS ---
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    grid.innerHTML = ''; // Limpiar grilla

    // Filtrar arreglo por categoría y término de búsqueda
    const filteredProducts = productosData.filter(product => {
        const matchCategory = (currentCategory === 'todos' || product.category === currentCategory);
        const matchSearch = product.name.toLowerCase().includes(searchInput) ||
            product.subcategory.toLowerCase().includes(searchInput);
        return matchCategory && matchSearch;
    });

    // Validar si existen resultados
    if (filteredProducts.length === 0) {
        grid.innerHTML = `<div class="no-results">No se encontraron productos que coincidan con tu búsqueda.</div>`;
        return;
    }

    // Construir e inyectar HTML de las tarjetas
    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
    <div>
        <span class="badge-category badge-${product.classKey}">${getFriendlyCategoryName(product.category)}</span>
        <div class="product-name">${product.name}</div>
        <div class="product-subcategory">${product.subcategory}</div>
    </div>
    <a href="#contacto" class="btn-card-quote" onclick="prefillQuote('${product.name}')">Cotizar este producto</a>
    `;
        grid.appendChild(card);
    });
}

// Retornar nombres legibles de categorías para los Badges
function getFriendlyCategoryName(cat) {
    const names = {
        algodon: "Para Algodón",
        poliester: "Para Poliéster",
        acidos: "Ácidos",
        solventes: "Solventes",
        pigmentos: "Pigmentos",
        glitters: "Glitters",
        auxiliares: "Auxiliares",
        blancos: "Ópticos"
    };
    return names[cat] || cat;
}

// Manejar cambio de Tabs de filtrado
function filterCategory(category) {
    currentCategory = category;

    // Actualizar clase activa en botones
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    displayProducts();
}

// Al dar clic en "Cotizar este producto", autocompleta el formulario de abajo
function prefillQuote(productName) {
    document.getElementById('mensaje').value = `Hola, me interesa solicitar una cotización del siguiente producto: ${productName}.`;
}

let visibleProducts = 12;
const PRODUCTS_PAGE_SIZE = 12;

function getFilteredProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase().trim();

    return productosData.filter(product => {
        const matchCategory = currentCategory === 'todos' || product.category === currentCategory;
        const matchSearch = product.name.toLowerCase().includes(searchInput) ||
            product.subcategory.toLowerCase().includes(searchInput);
        return matchCategory && matchSearch;
    });
}

function getFriendlyCategoryName(cat) {
    const names = {
        algodon: "Para Algodón",
        poliester: "Para Poliéster",
        acidos: "Ácidos",
        solventes: "Solventes",
        pigmentos: "Pigmentos",
        glitters: "Glitters",
        auxiliares: "Auxiliares",
        blancos: "Ópticos"
    };
    return names[cat] || cat;
}

function renderColorCode(product) {
    const hiddenCategories = ['auxiliares', 'blancos'];
    const hex = product.hex || '';
    const isValidHex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);

    if (hiddenCategories.includes(product.category) || !isValidHex) {
        return '';
    }

    const normalizedHex = hex.toUpperCase();

    return `
        <div class="product-color-code" aria-label="Muestra aproximada del color">
            <span class="color-swatch" style="background-color: ${normalizedHex};" aria-hidden="true"></span>
        </div>
    `;
}

function displayProducts() {
    const grid = document.getElementById('productsGrid');
    const countLabel = document.getElementById('productsCount');
    const loadMoreButton = document.getElementById('loadMoreProducts');
    const collapseButton = document.getElementById('collapseProductsBtn');
    const filteredProducts = getFilteredProducts();
    const productsToShow = filteredProducts.slice(0, visibleProducts);

    grid.innerHTML = '';

    if (filteredProducts.length === 0) {
        grid.innerHTML = `<div class="no-results">No se encontraron productos que coincidan con tu búsqueda.</div>`;
        countLabel.textContent = 'Sin resultados por ahora';
        loadMoreButton.style.display = 'none';
        collapseButton.style.display = 'none';
        return;
    }

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
    <div>
        <span class="badge-category badge-${product.classKey}">${getFriendlyCategoryName(product.category)}</span>
        <div class="product-name">${product.name}</div>
        <div class="product-subcategory">${product.subcategory}</div>
        ${renderColorCode(product)}
    </div>
    <a href="#contacto" class="btn-card-quote" onclick="prefillQuote('${product.name}')">Cotizar este producto</a>
    `;
        grid.appendChild(card);
    });

    countLabel.textContent = `Mostrando ${productsToShow.length} de ${filteredProducts.length} productos`;
    loadMoreButton.style.display = productsToShow.length < filteredProducts.length ? 'inline-flex' : 'none';
    collapseButton.style.display = productsToShow.length > PRODUCTS_PAGE_SIZE ? 'inline-flex' : 'none';
}

function renderCategoryCards() {
    const categoryCards = document.getElementById('categoryCards');
    const catalogTotal = document.getElementById('catalogTotal');
    const categoryOrder = ['algodon', 'poliester', 'acidos', 'solventes', 'pigmentos', 'glitters', 'auxiliares', 'blancos'];

    if (!categoryCards) return;

    catalogTotal.textContent = productosData.length;
    categoryCards.innerHTML = '';

    categoryOrder.forEach(category => {
        const count = productosData.filter(product => product.category === category).length;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `category-card category-${category}`;
        card.innerHTML = `
            <span>${getFriendlyCategoryName(category)}</span>
            <strong>${count}</strong>
            <small>productos</small>
        `;
        card.addEventListener('click', () => filterCategory(category));
        categoryCards.appendChild(card);
    });
}

function syncCatalogControls() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        btn.classList.toggle('active', onclick.includes(`'${currentCategory}'`));
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('active', card.classList.contains(`category-${currentCategory}`));
    });
}

function filterCategory(category) {
    currentCategory = category;
    visibleProducts = PRODUCTS_PAGE_SIZE;
    syncCatalogControls();
    displayProducts();
}

document.getElementById('searchInput').addEventListener('input', () => {
    visibleProducts = PRODUCTS_PAGE_SIZE;
    displayProducts();
});

document.getElementById('loadMoreProducts')?.addEventListener('click', () => {
    visibleProducts += PRODUCTS_PAGE_SIZE;
    displayProducts();
});

document.getElementById('collapseProductsBtn')?.addEventListener('click', () => {
    visibleProducts = PRODUCTS_PAGE_SIZE;
    displayProducts();
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function initCatalog() {
    renderCategoryCards();
    syncCatalogControls();
    displayProducts();
}

// Menú hamburguesa en pantallas pequeñas
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function () {
        setActiveNavLink(link.getAttribute('href').replace('#', ''));
        navMenu.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

const navLinks = document.querySelectorAll('.nav-menu a');
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
}

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setActiveNavLink(entry.target.id);
        }
    });
}, {
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));
setActiveNavLink('inicio');

const companyFeatureCards = Array.from(document.querySelectorAll('#empresa .feature-card'));
const companyFeaturesGrid = document.querySelector('#empresa .features-grid');
let featureCardsExpanded = false;
let featureAnimationTimers = [];

function clearFeatureAnimationTimers() {
    featureAnimationTimers.forEach(timer => clearTimeout(timer));
    featureAnimationTimers = [];
}

function setCompanyCardsExpanded(expanded) {
    if (!companyFeatureCards.length || featureCardsExpanded === expanded) return;

    featureCardsExpanded = expanded;
    clearFeatureAnimationTimers();

    const orderedCards = expanded ? companyFeatureCards : [...companyFeatureCards].reverse();

    orderedCards.forEach((card, index) => {
        const timer = setTimeout(() => {
            card.classList.toggle('active', expanded);
        }, index * 135);

        featureAnimationTimers.push(timer);
    });
}

if (companyFeaturesGrid && 'IntersectionObserver' in window) {
    const companyCardsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            setCompanyCardsExpanded(entry.isIntersecting && entry.intersectionRatio >= 0.18);
        });
    }, {
        threshold: [0, 0.18, 0.45],
        rootMargin: '-8% 0px -14% 0px'
    });

    companyCardsObserver.observe(companyFeaturesGrid);
} else {
    companyFeatureCards.forEach(card => card.classList.add('active'));
}

const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.carousel-dots button');
const carouselTrack = document.querySelector('.carousel-track');
const carouselPrev = document.querySelector('.carousel-prev');
const carouselNext = document.querySelector('.carousel-next');
let currentSlide = 0;
let carouselTimer;
let swipeStartX = 0;
let swipeStartY = 0;
let isSwipingCarousel = false;

function showCarouselSlide(index) {
    if (!carouselSlides.length) return;

    currentSlide = (index + carouselSlides.length) % carouselSlides.length;

    carouselSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentSlide);
    });

    carouselDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlide);
    });
}

carouselDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(carouselTimer);
        showCarouselSlide(index);
        startCarouselTimer();
    });
});

function moveCarousel(step) {
    clearInterval(carouselTimer);
    showCarouselSlide(currentSlide + step);
    startCarouselTimer();
}

function startCarouselTimer() {
    if (carouselSlides.length <= 1) return;

    carouselTimer = setInterval(() => {
        showCarouselSlide(currentSlide + 1);
    }, 4500);
}

function restartCarouselTimer() {
    clearInterval(carouselTimer);
    startCarouselTimer();
}

carouselPrev?.addEventListener('click', () => moveCarousel(-1));
carouselNext?.addEventListener('click', () => moveCarousel(1));

carouselPrev?.addEventListener('pointerdown', event => event.stopPropagation());
carouselNext?.addEventListener('pointerdown', event => event.stopPropagation());

carouselTrack?.addEventListener('pointerdown', event => {
    if (event.target.closest('.carousel-arrow')) return;

    isSwipingCarousel = true;
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;
});

carouselTrack?.addEventListener('pointerup', event => {
    if (!isSwipingCarousel) return;

    const diffX = event.clientX - swipeStartX;
    const diffY = event.clientY - swipeStartY;
    isSwipingCarousel = false;

    if (Math.abs(diffX) > 48 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
        moveCarousel(diffX > 0 ? -1 : 1);
    }
});

carouselTrack?.addEventListener('pointercancel', () => {
    isSwipingCarousel = false;
});

startCarouselTimer();

// Inicializar renderizado al cargar la página
window.onload = initCatalog;


// --- MANEJO DEL FORMULARIO DE WHATSAPP ---
document.getElementById('wppForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Configura aquí el número de la empresa anteponiendo el código de país (52 para México)
    const telefonoEmpresa = "525545698672";

    const nombre = document.getElementById('nombre').value;
    const mensaje = document.getElementById('mensaje').value;

    const textoMensaje = `Hola, mi nombre es *${nombre}*. Me comunico desde el sitio web con el siguiente interés:\n\n${mensaje}`;
    const mensajeCodificado = encodeURIComponent(textoMensaje);
    const urlWhatsApp = `https://wa.me/${telefonoEmpresa}?text=${mensajeCodificado}`;

    window.open(urlWhatsApp, '_blank');
});
