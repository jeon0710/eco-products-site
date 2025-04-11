let products = [];
let categories = new Set();

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();

  products.forEach(p => {
    if (p.category) categories.add(p.category);
  });

  populateCategorySelect();
  renderProducts(products);
}

function getDomainLabel(url) {
  try {
    const host = new URL(url).hostname;
    if (host.includes("naver")) return "[네이버]";
    if (host.includes("coupang")) return "[쿠팡]";
    if (host.includes("smartstore")) return "[스마트스토어]";
    if (host.includes("amazon")) return "[아마존]";
    return "";
  } catch {
    return "";
  }
}

function renderProducts(list) {
  const container = document.getElementById('products');
  container.innerHTML = '';
  list.forEach((product, index) => {
    const domainLabel = getDomainLabel(product.url);
    const delay = 0.2 * index;
    container.innerHTML += `
      <div class="product" style="animation-delay: ${delay}s;">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <a class="buy" href="${product.url}" target="_blank">구매하러 가기</a>
        <span class="domain-tag">${domainLabel}</span>
      </div>
    `;
  });
}

function populateCategorySelect() {
  const select = document.getElementById('categorySelect');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

function filterAndRender() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categorySelect').value;

  const filtered = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(keyword);
    const categoryMatch = selectedCategory === "" || p.category === selectedCategory;
    return nameMatch && categoryMatch;
  });

  renderProducts(filtered);
}

document.getElementById('searchInput').addEventListener('input', filterAndRender);
document.getElementById('categorySelect').addEventListener('change', filterAndRender);

// 🔽 team.html을 섹션에 삽입
fetch('team.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('team').innerHTML = data;
  });

loadProducts();
