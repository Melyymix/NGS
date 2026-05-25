
let currentCategory = 'todos';

function initIntro() {
    const introScreen = document.getElementById('introScreen');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introShownKey = 'ngsIntroShown';
    const storage = {
        get() {
            try {
                return localStorage.getItem(introShownKey);
            } catch (error) {
                return null;
            }
        },
        set() {
            try {
                localStorage.setItem(introShownKey, 'true');
            } catch (error) {
                // Ignore storage restrictions; the intro still works for this visit.
            }
        }
    };

    if (!introScreen || reduceMotion) {
        return;
    }

    if (storage.get() === 'true') {
        introScreen.remove();
        return;
    }

    document.body.classList.add('intro-lock');

    const introImages = Array.from(introScreen.querySelectorAll('img'));
    const imageReady = image => {
        if (image.complete && image.naturalWidth > 0) {
            return Promise.resolve();
        }

        if (typeof image.decode === 'function') {
            return image.decode().catch(() => undefined);
        }

        return new Promise(resolve => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
        });
    };

    const readyTimeout = new Promise(resolve => {
        window.setTimeout(resolve, 4500);
    });

    Promise.race([
        Promise.all(introImages.map(imageReady)),
        readyTimeout
    ]).then(() => {
        introScreen.classList.add('intro-ready');
        storage.set();

        window.setTimeout(() => {
            introScreen.classList.add('is-hidden');
            document.body.classList.remove('intro-lock');
        }, 3200);

        window.setTimeout(() => {
            introScreen.remove();
        }, 4200);
    });
}

document.addEventListener('DOMContentLoaded', initIntro);

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

function filterCategory(category, event) {
    currentCategory = category;
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    displayProducts();
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Al dar clic en "Cotizar este producto", autocompleta el formulario de abajo
function prefillQuote(productName) {
    const product = productosData.find(item => item.name === productName);

    selectedQuoteProducts.clear();

    if (product) {
        selectedQuoteProducts.set(getProductKey(product), product);
        updateQuoteSelectionUI();
        displayProducts();
    } else {
        document.getElementById('mensaje').value = `Hola, me interesa solicitar una cotización del siguiente producto: ${productName}.`;
    }
}

let visibleProducts = 12;
const PRODUCTS_PAGE_SIZE = 12;
const selectedQuoteProducts = new Map();
const QUOTE_MESSAGE_PREFIX = 'Hola, me interesa solicitar una cotización de los siguientes productos:';

function getProductKey(product) {
    return `${product.category}::${product.name}::${product.subcategory}`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getSelectedProductsList() {
    return Array.from(selectedQuoteProducts.values());
}

function buildQuoteMessage() {
    const selectedProducts = getSelectedProductsList();

    if (!selectedProducts.length) {
        return '';
    }

    const productLines = selectedProducts
        .map((product, index) => `${index + 1}. ${product.name} - ${product.subcategory}`)
        .join('\n');

    return `${QUOTE_MESSAGE_PREFIX}\n\n${productLines}`;
}

function ensureQuoteSelectionBar() {
    let quoteBar = document.getElementById('quoteSelectionBar');

    if (quoteBar) return quoteBar;

    quoteBar = document.createElement('div');
    quoteBar.className = 'quote-selection-bar';
    quoteBar.id = 'quoteSelectionBar';
    quoteBar.innerHTML = `
        <div class="quote-selection-copy">
            <strong id="quoteSelectionCount">0 productos seleccionados</strong>
            <span id="quoteSelectionPreview">Listos para cotizar</span>
        </div>
        <div class="quote-selection-actions">
            <button type="button" class="quote-selection-clear" id="clearQuoteSelection">Limpiar</button>
            <button type="button" class="quote-selection-submit" id="submitQuoteSelection">Solicitar cotización</button>
        </div>
    `;

    document.body.appendChild(quoteBar);

    document.getElementById('clearQuoteSelection').addEventListener('click', () => {
        selectedQuoteProducts.clear();
        updateQuoteSelectionUI();
        displayProducts();
    });

    document.getElementById('submitQuoteSelection').addEventListener('click', () => {
        updateQuoteMessage();
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('mensaje').focus({ preventScroll: true });
    });

    return quoteBar;
}

function updateQuoteMessage() {
    const messageField = document.getElementById('mensaje');
    const quoteMessage = buildQuoteMessage();

    if (messageField && quoteMessage) {
        messageField.value = quoteMessage;
    } else if (messageField && messageField.value.startsWith(QUOTE_MESSAGE_PREFIX)) {
        messageField.value = '';
    }
}

function updateQuoteSelectionUI() {
    const quoteBar = ensureQuoteSelectionBar();
    const selectedProducts = getSelectedProductsList();
    const count = selectedProducts.length;
    const countLabel = document.getElementById('quoteSelectionCount');
    const previewLabel = document.getElementById('quoteSelectionPreview');

    quoteBar.classList.toggle('show', count > 0);
    document.body.classList.toggle('has-quote-selection', count > 0);
    countLabel.textContent = `${count} producto${count === 1 ? '' : 's'} seleccionado${count === 1 ? '' : 's'}`;
    previewLabel.textContent = count
        ? selectedProducts.slice(0, 2).map(product => product.name).join(', ') + (count > 2 ? ` y ${count - 2} más` : '')
        : 'Listos para cotizar';

    updateQuoteMessage();
}

function toggleQuoteProduct(product) {
    const productKey = getProductKey(product);

    if (selectedQuoteProducts.has(productKey)) {
        selectedQuoteProducts.delete(productKey);
    } else {
        selectedQuoteProducts.set(productKey, product);
    }

    updateQuoteSelectionUI();
    displayProducts();
}

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
        algodon: "Directos",
        poliester: "Reactivos",
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
        updateQuoteSelectionUI();
        return;
    }

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        const productKey = getProductKey(product);
        const isSelected = selectedQuoteProducts.has(productKey);

        card.className = `product-card${isSelected ? ' selected' : ''}`;
        card.innerHTML = `
    <span class="product-selected-mark" aria-hidden="true">✓</span>
    <div>
        <span class="badge-category badge-${product.classKey}">${escapeHtml(getFriendlyCategoryName(product.category))}</span>
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div class="product-subcategory">${escapeHtml(product.subcategory)}</div>
        ${renderColorCode(product)}
    </div>
    <button type="button" class="btn-card-quote" aria-pressed="${isSelected}">
        ${isSelected ? 'Seleccionado' : 'Agregar a cotización'}
    </button>
    `;
        card.querySelector('.btn-card-quote').addEventListener('click', () => toggleQuoteProduct(product));
        grid.appendChild(card);
    });

    countLabel.textContent = `Mostrando ${productsToShow.length} de ${filteredProducts.length} productos`;
    loadMoreButton.style.display = productsToShow.length < filteredProducts.length ? 'inline-flex' : 'none';
    collapseButton.style.display = productsToShow.length > PRODUCTS_PAGE_SIZE ? 'inline-flex' : 'none';
    updateQuoteSelectionUI();
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

function scrollToCatalogResults() {
    const target = document.getElementById('products') || document.getElementById('productsGrid');
    if (!target) return;

    const navbar = document.querySelector('.navbar');
    const offset = (navbar?.offsetHeight || 0) + 28;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
    });
}

function filterCategory(category) {
    currentCategory = category;
    visibleProducts = PRODUCTS_PAGE_SIZE;
    syncCatalogControls();
    displayProducts();
    window.requestAnimationFrame(scrollToCatalogResults);
}

function scrollToCatalogControls() {
    const target = document.getElementById('categoryCards') || document.getElementById('catalogControls');
    if (!target) return;

    const navbar = document.querySelector('.navbar');
    const offset = (navbar?.offsetHeight || 0) + 28;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
        top: Math.max(0, top),
        behavior: 'smooth'
    });
}

const catalogFilterJump = document.getElementById('catalogFilterJump');
const searchInput = document.getElementById('searchInput');
const clearSearchInput = document.getElementById('clearSearchInput');

function updateCatalogFilterJump() {
    if (!catalogFilterJump) return;

    const productsSection = document.getElementById('productos');
    const controls = document.getElementById('catalogControls');
    const navbar = document.querySelector('.navbar');
    if (!productsSection || !controls) return;

    const navbarHeight = navbar?.offsetHeight || 0;
    const controlsPassed = controls.getBoundingClientRect().bottom < navbarHeight + 16;
    const stillBrowsingCatalog = productsSection.getBoundingClientRect().bottom > window.innerHeight * 0.35;
    const shouldShow = controlsPassed && stillBrowsingCatalog;

    catalogFilterJump.classList.toggle('show', shouldShow);
    catalogFilterJump.tabIndex = shouldShow ? 0 : -1;
    catalogFilterJump.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
}

function updateSearchClearButton() {
    if (!searchInput || !clearSearchInput) return;

    const shouldShow = searchInput.value.trim().length > 0;
    clearSearchInput.classList.toggle('show', shouldShow);
    clearSearchInput.tabIndex = shouldShow ? 0 : -1;
    clearSearchInput.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
}

catalogFilterJump?.addEventListener('click', event => {
    event.currentTarget.blur();
    scrollToCatalogControls();
});
window.addEventListener('scroll', updateCatalogFilterJump, { passive: true });
window.addEventListener('resize', updateCatalogFilterJump);

searchInput?.addEventListener('input', () => {
    visibleProducts = PRODUCTS_PAGE_SIZE;
    displayProducts();
    updateSearchClearButton();
});

clearSearchInput?.addEventListener('click', () => {
    searchInput.value = '';
    visibleProducts = PRODUCTS_PAGE_SIZE;
    displayProducts();
    updateSearchClearButton();
    searchInput.focus();
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
    updateSearchClearButton();
    updateCatalogFilterJump();
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

    if (selectedQuoteProducts.size) {
        updateQuoteMessage();
    }

    const nombre = document.getElementById('nombre').value;
    const mensaje = document.getElementById('mensaje').value;

    const textoMensaje = `Hola, mi nombre es *${nombre}*. Me comunico desde el sitio web con el siguiente interés:\n\n${mensaje}`;
    const mensajeCodificado = encodeURIComponent(textoMensaje);
    const urlWhatsApp = `https://wa.me/${telefonoEmpresa}?text=${mensajeCodificado}`;

    window.open(urlWhatsApp, '_blank');
});
