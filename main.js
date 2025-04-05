let products = [];
let filteredCategory = "all";

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();

  for (let product of products) {
    const preview = await fetchLinkPreview(product.url);
    product.image = preview?.image || null;
  }

  renderCategoryOptions();
  renderProducts(products);
}

async function fetchLinkPreview(link) {
  const apiKey = '여기에_API_KEY_입력'; // LinkPreview API 키
  try {
    const response = await fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(link)}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('미리보기 오류:', err);
    return null;
  }
}

function renderCategoryOptions() {
  const categorySet = new Set(products.map(p => p.category));
  const select = document.getElementById('categoryFilter');
  categorySet.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    filteredCategory = e.target.value;
    filterAndRender();
  });
}

function renderProducts(list) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';

  list.forEach(product => {
    const html = `
      <div class="product">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="flex: 1;">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <a class="buy" href="${product.url}" target="_blank">구매하러 가기</a>
          </div>
          <div>
            ${product.image ? `<img src="${product.image}" alt="미리보기">` : ''}
          </div>
        </div>
      </div>
    `;
    container.innerHTML += html;
  });
}

function filterAndRender() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  let filtered = products.filter(p => p.name.toLowerCase().includes(keyword));

  if (filteredCategory !== 'all') {
    filtered = filtered.filter(p => p.category === filteredCategory);
  }

  renderProducts(filtered);
}

document.getElementById('searchInput').addEventListener('input', filterAndRender);

loadProducts();
