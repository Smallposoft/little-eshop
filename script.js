let products = [];

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 加载商品数据
        await loadProducts();
        // 渲染商品列表
        renderProducts();
    } catch (error) {
        console.error('初始化页面时出错:', error);
        // 如果无法加载外部文件，则使用默认商品数据
        products = [
            { name: 'iPhone 13', price: 5999, description: '苹果公司推出的智能手机，搭载A15仿生芯片，拥有出色的摄影能力和续航表现。' },
            { name: 'MacBook Pro', price: 12999, description: '专业级笔记本电脑，配备M系列芯片，适合设计师和开发者的高性能需求。' },
            { name: 'iPad Air', price: 4399, description: '轻薄便携的平板电脑，性能强劲，适合娱乐和轻度办公使用。' },
            { name: 'Apple Watch', price: 2999, description: '智能手表，支持健康监测、运动追踪等多种功能，与iPhone完美配合。' },
            { name: 'AirPods Pro', price: 1999, description: '无线降噪耳机，提供主动降噪和通透模式，音质出色。' },
            { name: 'Samsung Galaxy', price: 4999, description: '三星旗舰手机，拥有优秀的屏幕显示效果和拍照性能。' },
            { name: 'Dell XPS', price: 8999, description: '戴尔高端笔记本电脑，超窄边框设计，性能卓越，适合商务人士。' },
            { name: 'Sony WH-1000XM4', price: 2299, description: '索尼降噪耳机，业界领先的降噪技术，佩戴舒适，音质出众。' }
        ];
        renderProducts();
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
            // 假设每行格式为 "商品名称,价格,描述"
            const parts = trimmedLine.split(',');
            
            if (parts.length >= 3) {
                const name = parts[0].trim();
                const priceStr = parts[1].trim();
                const description = parts[2].trim();

                // 尝试提取价格（可能包含¥符号）
                const priceMatch = priceStr.match(/[\d,.]+/);
                if (priceMatch) {
                    const price = parseFloat(priceMatch[0].replace(/,/g, ''));
                    if (!isNaN(price)) {
                        products.push({ name, price, description });
                    }
                }
            } else if (parts.length >= 2) {
                // 处理没有描述的情况
                const name = parts[0].trim();
                const priceStr = parts[1].trim();

                const priceMatch = priceStr.match(/[\d,.]+/);
                if (priceMatch) {
                    const price = parseFloat(priceMatch[0].replace(/,/g, ''));
                    if (!isNaN(price)) {
                        products.push({ name, price, description: '暂无详细描述' });
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
        productCard.onclick = () => showProductDetails(index);

        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/200x200?text=${encodeURIComponent(product.name)}" alt="${product.name}">
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">¥${product.price.toFixed(2)}</div>
        `;

        container.appendChild(productCard);
    });
}

// 显示商品详情
function showProductDetails(index) {
    const product = products[index];
    
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `价格: ¥${product.price.toFixed(2)}`;
    document.getElementById('modal-product-description').textContent = product.description;
    
    document.getElementById('product-modal').style.display = 'block';
}

// 隐藏商品详情模态框
function hideProductDetails() {
    document.getElementById('product-modal').style.display = 'none';
}

// 设置主题切换
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
    
    // 关闭模态框的事件监听器
    document.querySelector('.close').addEventListener('click', hideProductDetails);
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('product-modal');
        if (event.target === modal) {
            hideProductDetails();
        }
    });
}

// 应用主题
function applyTheme(themeName) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (themeName === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.add('light-theme');
    }
}

// 页面加载完成后设置主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
});