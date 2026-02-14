// 购物车数据
let cart = [];
let products = [];

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 加载商品数据
        await loadProducts();
        // 渲染商品列表
        renderProducts();
        // 更新购物车显示
        updateCartDisplay();
    } catch (error) {
        console.error('初始化页面时出错:', error);
        // 如果无法加载外部文件，则使用默认商品数据
        products = [
            { name: 'iPhone 13', price: 5999 },
            { name: 'MacBook Pro', price: 12999 },
            { name: 'iPad Air', price: 4399 },
            { name: 'Apple Watch', price: 2999 },
            { name: 'AirPods Pro', price: 1999 },
            { name: 'Samsung Galaxy', price: 4999 },
            { name: 'Dell XPS', price: 8999 },
            { name: 'Sony WH-1000XM4', price: 2299 }
        ];
        renderProducts();
        updateCartDisplay();
    }
});

// 从shop.txt加载商品数据
async function loadProducts() {
    const response = await fetch('shop.txt');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    parseProductData(text);
}

// 解析商品数据
function parseProductData(text) {
    products = [];
    const lines = text.trim().split('\n');
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine) {
            // 假设每行格式为 "商品名称,价格" 或 "商品名称:价格"
            const separator = trimmedLine.includes(',') ? ',' : ':';
            const parts = trimmedLine.split(separator);
            
            if (parts.length >= 2) {
                const name = parts[0].trim();
                const priceStr = parts[1].trim();
                
                // 尝试提取价格（可能包含¥符号）
                const priceMatch = priceStr.match(/[\d,.]+/);
                if (priceMatch) {
                    const price = parseFloat(priceMatch[0].replace(/,/g, ''));
                    if (!isNaN(price)) {
                        products.push({ name, price });
                    }
                }
            }
        }
    }
}

// 渲染商品列表
function renderProducts() {
    const container = document.getElementById('product-container');
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/200x200?text=${encodeURIComponent(product.name)}" alt="${product.name}">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">¥${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${index})">加入购物车</button>
        `;
        
        container.appendChild(productCard);
    });
}

// 添加到购物车
function addToCart(index) {
    const product = products[index];
    
    // 检查购物车中是否已存在该商品
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // 视觉反馈
    const btn = event.target;
    btn.textContent = '已添加!';
    btn.style.backgroundColor = '#27ae60';
    setTimeout(() => {
        btn.textContent = '加入购物车';
        btn.style.backgroundColor = '#3498db';
    }, 1000);
}

// 更新购物车显示
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('cart-count').textContent = `购物车: ${totalItems}`;
    document.getElementById('total-price').textContent = `总计: ¥${totalPrice.toFixed(2)}`;
}

// 重新加载商品数据
function refreshProducts() {
    loadProducts()
        .then(renderProducts)
        .catch(error => {
            console.error('刷新商品数据时出错:', error);
        });
}