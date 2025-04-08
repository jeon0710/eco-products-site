let products = [];

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();
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
  list.forEach(product => {
    const domainLabel = getDomainLabel(product.url);
    container.innerHTML += `
      <div class="product">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <a class="buy" href="${product.url}" target="_blank">구매하러 가기</a>
        <span class="domain-tag">${domainLabel}</span>
      </div>
    `;
  });
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  renderProducts(filtered);
});

loadProducts();

// 🟢 주소에 따라 iframe 표시 여부 제어
window.addEventListener('hashchange', () => {
  const teamSection = document.getElementById('team');
  const productSection = document.getElementById('products');

  if (location.hash === '#team') {
    teamSection.style.display = 'block';
    productSection.style.display = 'none';
  } else {
    teamSection.style.display = 'none';
    productSection.style.display = 'block';
  }
});

// 첫 로딩 시 해시 처리
if (location.hash === '#team') {
  document.getElementById('team').style.display = 'block';
  document.getElementById('products').style.display = 'none';
}
