// main.js
let products = [];

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();
  renderProducts(products);
}

function renderProducts(list) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';
  list.forEach(product => {
    container.innerHTML += `
      <div class="product">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <a class="buy" href="${product.url}" target="_blank">구매하러 가기</a>
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
