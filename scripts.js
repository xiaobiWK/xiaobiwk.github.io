const translations = {
    "en": {
        "category_elytra": "ElytraSky-Kits",
        "cart": "Cart",
        "add_to_cart": "Add to Cart",
        "game_id": "Game ID:",
        "enter_game_id": "Enter your game ID"
    },
    "zh-CN": {
        "category_elytra": "ElytraSky-Kits",
        "cart": "购物车",
        "add_to_cart": "加入购物车",
        "game_id": "游戏ID:",
        "enter_game_id": "请输入您的游戏ID"
    },
    "zh-TW": {
        "category_elytra": "ElytraSky-Kits",
        "cart": "購物車",
        "add极_to_cart": "加入購物車",
        "game_id": "遊戲ID:",
        "enter_game_id": "請輸入您的遊戲ID"
    }
};

function setLanguage(lang) {
    const dict = translations[lang] || translations["zh-TW"];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-btn]").forEach(btn => {
        const key = btn.getAttribute("data-i18n-btn");
        if (dict[key]) btn.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(input => {
        const key = input.getAttribute("data-i18n-placeholder");
        if (dict[key]) input.placeholder = dict[key];
    });
}

// scripts.js 文件（续）

document.getElementById("language-select").addEventListener("change", e => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("selectedLang", lang);
    document.documentElement.setAttribute("lang", lang);
});

document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("selectedLang") || "zh-TW";
    document.getElementById("language-select").value = savedLang;
    setLanguage(savedLang);
    document.documentElement.setAttribute("lang", savedLang);
});

// 购物车功能
let cart = [];
let totalPrice = 0;
const toast = document.getElementById('toast');

// 显示提示信息
function showToast(message, duration = 2000) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// 创建跳跃的+1动画
function createPlusOneAnimation(button) {
    const plusOne = document.createElement('div');
    plusOne.className = 'plus-one';
    plusOne.textContent = '+1';
    
    const productCard = button.closest('.product');
    productCard.appendChild(plusOne);
    
    // 动画结束后移除元素
    setTimeout(() => {
        plusOne.remove();
    }, 1000);
}

// 初始化购物车
function initCart() {
    updateCart();
    
    // 购物车展开/折叠
    document.getElementById('cart-toggle').addEventListener('click', () => {
        document.getElementById('cart-container').classList.toggle('expanded');
    });
    
    // 生成订单代码
    document.getElementById('generate-code').addEventListener('click', generateOrderCode);
    
    // 清空购物车
    document.getElementById('clear-cart').addEventListener('click', clearCart);
}

// 添加商品到购物车
function addToCart(id, name, price, button) {
    // 添加点击效果
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 1000);
    
    // 创建跳跃的+1动画
    createPlusOneAnimation(button);
    
    // 检查是否已经在购物车中
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

// 更新购物车显示
function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCountElement = document.getElementById('cart-count');
    
    cartItemsElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p style="text-align:center;padding:20px 0;">The cart is empty</p>';
        document.getElementById('code-output').style.display = 'none';
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
        
        // 为数量按钮添加事件
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                updateQuantity(index, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                updateQuantity(index, 1);
            });
        });
        
        // 为移除按钮添加事件
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeItem(index);
            });
        });
    }
    
    totalPriceElement.textContent = totalPrice.toFixed(2);
    cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// 更新商品数量
function updateQuantity(index, change) {
    const item = cart[index];
    if (item.quantity + change < 1) return;
    
    item.quantity += change;
    totalPrice += item.price * change;
    updateCart();
}

// 移除商品
function removeItem(index) {
    const item = cart[index];
    totalPrice -= item.price * item.quantity;
    cart.splice(index, 1);
    updateCart();
    showToast(`Removed ${item.name}`);
}

// 清空购物车
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        totalPrice = 0;
        updateCart();
        showToast('Cart Cleared.');
    }
}

// 生成订单代码
function generateOrderCode() {
    if (cart.length === 0) {
        showToast('The Cart is Empty!');
        return;
    }
    
    const username = document.getElementById('username').value.trim();
    if (!username) {
        showToast('Please Enter your Game ID!');
        return;
    }
    
    // 创建订单对象
    const order = {
        date: new Date().toISOString(),
        username: username,
        items: cart,
        total: totalPrice
    };
    
    // 转换为Base64编码字符串
    // Encode to Base64 with UTF-8 support
    const orderString = JSON.stringify(order);
    const orderCode = btoa(unescape(encodeURIComponent(orderString)));

    
    // 显示代码
    const codeOutput = document.getElementById('code-output');
    codeOutput.textContent = orderCode;
    codeOutput.style.display = 'block';
    
    // 自动复制到剪贴板
    navigator.clipboard.writeText(orderCode)
        .then(() => {
            showToast('Invoice Code has been copied to clipboard');
        })
        .catch(err => {
            console.error('Failed:', err);
            showToast('Invoice Code has been generated,please enter manually');
        });
}

// 货币转换功能
const exchangeRates = {'CNY': 1.0, 'USD': 0.14, 'EUR': 0.13, 'SGD': 0.19};
const currencySymbols = {'CNY': '¥', 'USD': '$', 'EUR': '€', 'SGD': 'S$'};
const defaultCurrency = "CNY";
let currentCurrency = defaultCurrency;

document.getElementById('currency-select').addEventListener('change', function () {
    const selected = this.value;
    convertPrices(selected);
});

function convertPrices(newCurrency) {
    const priceElements = document.querySelectorAll('.product-price');
    priceElements.forEach(el => {
        const basePrice = parseFloat(el.getAttribute('data-base-price') || el.textContent.replace('¥', ''));
        const converted = basePrice * exchangeRates[newCurrency];
        el.textContent = currencySymbols[newCurrency] + converted.toFixed(2);
        el.setAttribute('data-base-price', basePrice);
    });
    currentCurrency = newCurrency;
}

// 关于模态框功能
const aboutModal = document.getElementById("aboutModal");
const aboutBtn = document.getElementById("aboutBtn");
const closeAboutBtn = document.getElementById("closeAboutBtn");

aboutBtn.addEventListener("click", () => {
    aboutModal.style.display = "flex";
    setTimeout(() => aboutModal.classList.add("show"), 10);
});
closeAboutBtn.addEventListener("click", () => {
    aboutModal.classList.remove("show");
    setTimeout(() => { aboutModal.style.display = "none"; }, 300);
});
aboutModal.addEventListener("click", (e) => {
    if (e.target === aboutModal) {
        closeAboutBtn.click();
    }
});

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    
    // 为所有加入购物车按钮添加事件
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            addToCart(id, name, price, button);
        });
    });
    
    // 初始化货币
    convertPrices(defaultCurrency);
    
    // 延迟执行，确保所有元素已加载
    setTimeout(() => {
        setLanguage(document.getElementById("language-select").value);
    }, 100);
});

// 加载外部HTML内容
function loadHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            // 重新初始化相关功能
            if (filePath === 'navbar.html') {
                document.getElementById("language-select").addEventListener("change", e => {
                    const lang = e.target.value;
                    setLanguage(lang);
                    localStorage.setItem("selectedLang", lang);
                    document.documentElement.setAttribute("lang", lang);
                });
                
                document.getElementById("aboutBtn").addEventListener("click", () => {
                    aboutModal.style.display = "flex";
                    setTimeout(() => aboutModal.classList.add("show"), 10);
                });
            }
            
            if (filePath === 'products.html') {
                // 重新绑定添加到购物车按钮
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const id = button.getAttribute('data-id');
                        const name = button.getAttribute('data-name');
                        const price = button.getAttribute('data-price');
                        addToCart(id, name, price, button);
                    });
                });
            }
            
            if (filePath === 'cart.html') {
                // 重新绑定购物车功能
                initCart();
            }
        })
        .catch(error => {
            console.error('Error loading ' + filePath + ':', error);
        });
}