let products = [];

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();

  // 각 제품에 대한 링크 미리보기 이미지 가져오기
  for (let product of products) {
    const preview = await fetchLinkPreview(product.url);
    product.image = preview?.image || null;
  }

  renderProducts(products);
}

async function fetchLinkPreview(link) {
  const apiKey = '여기에_API_KEY_입력'; // LinkPreview API 키 입력

  try {
    const response = await fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(link)}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('미리보기 로딩 오류:', err);
    return null;
  }
}

function renderProducts(list) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';

  list.forEach(product => {
    container.innerHTML += `
      <div class="product">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="flex: 1;">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <a class="buy" href="${product.url}" target="_blank">구매하러 가기</a>
          </div>
          <div>
            ${product.image ? `<img src="${product.image}" alt="미리보기" style="width: 120px; border-radius: 8px;" />` : ''}
          </div>
        </div>
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
