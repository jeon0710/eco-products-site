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

// 🟢 team.html의 .team-section 부분을 불러오는 함수
async function loadTeamSection() {
  try {
    const response = await fetch('team.html');
    const htmlText = await response.text();

    // .team-section만 추출
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const teamContent = doc.querySelector('.team-section');

    const teamSection = document.getElementById('team');
    if (teamContent && teamSection) {
      teamSection.innerHTML = teamContent.innerHTML;
    }
  } catch (error) {
    console.error('팀 섹션 로드 실패:', error);
  }
}

// #team으로 이동할 때만 섹션 로딩 및 표시
window.addEventListener('hashchange', () => {
  if (location.hash === '#team') {
    const teamSection = document.getElementById('team');
    if (teamSection.innerHTML.trim() === '') {
      loadTeamSection();
    }
    teamSection.style.display = 'block';
  } else {
    document.getElementById('team').style.display = 'none';
  }
});

// 페이지 처음 로드할 때도 처리
if (location.hash === '#team') {
  loadTeamSection().then(() => {
    document.getElementById('team').style.display = 'block';
  });
}
