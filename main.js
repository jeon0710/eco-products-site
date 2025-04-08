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
  if (!container) return;
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

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
      renderProducts(filtered);
    });
  }

  // team 섹션 해시 감지 및 로딩
  if (window.location.hash === "#team") {
    loadTeamSection();
  }

  document.querySelectorAll('a[href="#team"]').forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      history.pushState(null, "", "#team");
      loadTeamSection();
    });
  });
});

function loadTeamSection() {
  fetch("team.html")
    .then(res => res.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const teamContent = doc.querySelector(".team-section");
      const teamSection = document.getElementById("team");

      if (teamContent && teamSection) {
        teamSection.innerHTML = teamContent.innerHTML;
        teamSection.style.display = "block";
        window.scrollTo({ top: teamSection.offsetTop, behavior: "smooth" });
      }
    })
    .catch(err => {
      console.error("팀 섹션을 불러오는 데 실패했습니다:", err);
    });
}
