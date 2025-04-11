let products = [];
let categories = new Set();

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();

  // 카테고리 추출 및 드롭다운 추가
  categories = new Set(products.map(p => p.category));
  updateCategorySelect();

  renderProducts(products);
}

function updateCategorySelect() {
  const select = document.getElementById('categorySelect');
  select.innerHTML = `<option value="all">전체 카테고리</option>`;
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
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

function filterProducts() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categorySelect').value;

  const filtered = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(keyword);
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
    return nameMatch && categoryMatch;
  });

  renderProducts(filtered);
}

document.getElementById('searchInput').addEventListener('input', filterProducts);
document.getElementById('categorySelect').addEventListener('change', filterProducts);

// team.html을 #team 섹션에 삽입
fetch('team.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('team').innerHTML = data;
  });

loadProducts();
