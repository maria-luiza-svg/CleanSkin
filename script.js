// Produtos cadastrados na loja.
const products = [
    {
        id: 1,
        name: "Sérum Facial Vitamina C Glow",
        category: "seruns",
        categoryName: "Sérum",
        price: 291.90
    },
    {
        id: 2,
        name: "Sérum Facial Fat Water",
        category: "seruns",
        categoryName: "Sérum",
        price: 129.90
    },
    {
        id: 3,
        name: "Hidratante Instant Reset",
        category: "hidratantes", // Ajustado de "Hidratantes" para "hidratantes"
        categoryName: "Hidratante",
        price: 377.00
    },
    {
        id: 4,
        name: "Hidratante Facial Hydration Face",
        category: "hidratantes", // Ajustado de "Hidratantes" para "hidratantes"
        categoryName: "Hidratante",
        price: 259.00
    },
    {
        id: 5,
        name: "Protetor Solar Facial FPS 30",
        category: "protecao", // Ajustado de "Proteção Solar" para "protecao"
        categoryName: "Proteção Solar",
        price: 313.00
    },
    {
        id: 6,
        name: "Protetor Solar Facial Hydra Vizor",
        category: "protecao", // Ajustado de "Proteção Solar" para "protecao"
        categoryName: "Proteção Solar",
        price: 313.00
    },
    {
        id: 7,
        name: "Gel de Limpeza Cherry Dub Cleanser",
        category: "limpeza",
        categoryName: "Limpeza",
        price: 280.00
    },
    {
        id: 8,
        name: "Gel de Limpeza Remove-it-All",
        category: "limpeza",
        categoryName: "Limpeza",
        price: 118.00
    }
];

let cart = [];
let currentCategory = 'todos';


// Mostra ou esconde os produtos que já estão no HTML
function renderProducts(itemsToRender) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const id = Number(card.dataset.id);
        const productExists = itemsToRender.some(product => product.id === id);

        if (productExists) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Troca a categoria
function switchCategory(category, element) {

    currentCategory = category;
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.menu-link')
        .forEach(link => link.classList.remove('active'));

    if (element) {
        element.classList.add('active');
    } else {
        const activeLink = document.getElementById(`link-${category}`);

        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    const titles = {
        todos: "Todos os Produtos",
        seruns: "Séruns Faciais",
        hidratantes: "Hidratantes & Cremes",
        protecao: "Protetores Solares",
        limpeza: "Gel e Espumas de Limpeza"
    };

    document.getElementById('categoryTitle').innerText =
        titles[category] || "Produtos";
    const filtered =
        category === 'todos'
            ? products
            : products.filter(product => product.category === category);

    renderProducts(filtered);
}
// Pesquisa produtos
function filterProducts() {
    const searchTerm =
        document.getElementById('searchInput')
        .value
        .toLowerCase();

    const filtered = products.filter(product =>

        (currentCategory === 'todos' ||
            product.category === currentCategory)

        &&
        (
            product.name.toLowerCase().includes(searchTerm) ||
            product.categoryName.toLowerCase().includes(searchTerm)
        )
    );

    renderProducts(filtered);
}


// Adiciona produto ao carrinho
function addToCart(productId) {
    const product = products.find(
        product => product.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    // Pega a imagem diretamente do HTML
    const productCard =
        document.querySelector(`.product-card[data-id="${productId}"]`);
    const productImage =
        productCard.querySelector('.product-img').src;

    if (existingItem) {
        existingItem.quantity += 1;

    } else {
        cart.push({
            ...product,
            img: productImage,
            quantity: 1
        });
    }

    updateCart();

    showToast(`${product.name} adicionado!`);
}


// Altera quantidade
function changeQuantity(id, change) {

    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    updateCart();
}


// Atualiza o carrinho
function updateCart() {

    const cartItemsContainer =
        document.getElementById('cartItemsContainer');
    const cartBadge =
        document.getElementById('cartBadge');
    const cartTotalValue =
        document.getElementById('cartTotalValue');
    cartItemsContainer.innerHTML = '';
    const totalQty = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );
    cartBadge.innerText = totalQty;
    cartTotalValue.innerText =
        `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

    if (cart.length === 0) {

        cartItemsContainer.innerHTML =
            '<p class="empty-cart-msg">Sua sacola está vazia.</p>';

        return;
    }

    cart.forEach(item => {

        const itemEl = document.createElement('div');

        itemEl.className = 'cart-item';

        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}">

            <div class="cart-item-details">

                <div class="cart-item-title">
                    ${item.name}
                </div>

                <div class="cart-item-price">
                    R$ ${item.price.toFixed(2).replace('.', ',')}
                </div>

                <div class="cart-item-qty">

                    <button
                        class="qty-btn"
                        onclick="changeQuantity(${item.id}, -1)">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        class="qty-btn"
                        onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>

            </div>
        `;

        cartItemsContainer.appendChild(itemEl);
    });
}


// Abre ou fecha o carrinho
function toggleCart() {

    const drawer =
        document.getElementById('cartDrawer');
    const overlay =
        document.getElementById('cartOverlay');
    const isOpen =
        drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        overlay.style.display = 'none';

    } else {
        drawer.classList.add('open');
        overlay.style.display = 'block';
    }
}


// Finaliza compra
function checkout() {

    if (cart.length === 0) {

        alert(
            'Adicione ao menos um produto antes de finalizar a compra.'
        );

        return;
    }

    alert(
        'Pedido realizado com sucesso! Obrigado por comprar na Clean Skin.'
    );

    cart = [];
    updateCart();
    toggleCart();
}


// Notificação
function showToast(message) {

    const toast =
        document.getElementById('toastNotification');
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

// Exibe todos os produtos inicialmente
renderProducts(products);
