
let currentCategory = 'todos';

function initIntro() {
    const introScreen = document.getElementById('introScreen');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!introScreen || reduceMotion) {
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

        window.setTimeout(() => {
            introScreen.classList.add('is-hidden');
            document.body.classList.remove('intro-lock');
        }, 4800);

        window.setTimeout(() => {
            introScreen.remove();
        }, 6200);
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
        document.getElementById('mensaje').value = `${QUOTE_MESSAGE_SINGLE_PREFIX} ${productName}.`;
    }
}

const INITIAL_ALL_PRODUCTS = 5;
const PRODUCTS_PAGE_SIZE = 12;
let visibleProducts = INITIAL_ALL_PRODUCTS;
const selectedQuoteProducts = new Map();
const QUOTE_MESSAGE_SINGLE_PREFIX = 'Hola, me interesa solicitar información del siguiente producto:';
const QUOTE_MESSAGE_MULTI_PREFIX = 'Hola, me interesa solicitar información de los siguientes productos:';
const QUOTE_MESSAGE_PREFIXES = [QUOTE_MESSAGE_SINGLE_PREFIX, QUOTE_MESSAGE_MULTI_PREFIX];

function getInitialVisibleProducts(category = currentCategory) {
    return category === 'todos' ? INITIAL_ALL_PRODUCTS : PRODUCTS_PAGE_SIZE;
}

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

    if (selectedProducts.length === 1) {
        const [product] = selectedProducts;
        return `${QUOTE_MESSAGE_SINGLE_PREFIX}\n\n${product.name} - ${product.subcategory}`;
    }

    const productLines = selectedProducts
        .map((product, index) => `${index + 1}. ${product.name} - ${product.subcategory}`)
        .join('\n');

    return `${QUOTE_MESSAGE_MULTI_PREFIX}\n\n${productLines}`;
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
            <button type="button" class="quote-selection-submit" id="submitQuoteSelection">Solicitar información</button>
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
    } else if (messageField && QUOTE_MESSAGE_PREFIXES.some(prefix => messageField.value.startsWith(prefix))) {
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

const CATALOG_FILTERS = [
    { id: 'todos', label: 'Todos', showCard: false, match: () => true },
    { id: 'directos', label: 'Directos', match: product => normalizeText(product.subcategory).includes('directos') },
    {
        id: 'reactivos',
        label: 'Reactivos',
        match: product => normalizeText(product.subcategory).includes('reactivos')
    },
    { id: 'dispersos', label: 'Dispersos', match: product => normalizeText(product.subcategory).includes('dispersos') },
    { id: 'acidos', label: 'Ácidos', match: product => product.category === 'acidos' },
    { id: 'azufre', label: 'Azufre', match: product => normalizeText(product.subcategory).includes('azufre') },
    { id: 'transfer', label: 'Transfer', match: product => normalizeText(product.subcategory).includes('transfer') },
    { id: 'solventes', label: 'Solventes', match: product => product.category === 'solventes' },
    { id: 'pigmentos', label: 'Pigmentos', match: product => product.category === 'pigmentos' },
    { id: 'glitters', label: 'Glitters', match: product => product.category === 'glitters' },
    { id: 'auxiliares', label: 'Auxiliares', match: product => product.category === 'auxiliares' },
    {
        id: 'blancos',
        label: 'Ópticos',
        badgeLabel: 'Ópticos',
        match: product => product.category === 'blancos'
    }
];

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

function getCatalogFilter(filterId) {
    return CATALOG_FILTERS.find(filter => filter.id === filterId);
}

function productMatchesFilter(product, filterId) {
    const filter = getCatalogFilter(filterId);

    if (filter) {
        return filter.match(product);
    }

    return product.category === filterId;
}

function getProductBadgeLabel(product) {
    const filter = CATALOG_FILTERS.find(item => item.id !== 'todos' && item.match(product));

    return filter?.badgeLabel || filter?.label || getFriendlyCategoryName(product.category);
}

function getReactiveTemperatureTag(product) {
    const subcategory = normalizeText(product.subcategory);

    if (subcategory.includes('bifuncionales')) {
        return { label: '60° C', type: 'bi' };
    }

    if (subcategory.includes('monoclorotriazina') || subcategory.includes('monofuncional')) {
        return { label: '80° C', type: 'mono' };
    }

    return null;
}

function getFilteredProducts() {
    const searchInput = normalizeText(document.getElementById('searchInput').value);

    return productosData.filter(product => {
        const reactiveTag = getReactiveTemperatureTag(product);
        const matchCategory = productMatchesFilter(product, currentCategory);
        const searchableText = normalizeText([
            product.name,
            product.subcategory,
            getProductBadgeLabel(product),
            reactiveTag?.label,
            getFriendlyCategoryName(product.category)
        ].join(' '));
        const matchSearch = !searchInput || searchableText.includes(searchInput);
        return matchCategory && matchSearch;
    });
}

function getFriendlyCategoryName(cat) {
    const names = {
        algodon: "Colorantes",
        poliester: "Colorantes",
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

    if (hiddenCategories.includes(product.category)) {
        return '';
    }

    if (product.category === 'glitters') {
        let imageUrl = '';
        if (product.name.includes('Multicolor')) imageUrl = 'multicolor.jpeg';
        else if (product.name.includes('Plata')) imageUrl = 'plata.jpeg';
        else if (product.name.includes('Dorado')) imageUrl = 'dorado.jpeg';
        else if (product.name.includes('Rosa')) imageUrl = 'rosa.jpeg';
        
        return `
        <div class="product-color-code" aria-label="Muestra de glitter">
            <span class="color-swatch" style="background-image: url('./assets/${imageUrl}'); background-position: center; background-repeat: no-repeat;" aria-hidden="true"></span>
        </div>
        `;
    }

    const hex = product.hex || '';
    const isValidHex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);

    if (!isValidHex) {
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
        const reactiveTag = getReactiveTemperatureTag(product);

        card.className = `product-card${isSelected ? ' selected' : ''}${reactiveTag ? ' has-process-tag' : ''}`;
        card.innerHTML = `
    ${reactiveTag ? `<span class="product-process-tag product-process-${reactiveTag.type}">${escapeHtml(reactiveTag.label)}</span>` : ''}
    <span class="product-selected-mark" aria-hidden="true">✓</span>
    <div>
        <span class="badge-category badge-${product.classKey}">${escapeHtml(getProductBadgeLabel(product))}</span>
        <div class="product-name">${escapeHtml(product.name)}</div>
        <div class="product-subcategory">${escapeHtml(product.subcategory)}</div>
        ${renderColorCode(product)}
    </div>
    <button type="button" class="btn-card-quote" aria-pressed="${isSelected}">
        ${isSelected ? 'Seleccionado' : 'Más información'}
    </button>
    `;
        card.querySelector('.btn-card-quote').addEventListener('click', () => toggleQuoteProduct(product));
        grid.appendChild(card);
    });

    countLabel.textContent = `Mostrando ${productsToShow.length} de ${filteredProducts.length} productos`;
    loadMoreButton.style.display = productsToShow.length < filteredProducts.length ? 'inline-flex' : 'none';
    collapseButton.style.display = productsToShow.length > getInitialVisibleProducts() ? 'inline-flex' : 'none';
    updateQuoteSelectionUI();
}

function renderCategoryCards() {
    const categoryCards = document.getElementById('categoryCards');
    const catalogTotal = document.getElementById('catalogTotal');
    const categoryFilters = CATALOG_FILTERS.filter(filter => filter.showCard !== false);

    if (!categoryCards) return;

    catalogTotal.textContent = productosData.length;
    categoryCards.innerHTML = '';

    categoryFilters.forEach(filter => {
        const count = productosData.filter(product => productMatchesFilter(product, filter.id)).length;
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `category-card category-${filter.id}`;
        card.dataset.filterId = filter.id;
        card.innerHTML = `
            <span>${filter.cardLabel || filter.label}</span>
            <strong>${count}</strong>
            <small>productos</small>
        `;
        card.addEventListener('click', () => filterCategory(filter.id));
        categoryCards.appendChild(card);
    });
}

function syncCatalogControls() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const onclick = btn.getAttribute('onclick') || '';
        const filterId = btn.dataset.filterId || onclick.match(/filterCategory\('([^']+)'\)/)?.[1];
        btn.classList.toggle('active', filterId === currentCategory);
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.toggle('active', card.dataset.filterId === currentCategory);
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
    visibleProducts = getInitialVisibleProducts(category);
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
    currentCategory = 'todos';
    visibleProducts = getInitialVisibleProducts('todos');
    syncCatalogControls();
    displayProducts();
    updateSearchClearButton();
});

clearSearchInput?.addEventListener('click', () => {
    searchInput.value = '';
    currentCategory = 'todos';
    visibleProducts = getInitialVisibleProducts('todos');
    syncCatalogControls();
    displayProducts();
    updateSearchClearButton();
    searchInput.focus();
});

document.getElementById('loadMoreProducts')?.addEventListener('click', () => {
    visibleProducts += PRODUCTS_PAGE_SIZE;
    displayProducts();
});

document.getElementById('collapseProductsBtn')?.addEventListener('click', () => {
    visibleProducts = getInitialVisibleProducts();
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

const valueItems = Array.from(document.querySelectorAll('#servicios .value-item'));
const valueList = document.querySelector('#servicios .value-list');
let valueItemsExpanded = false;
let valueAnimationTimers = [];

function setValueItemsExpanded(expanded) {
    if (!valueItems.length || valueItemsExpanded === expanded) return;

    valueItemsExpanded = expanded;
    valueAnimationTimers.forEach(timer => clearTimeout(timer));
    valueAnimationTimers = [];

    const orderedItems = expanded ? valueItems : [...valueItems].reverse();

    orderedItems.forEach((item, index) => {
        const timer = setTimeout(() => {
            item.classList.toggle('active', expanded);
        }, index * 135);

        valueAnimationTimers.push(timer);
    });
}

if (valueList && 'IntersectionObserver' in window) {
    const valueCardsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            setValueItemsExpanded(entry.isIntersecting && entry.intersectionRatio >= 0.15);
        });
    }, {
        threshold: [0, 0.15, 0.45],
        rootMargin: '-8% 0px -14% 0px'
    });

    valueCardsObserver.observe(valueList);
} else {
    valueItems.forEach(item => item.classList.add('active'));
}


// Infrastructure Slider Logic
const infraTrack = document.querySelector('.carousel-track');
const infraViewport = document.querySelector('.carousel-viewport');
const infraPrev = document.querySelector('.carousel-btn.prev');
const infraNext = document.querySelector('.carousel-btn.next');

let originalItems = [];
let allItems = [];
let activeInfraIndex = 2; // start centered
const cloneCount = 5;
let infraTimer;
let infraWrapResetTimer;

function getRealInfraIndex(index) {
    const total = originalItems.length;
    if (!total) return 0;
    return ((index % total) + total) % total;
}

function getNearestInfraIndex(targetRealIndex) {
    const total = originalItems.length;
    if (total <= 1) return targetRealIndex;

    const currentRealIndex = getRealInfraIndex(activeInfraIndex);
    let step = targetRealIndex - currentRealIndex;

    if (step > total / 2) step -= total;
    if (step < -total / 2) step += total;

    return activeInfraIndex + step;
}

function initInfraCarousel() {
    if (!infraTrack) return;
    
    originalItems = Array.from(infraTrack.querySelectorAll('.carousel-item'));
    if (!originalItems.length) return;
    
    // Clone first N items and append to end
    for (let i = 0; i < cloneCount; i++) {
        const clone = originalItems[i].cloneNode(true);
        clone.classList.add('clone');
        infraTrack.appendChild(clone);
    }
    
    // Clone last N items and prepend to start
    for (let i = originalItems.length - 1; i >= originalItems.length - cloneCount; i--) {
        const clone = originalItems[i].cloneNode(true);
        clone.classList.add('clone');
        infraTrack.insertBefore(clone, infraTrack.firstChild);
    }
    
    // Get list of all items (including clones)
    allItems = Array.from(infraTrack.querySelectorAll('.carousel-item'));
    allItems.forEach(item => {
        item.addEventListener('click', () => focusInfraItem(item));
    });
    
    // Initial position calculation without transition
    setTimeout(() => {
        updateInfraCarousel(false);
    }, 50);
}

function updateInfraCarousel(animate = true) {
    if (!infraTrack || !allItems.length || !infraViewport) return;

    clearTimeout(infraWrapResetTimer);
    
    // Highlight center item
    const activeTrackIndex = activeInfraIndex + cloneCount;
    allItems.forEach((item, index) => {
        item.classList.toggle('active', index === activeTrackIndex);
        item.style.zIndex = index === activeTrackIndex ? '2' : '1';
    });
    
    // Calculate center-align offset
    const activeItem = allItems[activeTrackIndex];
    if (!activeItem) return;
    
    const itemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
    const translateOffset = (infraViewport.offsetWidth / 2) - itemCenter;
    
    // Apply transform with transition
    infraTrack.style.transition = animate ? 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' : 'none';
    infraTrack.style.transform = `translateX(${translateOffset}px)`;

    if (animate && (activeInfraIndex >= originalItems.length || activeInfraIndex < 0)) {
        infraWrapResetTimer = window.setTimeout(normalizeInfraPosition, 680);
    }
}

// Transition End listener for instant reset jumps
infraTrack?.addEventListener('transitionend', (e) => {
    if (e.target !== infraTrack || e.propertyName !== 'transform') return;
    
    normalizeInfraPosition();
});

function normalizeInfraPosition() {
    if (activeInfraIndex < originalItems.length && activeInfraIndex >= 0) return;

    activeInfraIndex = getRealInfraIndex(activeInfraIndex);
    jumpToRealItem();
}

function jumpToRealItem() {
    if (!infraTrack || !allItems.length || !infraViewport) return;

    clearTimeout(infraWrapResetTimer);
    
    infraTrack.style.transition = 'none';
    
    // Re-apply active class to match the new index immediately
    allItems.forEach((item, index) => {
        item.classList.toggle('active', index === activeInfraIndex + cloneCount);
        item.style.zIndex = index === activeInfraIndex + cloneCount ? '2' : '1';
    });
    
    const activeItem = allItems[activeInfraIndex + cloneCount];
    if (!activeItem) return;
    
    const itemCenter = activeItem.offsetLeft + activeItem.offsetWidth / 2;
    const translateOffset = (infraViewport.offsetWidth / 2) - itemCenter;
    infraTrack.style.transform = `translateX(${translateOffset}px)`;
}

// Autoplay logic
function startInfraAutoplay() {
    clearTimeout(infraTimer);
    infraTimer = setTimeout(() => {
        activeInfraIndex++;
        updateInfraCarousel();
        startInfraAutoplay();
    }, 4500);
}

function resetInfraAutoplay() {
    clearTimeout(infraTimer);
    startInfraAutoplay();
}

// Navigation Controls
infraPrev?.addEventListener('click', () => {
    activeInfraIndex--;
    updateInfraCarousel();
    resetInfraAutoplay();
});

infraNext?.addEventListener('click', () => {
    activeInfraIndex++;
    updateInfraCarousel();
    resetInfraAutoplay();
});

// Drag/Swipe Logic
let infraStartX = 0;
let isDraggingInfra = false;
let infraPressedItem = null;

function focusInfraItem(item) {
    if (!item || !allItems.includes(item)) return;

    const targetRealIndex = Number.parseInt(item.dataset.index, 10);
    if (Number.isNaN(targetRealIndex)) return;

    activeInfraIndex = getNearestInfraIndex(targetRealIndex);
    updateInfraCarousel();
    resetInfraAutoplay();
}

infraTrack?.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    clearTimeout(infraTimer); // pause autoplay during drag
    infraStartX = e.clientX;
    isDraggingInfra = true;
    infraPressedItem = e.target.closest('.carousel-item');
    infraTrack.setPointerCapture?.(e.pointerId);
});

infraTrack?.addEventListener('pointerup', (e) => {
    if (!isDraggingInfra) return;
    isDraggingInfra = false;
    infraTrack.releasePointerCapture?.(e.pointerId);
    
    const diffX = e.clientX - infraStartX;
    const wasDragged = Math.abs(diffX) > 25;
    
    if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
            activeInfraIndex--;
        } else {
            activeInfraIndex++;
        }
        updateInfraCarousel();
        startInfraAutoplay(); // resume autoplay
        infraPressedItem = null;
        return;
    }

    if (!wasDragged) {
        focusInfraItem(infraPressedItem);
        infraPressedItem = null;
        return;
    }

    updateInfraCarousel();
    startInfraAutoplay(); // resume autoplay
    infraPressedItem = null;
});

infraTrack?.addEventListener('pointercancel', (e) => {
    isDraggingInfra = false;
    infraPressedItem = null;
    infraTrack.releasePointerCapture?.(e.pointerId);
    updateInfraCarousel();
    startInfraAutoplay(); // resume autoplay
});

window.addEventListener('resize', () => {
    if (!infraTrack) return;
    updateInfraCarousel(false);
});



const reviewCards = document.querySelectorAll('.review-card');
const reviewDots = document.querySelectorAll('.reviews-dots button');
const reviewsTrack = document.querySelector('.reviews-track');
const reviewsPrev = document.querySelector('.reviews-prev');
const reviewsNext = document.querySelector('.reviews-next');
let currentReview = 0;
let reviewsTimer;
let reviewSwipeStartX = 0;
let reviewSwipeStartY = 0;
let isSwipingReviews = false;

function showReview(index) {
    if (!reviewCards.length || !reviewsTrack) return;

    currentReview = (index + reviewCards.length) % reviewCards.length;
    reviewsTrack.style.transform = `translateX(-${currentReview * 100}%)`;

    reviewCards.forEach((card, cardIndex) => {
        card.classList.toggle('active', cardIndex === currentReview);
    });

    reviewDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentReview);
    });
}

function startReviewsTimer() {
    if (reviewCards.length <= 1) return;

    clearTimeout(reviewsTimer);
    reviewsTimer = setTimeout(() => {
        showReview(currentReview + 1);
        startReviewsTimer();
    }, 5200);
}

function moveReview(step) {
    clearTimeout(reviewsTimer);
    showReview(currentReview + step);
    startReviewsTimer();
}

reviewDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearTimeout(reviewsTimer);
        showReview(index);
        startReviewsTimer();
    });
});

reviewsPrev?.addEventListener('click', () => moveReview(-1));
reviewsNext?.addEventListener('click', () => moveReview(1));

reviewsTrack?.addEventListener('pointerdown', event => {
    clearTimeout(reviewsTimer);
    isSwipingReviews = true;
    reviewSwipeStartX = event.clientX;
    reviewSwipeStartY = event.clientY;
    reviewsTrack.setPointerCapture?.(event.pointerId);
});

reviewsTrack?.addEventListener('pointerup', event => {
    if (!isSwipingReviews) return;

    const diffX = event.clientX - reviewSwipeStartX;
    const diffY = event.clientY - reviewSwipeStartY;
    isSwipingReviews = false;
    reviewsTrack.releasePointerCapture?.(event.pointerId);

    if (Math.abs(diffX) > 48 && Math.abs(diffX) > Math.abs(diffY) * 1.25) {
        moveReview(diffX > 0 ? -1 : 1);
    } else {
        startReviewsTimer();
    }
});

reviewsTrack?.addEventListener('pointercancel', event => {
    isSwipingReviews = false;
    reviewsTrack.releasePointerCapture?.(event.pointerId);
    startReviewsTimer();
});

showReview(0);
startReviewsTimer();

// --- MANEJO DEL ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;
        
        questionBtn.addEventListener('click', () => {
            const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';
            
            // Cierra los otros acordeones abiertos para una vista más limpia
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) {
                        otherBtn.setAttribute('aria-expanded', 'false');
                    }
                    otherItem.classList.remove('active');
                }
            });

            questionBtn.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            item.classList.toggle('active', !isExpanded);
        });
    });
}

// Inicializar renderizado al cargar la página
window.onload = () => {
    initCatalog();
    initInfraCarousel();
    updateInfraCarousel();
    startInfraAutoplay();
    initFaq();
};

let contactToastTimer;

function getContactToast() {
    let toast = document.getElementById('contactToast');

    if (toast) return toast;

    toast = document.createElement('div');
    toast.className = 'contact-toast';
    toast.id = 'contactToast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    return toast;
}

function fallbackCopyText(value) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-999px';
    textarea.style.left = '-999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
    } finally {
        textarea.remove();
    }
}

async function copyContactValue(value) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return;
    }

    fallbackCopyText(value);
}

function showContactToast(title, value) {
    const toast = getContactToast();

    toast.innerHTML = `
        <div>
            <strong>${escapeHtml(title)}</strong>
            <span>${escapeHtml(value)}</span>
        </div>
    `;

    clearTimeout(contactToastTimer);
    toast.classList.add('show');
    contactToastTimer = window.setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);
}

document.querySelectorAll('[data-copy-contact]').forEach(link => {
    link.addEventListener('click', async event => {
        event.preventDefault();

        const value = link.dataset.copyContact;
        const label = link.dataset.copyLabel || 'Dato copiado';

        if (!value) return;

        try {
            await copyContactValue(value);
            showContactToast(label, value);
        } catch (error) {
            showContactToast('Dato de contacto', value);
        }

        link.blur();
    });
});


// --- MANEJO DEL FORMULARIO DE WHATSAPP ---
document.getElementById('wppForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Configura aquí el número de la empresa anteponiendo el código de país (52 para México)
    const telefonoEmpresa = "525518336765";

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
