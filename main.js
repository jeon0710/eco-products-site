let products = [];

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();
  renderCategoryOptions(products);
  renderProducts(products);
}

function renderCategoryOptions(products) {
  const categories = new Set(products.map(p => p.category));
  const filter = document.getElementById('categoryFilter');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
}

function getSourceLabel(url) {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes('naver')) return '네이버';
    if (hostname.includes('coupang')) return '쿠팡';
    if (hostname.includes('smartstore')) return '스마트스토어';
    if (hostname.includes('gmarket')) return '지마켓';
    if (hostname.includes('11st')) return '11번가';
    return ''; // 표시 안 함
  } catch {
    return '';
  }
}

function renderProducts(list) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';
  list.forEach(product => {
    const source = getSourceLabel(product.url);
    container.innerHTML += `
      <div class="product">
        <div class="product-content">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <a class="buy" href="${product.url}" target="_blank">
            구매하러 가기 ${source ? `<span style="font-weight: normal;">[${source}]</span>` : ''}
          </a>
        </div>
        ${product.image ? `<img src="${product.image}" alt="${product.name}" />` : ''}
      </div>
    `;
  });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  filterAndRender();
});

document.getElementById('categoryFilter').addEventListener('change', () => {
  filterAndRender();
});

function filterAndRender() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;

  const filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(keyword);
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchName && matchCategory;
  });

  renderProducts(filtered);
}

loadProducts();
