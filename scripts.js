// scripts.js 文件

const translations = {
    "en": {
        "category_elytra": "ElytraSky-Kits",
        "cart": "Cart",
        "add_to_cart": "Add to Cart",
        "game_id": "Game ID:",
        "enter_game_id": "Enter your game ID",
        "empty_cart": "The cart is empty",
        "confirm_clear": "Are you sure you want to clear the cart?",
        "cart_cleared": "Cart Cleared.",
        "enter_game_id_prompt": "Please Enter your Game ID!",
        "cart_empty": "The Cart is Empty!",
        "code_copied": "Invoice Code has been copied to clipboard",
        "code_generated": "Invoice Code has been generated,please enter manually",
        "item_removed": "Removed",
        "item_added": "Added to the cart"
    },
    "zh-CN": {
        "category_elytra": "ElytraSky-Kits",
        "cart": "购物车",
        "add_to_cart": "加入购物车",
        "game_id": "游戏ID:",
        "enter_game_id": "请输入您的游戏ID",
        "empty_cart": "购物车为空",
        "confirm_clear": "确定要清空购物车吗？",
        "cart_cleared": "购物车已清空",
        "enter_game_id_prompt": "请输入您的游戏ID！",
        "cart_empty": "购物车为空！",
        "code_copied": "订单代码已复制到剪贴板",
        "code_generated": "订单代码已生成，请手动输入",
        "item_removed": "已移除",
        "item_added": "已添加到购物车"
    },
    "zh-TW": {
        "category_elytra": "ElytraSky-Kits",
        "add_to_cart": "加入購物車",
        "cart": "購物車",
        "game_id": "遊戲ID:",
        "enter_game_id": "請輸入您的遊戲ID",
        "empty_cart": "購物車為空",
        "confirm_clear": "確定要清空購物車嗎？",
        "cart_cleared": "購物車已清空",
        "enter_game_id_prompt": "請輸入您的遊戲ID！",
        "cart_empty": "購物車為空！",
        "code_copied": "訂單代碼已複製到剪貼板",
        "code_generated": "訂單代碼已生成，請手動輸入",
        "item_removed": "已移除",
        "item_added": "已添加到購物車"
    }
};

// 全局变量
let cart = [];
let totalPrice = 0;
let currentCurrency = "CNY";

// 显示提示信息
function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 设置语言
function setLanguage(lang) {
    const dict = translations[lang] || translations["zh-TW"];
    
    // 更新所有带data-i18n属性的元素
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });
    
    // 更新按钮文本
    document.querySelectorAll("[data-i18n-btn]").forEach(btn => {
        const key = btn.getAttribute("data-i18n-btn");
        if (dict[key]) btn.textContent = dict[key];
    });
    
    // 更新输入框placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(input => {
        const key = input.getAttribute("data-i18n-placeholder");
        if (dict[key]) input.placeholder = dict[key];
    });
    
    // 更新导航栏中的多语言文本
    document.querySelectorAll('.nav-links a').forEach(link => {
        const spans = link.querySelectorAll('span[data-lang]');
        spans.forEach(span => {
            if (span.getAttribute('data-lang') === lang) {
                span.style.display = 'inline';
            } else {
                span.style.display = 'none';
            }
        });
    });
    
    // 更新HTML lang属性
    document.documentElement.setAttribute("lang", lang);
    
    // 保存语言设置
    localStorage.setItem("selectedLang", lang);
}

// 初始化语言选择器
function initLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;
    
    // 设置初始值
    const savedLang = localStorage.getItem("selectedLang") || "zh-TW";
    languageSelect.value = savedLang;
    setLanguage(savedLang);
    
    // 绑定change事件
    languageSelect.addEventListener('change', function(e) {
        const lang = e.target.value;
        setLanguage(lang);
    });
}

// 初始化关于模态框
function initAboutModal() {
    const aboutBtn = document.getElementById('aboutBtn');
    const closeAboutBtn = document.getElementById('closeAboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    
    if (!aboutBtn || !closeAboutBtn || !aboutModal) return;
    
    aboutBtn.addEventListener('click', () => {
        aboutModal.style.display = "flex";
        setTimeout(() => aboutModal.classList.add("show"), 10);
    });
    
    closeAboutBtn.addEventListener('click', () => {
        aboutModal.classList.remove("show");
        setTimeout(() => { aboutModal.style.display = "none"; }, 300);
    });
    
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove("show");
            setTimeout(() => { aboutModal.style.display = "none"; }, 300);
        }
    });
}

// 购物车功能
function createPlusOneAnimation(button) {
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = '+1';
    
    const productCard = button.closest('.product');
    productCard.appendChild(plusOne);
    
    setTimeout(() => {
        plusOne.remove();
    }, 1000);
}

function addToCart(id, name, price, button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 1000);
    
    createPlusOneAnimation(button);
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), quantity: 1 });
    }
    
    totalPrice += parseFloat(price);
    updateCart();
    showToast(`Added ${name} to the cart`);
}

function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    
    if (!cartItemsElement || !totalPriceElement || !cartCountElement) return;
    
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p style="text-align:center;padding:20px 0;">The cart is empty</p>';
        const codeOutput = document.getElementById('code-output');
        if (codeOutput) codeOutput.style.display = 'none';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">¥${item.price.toFixed(2)} × ${item.quantity} = ¥${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-index="${index}">移除</button>
            `;
            cartItemsElement.appendChild(itemElement);
        });
        
        // 使用事件委托处理动态生成的按钮
        cartItemsElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('minus')) {
                const index = e.target.getAttribute('data-index');
                updateQuantity(index, -1);
            } else if (e.target.classList.contains('plus')) {
                const index = e.target.getAttribute('data-index');
                updateQuantity(index, 1);
            } else if (e.target.classList.contains('remove-btn')) {
                const index = e.target.getAttribute('data-index');
                removeItem(index);
            }
        });
    }
    
    totalPriceElement.textContent = totalPrice.toFixed(2);
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateQuantity(index, change) {
    const item = cart[index];
    if (item.quantity + change < 1) return;
    
    item.quantity += change;
    totalPrice += item.price * change;
    updateCart();
}

function removeItem(index) {
    const item = cart[index];
    totalPrice -= item.price * item.quantity;
    cart.splice(index, 1);
    updateCart();
    showToast(`Removed ${item.name}`);
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        totalPrice = 0;
        updateCart();
        showToast('Cart Cleared.');
    }
}

function generateOrderCode() {
    if (cart.length === 0) {
        showToast('The Cart is Empty!');
        return;
    }
    
    const usernameInput = document.getElementById('username');
    if (!usernameInput) return;
    
    const username = usernameInput.value.trim();
    if (!username) {
        showToast('Please Enter your Game ID!');
        return;
    }
    
    const order = {
        date: new Date().toISOString(),
        username: username,
        items: cart,
        total: totalPrice
    };
    
    const orderString = JSON.stringify(order);
    const orderCode = btoa(unescape(encodeURIComponent(orderString)));

    const codeOutput = document.getElementById('code-output');
    if (codeOutput) {
        codeOutput.textContent = orderCode;
        codeOutput.style.display = 'block';
    }
    
    navigator.clipboard.writeText(orderCode)
        .then(() => {
            showToast('Invoice Code has been copied to clipboard');
        })
        .catch(err => {
            console.error('Failed:', err);
            showToast('Invoice Code has been generated,please enter manually');
        });
}

// 初始化购物车
function initCart() {
    const cartToggle = document.getElementById('cart-toggle');
    const generateCodeBtn = document.getElementById('generate-code');
    const clearCartBtn = document.getElementById('clear-cart');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            const cartContainer = document.getElementById('cart-container');
            if (cartContainer) cartContainer.classList.toggle('expanded');
        });
    }
    
    if (generateCodeBtn) {
        generateCodeBtn.addEventListener('click', generateOrderCode);
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    updateCart();
}

// 货币转换功能
const exchangeRates = {'CNY': 1.0, 'USD': 0.14, 'EUR': 0.13, 'SGD': 0.19};
const currencySymbols = {'CNY': '¥', 'USD': '$', 'EUR': '€', 'SGD': 'S$'};

function initCurrencySelector() {
    const currencySelect = document.getElementById('currency-select');
    if (!currencySelect) return;
    
    currencySelect.addEventListener('change', function() {
        const selected = this.value;
        convertPrices(selected);
    });
}

function convertPrices(newCurrency) {
    const priceElements = document.querySelectorAll('.product-price');
    priceElements.forEach(el => {
        const basePrice = parseFloat(el.getAttribute('data-base-price') || el.textContent.replace(/[^\d.]/g, ''));
        const converted = basePrice * exchangeRates[newCurrency];
        el.textContent = currencySymbols[newCurrency] + converted.toFixed(2);
        el.setAttribute('data-base-price', basePrice);
    });
    currentCurrency = newCurrency;
}

// 初始化添加到购物车按钮
function initAddToCartButtons() {
    // 使用事件委托处理动态加载的按钮
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = e.target.getAttribute('data-price');
            addToCart(id, name, price, e.target);
        }
    });
}

// 加载外部HTML内容
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById(elementId);
            if (!container) return;
            
            container.innerHTML = data;
            
            // 重新初始化相关功能
            if (filePath === 'navbar.html') {
                initLanguageSelector();
                initAboutModal();
            }
            
            if (filePath === 'products.html') {
                // 产品加载后初始化价格
                convertPrices(currentCurrency);
            }
            
            if (filePath === 'cart.html') {
                initCart();
            }
            
            if (filePath === 'footer.html') {
                initCurrencySelector();
            }
        })
        .catch(error => {
            console.error('Error loading ' + filePath + ':', error);
        });
}

// 主初始化函数
function initApp() {
    // 初始化核心功能
    initLanguageSelector();
    initAddToCartButtons();
    initCurrencySelector();
    
    // 加载所有部分
    const sections = [
        { id: 'header-container', file: 'header.html' },
        { id: 'navbar-container', file: 'navbar.html' },
        { id: 'products-container', file: 'products.html' },
        { id: 'cart-container-full', file: 'cart.html' },
        { id: 'footer-container', file: 'footer.html' },
        { id: 'about-modal-container', file: 'about-modal.html' }
    ];
    
    sections.forEach(section => {
        loadHTML(section.id, section.file);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

