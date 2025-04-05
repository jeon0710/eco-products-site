let products = [];

async function loadProducts() {
  const res = await fetch('products.json');
  products = await res.json();
  renderProducts(products);
}

function getSourceLabel(url) {
  const domain = new URL(url).hostname;
  if (domain.includes("naver")) return "[네이버]";
  if (domain.includes("coupang")) return "[쿠팡]";
  if (domain.includes("11st")) return "[11번가]";
  if (domain.includes("gmarket")) return "[지마켓]";
  return "";
}

function renderProducts(list) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';
  list.forEach(product => {
    const sourceLabel = getSourceLabel(product.url);
    container.innerHTML += `
      <div class="product">
        <img src="${product.image || 'https://via.placeholder.com/80'}" alt="${product.name}">
        <div class="product-details">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <a class="buy" href="${product.url}" target="_blank">구매하러 가기</a>
          <span class="source-label">${sourceLabel}</span>
        </div>
      </div>
    `;
  });
}

document.getElementById('searchInput').addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  renderProducts(filtered);
});

document.querySelectorAll('#categoryFilter button').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    const filtered = category === '전체' ? products : products.filter(p => p.category === category);
    renderProducts(filtered);
  });
});

loadProducts();
