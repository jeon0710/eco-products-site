let products = [];

async function loadProducts() {
  const response = await fetch('products.json');
  products = await response.json();

  // 각 제품에 대해 미리보기 이미지 불러오기
  for (let product of products) {
    const preview = await fetchLinkPreview(product.url);
    product.image = preview?.image || null;
  }

  renderProducts(products);
}

async function fetchLinkPreview(link) {
  const apiKey = '여기에_본인의_API_키_입력'; // LinkPreview API 키 필요

  try {
    const response = await fetch(`https://api.linkpreview.net/?key=${apiKey}&q=${encodeURIComponent(link)}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('링크 미리보기를 가져오는 중 오류:', err);
    return null;
  }
}

function renderProducts(list) {
  const container = document.getElementById('productContainer');
  container.innerHTML = '';
  list.forEach(product => {
    container.innerHTML += `
      <div class="product">
        <h2>${product.name}</h2>
        ${product.image ? `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; border-radius: 6px;" />` : ''}
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
