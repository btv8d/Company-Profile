document.addEventListener("DOMContentLoaded", function () {
  // =============================================
  // 1. NAVBAR SCROLL EFFECT
  // =============================================
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // =============================================
  // 2. REVEAL ON SCROLL
  // =============================================
  const reveals = document.querySelectorAll(".reveal");
  function checkReveal() {
    const triggerBottom = (window.innerHeight / 5) * 4;
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < triggerBottom) {
        el.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", checkReveal);
  checkReveal();

  // =============================================
  // 3. MENU CATEGORY FILTER
  // =============================================
  const filterButtons = document.querySelectorAll(".btn-filter");
  const menuCards = document.querySelectorAll(".menu-item-card");

  if (filterButtons.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        filterButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        const filter = this.getAttribute("data-filter");
        menuCards.forEach((card) => {
          const cat = card.getAttribute("data-category");
          card.classList.toggle("hidden", filter !== "all" && filter !== cat);
        });
        setTimeout(checkReveal, 100);
      });
    });
  }

  // =============================================
  // 4. HAMBURGER MOBILE MENU
  // =============================================
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      this.classList.toggle("toggle-open");
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("toggle-open");
      });
    });
  }

  // =============================================
  // 5. ACTIVE NAV LINK DETECTION
  // =============================================
  const currentUrl = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentUrl) link.classList.add("active");
    else if (href !== "#contact") link.classList.remove("active");
  });

  // =============================================
  // 6. LANGUAGE DROPDOWN
  // =============================================
  const langSelectBtn = document.getElementById("langSelectBtn");
  const langDropdownMenu = document.getElementById("langDropdownMenu");
  const currentLangEl =
    document.getElementById("currentLang") ||
    document.getElementById("currentlang");

  if (langSelectBtn && langDropdownMenu) {
    langSelectBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdownMenu.classList.toggle("show");
    });
    langDropdownMenu.querySelectorAll("li").forEach((opt) => {
      opt.addEventListener("click", function () {
        if (currentLangEl) currentLangEl.textContent = this.textContent;
        langDropdownMenu.classList.remove("show");
      });
    });
    document.addEventListener("click", () =>
      langDropdownMenu.classList.remove("show"),
    );
  }

  // =============================================
  // 7. RESERVATION FORM
  // =============================================
  const form = document.getElementById("formReservasi");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const nama = document.getElementById("nama").value;
      const jumlah = document.getElementById("jumlah").value;
      const tanggal = document.getElementById("tanggal").value;
      const waktu = document.getElementById("waktu").value;
      alert(
        `✨ RESERVASI BERHASIL DISIMPAN ✨\n\nHalo ${nama},\nKami telah mengamankan meja untuk ${jumlah} orang pada ${tanggal} pukul ${waktu} WIB.\n\nSampai jumpa di Mr. Beans Cafe!`,
      );
      form.reset();
    });
  }

  // =============================================
  // 8. SHOPPING CART
  // =============================================
  let cart = []; // { id, name, price, img, qty }

  const cartFab = document.getElementById("cartFab");
  const cartCount = document.getElementById("cartCount");
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const cartItems = document.getElementById("cartItemsContainer");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");
  const btnCheckout = document.getElementById("btnCheckout");
  const btnClearCart = document.getElementById("btnClearCart");

  // ---- Helper: Format rupiah ----
  function formatRp(num) {
    return "Rp" + num.toLocaleString("id-ID");
  }

  // ---- Open / Close cart ----
  function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (cartFab) cartFab.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // ---- Render cart ----
  function renderCart() {
    if (!cartItems) return;

    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

    // Update FAB
    if (cartCount) cartCount.textContent = totalQty;
    if (cartFab) {
      cartFab.classList.toggle("visible", totalQty > 0);
    }

    // Empty state
    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = "block";
      if (cartFooter) cartFooter.style.display = "none";
      // Remove item rows
      cartItems.querySelectorAll(".cart-item").forEach((el) => el.remove());
      return;
    }

    if (cartEmpty) cartEmpty.style.display = "none";
    if (cartFooter) cartFooter.style.display = "block";
    if (cartTotal) cartTotal.textContent = formatRp(totalPrice);

    // Re-render items
    cartItems.querySelectorAll(".cart-item").forEach((el) => el.remove());
    cart.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.dataset.id = item.id;
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}" onerror="this.style.display='none'"/>
        <div class="cart-item-info">
          <h5>${item.name}</h5>
          <span class="item-price">${formatRp(item.price)}</span>
        </div>
        <div class="qty-controls">
          <button class="qty-btn qty-minus">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn qty-plus">+</button>
        </div>
        <button class="remove-btn" title="Hapus">🗑</button>
      `;

      div
        .querySelector(".qty-minus")
        .addEventListener("click", () => changeQty(item.id, -1));
      div
        .querySelector(".qty-plus")
        .addEventListener("click", () => changeQty(item.id, 1));
      div
        .querySelector(".remove-btn")
        .addEventListener("click", () => removeItem(item.id));

      cartItems.appendChild(div);
    });
  }

  // ---- Add to cart ----
  function addToCart(btn) {
    const card = btn.closest(".menu-item-card");
    if (!card) return;

    const name =
      card.getAttribute("data-name") || card.querySelector("h4").innerText;
    const price = parseInt(card.getAttribute("data-price") || "45000", 10);
    const img = card.getAttribute("data-img") || card.querySelector("img").src;
    const id = name; // use name as id

    const existing = cart.find((i) => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, img, qty: 1 });
    }

    // Button feedback
    btn.classList.add("added");
    const original = btn.textContent;
    btn.textContent = "✓";
    setTimeout(() => {
      btn.classList.remove("added");
      btn.textContent = original;
    }, 700);

    renderCart();
  }

  // ---- Change quantity ----
  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeItem(id);
    else renderCart();
  }

  // ---- Remove item ----
  function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    renderCart();
  }

  // ---- Clear cart ----
  if (btnClearCart) {
    btnClearCart.addEventListener("click", () => {
      if (confirm("Hapus semua item dari keranjang?")) {
        cart = [];
        renderCart();
      }
    });
  }

  // ---- Checkout ----
  if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
      if (cart.length === 0) return;
      const summary = cart
        .map((i) => `• ${i.name} x${i.qty}  (${formatRp(i.price * i.qty)})`)
        .join("\n");
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      alert(
        `✨ PESANAN DITERIMA ✨\n\n${summary}\n\n─────────────────\nTotal: ${formatRp(total)}\n\nTerima kasih! Pesanan Anda sedang diproses. ☕`,
      );
      cart = [];
      renderCart();
      closeCart();
    });
  }

  // ---- Bind add-btn clicks (uses event delegation for filter-hidden cards too) ----
  const menuContainer = document.getElementById("menu-container");
  if (menuContainer) {
    menuContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-btn")) {
        addToCart(e.target);
      }
    });
  } else {
    // Fallback for index page popular menu
    document.querySelectorAll(".add-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const card = this.closest(".menu-item-card");
        const menuName = card ? card.querySelector("h4").innerText : "Item";
        this.style.transform = "scale(0.8)";
        setTimeout(() => (this.style.transform = "scale(1)"), 150);
        alert(`🛒 ${menuName} berhasil ditambahkan ke pesanan Anda!`);
      });
    });
  }

  // Initial render
  renderCart();

  // =============================================
  // 9. PARALLAX HERO
  // =============================================
  window.addEventListener("scroll", () => {
    const hero = document.querySelector(".hero");
    if (hero) hero.style.backgroundPositionY = window.scrollY * 0.5 + "px";
  });

  // =============================================
  // 10. NAV HOVER + BUTTON RIPPLE + CARD 3D
  // =============================================
  document.querySelectorAll(".nav-links a").forEach((item) => {
    item.addEventListener(
      "mouseenter",
      () => (item.style.transform = "translateY(-2px)"),
    );
    item.addEventListener(
      "mouseleave",
      () => (item.style.transform = "translateY(0px)"),
    );
  });

  document.querySelectorAll(".btn-filled, .btn-outline").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = this.getBoundingClientRect();
      ripple.style.left = e.clientX - rect.left + "px";
      ripple.style.top = e.clientY - rect.top + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  document.querySelectorAll(".menu-item-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.transform = `rotateX(${-(y - rect.height / 2) / 25}deg) rotateY(${(x - rect.width / 2) / 25}deg) translateY(-10px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0) rotateY(0) translateY(0)";
    });
  });
});
