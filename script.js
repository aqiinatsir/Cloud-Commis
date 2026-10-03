(() => {
  "use strict";

  const WA_NUMBER = "6281513681271";
  const WA_ORDER = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Halo Cloud Commis, saya ingin order layanan Anda.")}`;
  const KEYS = {
    services: "cc_services_v1",
    team: "cc_team_v1",
    reviews: "cc_reviews_v1",
    reviewLock: "cc_review_locked_v1",
    session: "cc_admin_session_v1",
    seeded: "cc_seeded_v1"
  };
  const ADMIN_HASH = "46853574fd18d3c421ba5a5284731eaf1f8eb2d32525a6ed822ab7f59205aa6e";
  const DB_NAME = "CloudCommisDB";
  const STORE = "assets";

  const state = {
    isAdmin: false,
    services: [],
    team: [],
    portfolio: [],
    reviews: [],
    teamPhotoData: "",
    portfolioData: ""
  };

  const $ = (id) => document.getElementById(id);

  const svgArt = (title, c1, c2) =>
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
        </linearGradient></defs>
        <rect width='800' height='500' fill='#0b0f19'/>
        <circle cx='220' cy='240' r='120' fill='url(#g)' opacity='.85'/>
        <circle cx='340' cy='200' r='150' fill='url(#g)' opacity='.75'/>
        <circle cx='470' cy='250' r='110' fill='url(#g)' opacity='.8'/>
        <text x='400' y='430' text-anchor='middle' fill='#cfe9ff' font-family='Arial' font-size='28'>${title}</text>
      </svg>`
    )}`;

  const DEFAULT_SERVICES = [
    {
      id: "svc-1",
      badge: "POPULAR",
      icon: "fa-solid fa-paintbrush",
      title: "Ilustrasi & Digital Art",
      desc: "Karakter kustom, avatar, fanart, dan ilustrasi resolusi tinggi bertema neon cloud.",
      features: ["Sketsa & revisi fleksibel", "File PNG transparan & PSD", "Lisensi komersial"],
      price: "Mulai Rp 50.000"
    },
    {
      id: "svc-2",
      badge: "TERBAIK",
      icon: "fa-solid fa-laptop-code",
      title: "Website & Portofolio",
      desc: "Landing page dan web portofolio interaktif, glassmorphism, siap deploy Vercel.",
      features: ["Fully responsive", "Neon glass UI", "Setup hosting/Vercel"],
      price: "Mulai Rp 150.000"
    },
    {
      id: "svc-3",
      badge: "FAST DELIVERY",
      icon: "fa-solid fa-layer-group",
      title: "Desain Grafis & Branding",
      desc: "Logo neon, banner sosial, thumbnail, poster, dan identitas visual modern.",
      features: ["Konsep orisinal", "Pengerjaan 1–2 hari", "Siap cetak & digital"],
      price: "Mulai Rp 40.000"
    },
    {
      id: "svc-4",
      badge: "CUSTOM",
      icon: "fa-solid fa-cubes",
      title: "Komisi Kustom",
      desc: "Proyek khusus di luar paket. Diskusikan ide Anda dan dapatkan penawaran transparan.",
      features: ["Konsultasi via WhatsApp", "Deadline fleksibel", "Harga negotiable"],
      price: "Hubungi Admin"
    }
  ];

  const DEFAULT_TEAM = [
    {
      id: "tm-1",
      photo: svgArt("Alya", "#00f0ff", "#7a5cff"),
      name: "Alya Nirvana",
      role: "Founder & Lead Illustrator",
      bio: "Spesialis karakter anime futuristik dan digital painting dengan pengalaman 5+ tahun.",
      skills: ["Photoshop", "Illustrator", "Clip Studio"],
      linkedin: "",
      instagram: "",
      behance: "",
      wa: `https://wa.me/${WA_NUMBER}`
    },
    {
      id: "tm-2",
      photo: svgArt("Reza", "#00a8ff", "#00f0ff"),
      name: "Reza Pratama",
      role: "Senior Web & UI Designer",
      bio: "Merancang website interaktif cyber-glass, UI/UX responsif, dan animasi micro-interaction.",
      skills: ["Figma", "HTML5/CSS3", "Vercel"],
      linkedin: "",
      instagram: "",
      behance: "",
      wa: `https://wa.me/${WA_NUMBER}`
    },
    {
      id: "tm-3",
      photo: svgArt("Nadia", "#5aa7ff", "#00f0ff"),
      name: "Nadia Putri",
      role: "Brand Identity Specialist",
      bio: "Fokus identitas visual, tipografi futuristik, dan grafis promosi yang memikat.",
      skills: ["Illustrator", "Branding", "Typography"],
      linkedin: "",
      instagram: "",
      behance: "",
      wa: `https://wa.me/${WA_NUMBER}`
    },
    {
      id: "tm-4",
      photo: svgArt("Dimas", "#3d7dff", "#00f0ff"),
      name: "Dimas Aditya",
      role: "3D Visual & Motion Artist",
      bio: "Eksplorasi 3D awan partikel, motion graphic glowing, dan aset animasi platform.",
      skills: ["Blender 3D", "After Effects", "Shader"],
      linkedin: "",
      instagram: "",
      behance: "",
      wa: `https://wa.me/${WA_NUMBER}`
    }
  ];

  const DEFAULT_PORTFOLIO = [
    { id: "pf-1", title: "Neon Cloud Mascot", desc: "Maskot awan neon untuk identitas studio.", image: svgArt("Mascot", "#00f0ff", "#00a8ff") },
    { id: "pf-2", title: "Dashboard UI", desc: "Antarmuka dashboard glassmorphism.", image: svgArt("Dashboard", "#00a8ff", "#4d7cff") },
    { id: "pf-3", title: "Brand Identity", desc: "Paket logo dan palet visual cloud.", image: svgArt("Branding", "#7ad7ff", "#00f0ff") },
    { id: "pf-4", title: "Synthwave Scene", desc: "Ilustrasi lanskap neon cloud.", image: svgArt("Synthwave", "#5b8cff", "#00f0ff") }
  ];

  const DEFAULT_REVIEWS = [
    { id: "rv-1", name: "Fajar Wicaksono", role: "Content Creator", rating: 5, comment: "Ilustrasi neon-nya sesuai banget dengan brief. Admin ramah dan cepat.", createdAt: Date.now() - 86400000 },
    { id: "rv-2", name: "Dewi Anggraini", role: "Agency Owner", rating: 5, comment: "Website portofolio ringan, glowing, dan langsung dibantu deploy.", createdAt: Date.now() - 43200000 }
  ];

  function toast(msg) {
    const wrap = $("toast-container");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbSet(id, payload) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put({ id, payload });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function idbGet(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result ? req.result.payload : null);
      req.onerror = () => reject(req.error);
    });
  }

  function fileToDataURL(file, max = 1100) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function waLink(extra) {
    const text = extra
      ? `Halo Cloud Commis, saya tertarik order ${extra}.`
      : "Halo Cloud Commis, saya ingin order layanan Anda.";
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  function renderServices() {
    const grid = $("services-grid");
    grid.innerHTML = state.services.map((s) => `
      <article class="service-card">
        <span class="service-badge">${escapeHtml(s.badge || "CUSTOM")}</span>
        <div class="service-icon"><i class="${escapeAttr(s.icon || "fa-solid fa-cloud")}"></i></div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.desc)}</p>
        <ul class="service-features">
          ${(s.features || []).map((f) => `<li><i class="fa-solid fa-circle-check"></i>${escapeHtml(f)}</li>`).join("")}
        </ul>
        <div class="service-footer">
          <strong>${escapeHtml(s.price || "")}</strong>
          <a class="btn-service-order" href="${waLink(s.title)}" target="_blank" rel="noopener noreferrer">Order via WA</a>
        </div>
      </article>
    `).join("");
  }

  function renderTeam() {
    const grid = $("team-grid");
    grid.innerHTML = state.team.map((m) => `
      <article class="team-card">
        <img class="team-avatar" src="${escapeAttr(m.photo)}" alt="${escapeAttr(m.name)}">
        <h3>${escapeHtml(m.name)}</h3>
        <p class="team-role">${escapeHtml(m.role)}</p>
        <p class="team-bio">${escapeHtml(m.bio)}</p>
        <div class="skill-pills">${(m.skills || []).map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
        <div class="team-socials">
          ${m.linkedin ? `<a href="${escapeAttr(m.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>` : ""}
          ${m.instagram ? `<a href="${escapeAttr(m.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>` : ""}
          ${m.behance ? `<a href="${escapeAttr(m.behance)}" target="_blank" rel="noopener noreferrer" aria-label="Behance"><i class="fa-brands fa-behance"></i></a>` : ""}
          <a href="${escapeAttr(m.wa || `https://wa.me/${WA_NUMBER}`)}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </article>
    `).join("");
  }

  function renderPortfolio() {
    const grid = $("portfolio-grid");
    const empty = $("portfolio-empty");
    if (!state.portfolio.length) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");
    grid.innerHTML = state.portfolio.map((p) => `
      <article class="cloud-card" data-id="${escapeAttr(p.id)}">
        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}">
        <div class="meta">
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.desc)}</p>
        </div>
      </article>
    `).join("");
    grid.querySelectorAll(".cloud-card").forEach((card) => {
      card.addEventListener("click", () => {
        const item = state.portfolio.find((x) => x.id === card.dataset.id);
        if (!item) return;
        $("lightbox-img").src = item.image;
        $("lightbox-title").textContent = item.title;
        $("lightbox-desc").textContent = item.desc;
        $("modal-lightbox").classList.remove("hidden");
      });
    });
  }

  function stars(n) {
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  function renderReviews() {
    const grid = $("reviews-grid");
    const list = [...state.reviews].sort((a, b) => b.createdAt - a.createdAt);
    grid.innerHTML = list.map((r) => `
      <article class="review-card">
        <div class="avatar-circle">${escapeHtml((r.name || "?").charAt(0).toUpperCase())}</div>
        <div class="stars">${stars(Number(r.rating) || 5)}</div>
        <p>“${escapeHtml(r.comment)}”</p>
        <div class="review-meta"><strong>${escapeHtml(r.name)}</strong> · ${escapeHtml(r.role)}</div>
      </article>
    `).join("");
  }

  function renderAdminLists() {
    $("admin-portfolio-list").innerHTML = state.portfolio.map((p) => `
      <div class="admin-item"><span>${escapeHtml(p.title)}</span><button data-del-pf="${escapeAttr(p.id)}" type="button">Hapus</button></div>
    `).join("");
    $("admin-service-list").innerHTML = state.services.map((s) => `
      <div class="admin-item">
        <span>${escapeHtml(s.title)}</span>
        <span>
          <button data-edit-svc="${escapeAttr(s.id)}" type="button">Edit</button>
          <button data-del-svc="${escapeAttr(s.id)}" type="button">Hapus</button>
        </span>
      </div>
    `).join("");
    $("admin-team-list").innerHTML = state.team.map((m) => `
      <div class="admin-item">
        <span>${escapeHtml(m.name)}</span>
        <span>
          <button data-edit-tm="${escapeAttr(m.id)}" type="button">Edit</button>
          <button data-del-tm="${escapeAttr(m.id)}" type="button">Hapus</button>
        </span>
      </div>
    `).join("");
    $("admin-review-list").innerHTML = state.reviews.map((r) => `
      <div class="admin-item">
        <span>${escapeHtml(r.name)} (${r.rating}★) — ${escapeHtml(r.comment.slice(0, 60))}</span>
        <button data-del-rv="${escapeAttr(r.id)}" type="button">Hapus</button>
      </div>
    `).join("") || "<p>Tidak ada ulasan.</p>";
  }

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, "");
  }

  function persist() {
    saveJSON(KEYS.services, state.services);
    saveJSON(KEYS.team, state.team.map((m) => ({ ...m })));
    saveJSON(KEYS.reviews, state.reviews);
    idbSet("portfolio", state.portfolio).catch(() => {
      try { saveJSON("cc_portfolio_fallback", state.portfolio); } catch { toast("Penyimpanan penuh. Kompres gambar lebih kecil."); }
    });
  }

  function setAdmin(on) {
    state.isAdmin = on;
    $("admin-topbar").classList.toggle("hidden", !on);
    $("admin-nav-text").textContent = on ? "Dashboard" : "Login Admin";
    if (on) sessionStorage.setItem(KEYS.session, "1");
    else sessionStorage.removeItem(KEYS.session);
  }

  function lockReviewForm() {
    const locked = localStorage.getItem(KEYS.reviewLock) === "1";
    $("form-review").classList.toggle("hidden", locked);
    $("review-locked").classList.toggle("hidden", !locked);
  }

  function uid(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  }

  function bindNav() {
    const burger = $("nav-hamburger");
    const menu = $("nav-menu");
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));
    document.querySelectorAll(".nav-link[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
    });
  }

  function bindStars() {
    const picker = $("star-picker");
    const input = $("review-rating");
    const paint = (n) => {
      picker.querySelectorAll("button").forEach((b) => b.classList.toggle("active", Number(b.dataset.star) <= n));
    };
    paint(5);
    picker.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      input.value = btn.dataset.star;
      paint(Number(btn.dataset.star));
    });
  }

  function bindModals() {
    const close = (id) => $(id).classList.add("hidden");
    $("modal-login-close").addEventListener("click", () => close("modal-login"));
    $("modal-dashboard-close").addEventListener("click", () => close("modal-dashboard"));
    $("lightbox-close").addEventListener("click", () => close("modal-lightbox"));
    ["modal-login", "modal-dashboard", "modal-lightbox"].forEach((id) => {
      $(id).addEventListener("click", (e) => { if (e.target.id === id) close(id); });
    });
    $("nav-btn-admin").addEventListener("click", () => {
      if (state.isAdmin) $("modal-dashboard").classList.remove("hidden");
      else $("modal-login").classList.remove("hidden");
    });
    $("btn-open-dashboard").addEventListener("click", () => $("modal-dashboard").classList.remove("hidden"));
    $("btn-admin-logout").addEventListener("click", () => {
      setAdmin(false);
      $("modal-dashboard").classList.add("hidden");
      toast("Anda telah keluar dari mode admin.");
    });
  }

  function bindAdminAuth() {
    $("form-admin-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwd = $("admin-password").value;
      const hash = await sha256(pwd);
      $("admin-password").value = "";
      if (hash !== ADMIN_HASH) {
        $("login-error-msg").classList.remove("hidden");
        return;
      }
      $("login-error-msg").classList.add("hidden");
      $("modal-login").classList.add("hidden");
      setAdmin(true);
      renderAdminLists();
      $("modal-dashboard").classList.remove("hidden");
      toast("Login admin berhasil.");
    });
  }

  function bindTabs() {
    document.querySelectorAll(".dash-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".dash-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        ["portfolio", "services", "team", "reviews"].forEach((name) => {
          $(`panel-${name}`).classList.toggle("hidden", tab.dataset.tab !== name);
        });
      });
    });
  }

  function bindPortfolioForm() {
    $("portfolio-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      state.portfolioData = await fileToDataURL(file);
      const img = $("portfolio-preview");
      img.src = state.portfolioData;
      img.classList.remove("hidden");
    });
    $("form-upload-portfolio").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!state.portfolioData) return toast("Pilih file gambar terlebih dahulu.");
      state.portfolio.unshift({
        id: uid("pf"),
        title: $("portfolio-title").value.trim(),
        desc: $("portfolio-desc").value.trim(),
        image: state.portfolioData
      });
      persist();
      renderPortfolio();
      renderAdminLists();
      e.target.reset();
      state.portfolioData = "";
      $("portfolio-preview").classList.add("hidden");
      toast("Foto portofolio disimpan.");
    });
  }

  function bindServiceForm() {
    $("form-service").addEventListener("submit", (e) => {
      e.preventDefault();
      const item = {
        id: $("service-id").value || uid("svc"),
        badge: $("service-badge").value.trim() || "CUSTOM",
        icon: $("service-icon").value.trim() || "fa-solid fa-cloud",
        title: $("service-title").value.trim(),
        desc: $("service-desc").value.trim(),
        features: $("service-features").value.split("\n").map((x) => x.trim()).filter(Boolean),
        price: $("service-price").value.trim()
      };
      const idx = state.services.findIndex((s) => s.id === item.id);
      if (idx >= 0) state.services[idx] = item;
      else state.services.push(item);
      persist();
      renderServices();
      renderAdminLists();
      resetServiceForm();
      toast("Paket layanan disimpan.");
    });
    $("btn-reset-service").addEventListener("click", resetServiceForm);
  }

  function resetServiceForm() {
    $("form-service").reset();
    $("service-id").value = "";
    $("service-icon").value = "fa-solid fa-cloud";
  }

  function bindTeamForm() {
    $("team-photo").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      state.teamPhotoData = await fileToDataURL(file, 500);
      const img = $("team-preview");
      img.src = state.teamPhotoData;
      img.classList.remove("hidden");
    });
    $("form-team").addEventListener("submit", (e) => {
      e.preventDefault();
      const existing = state.team.find((m) => m.id === $("team-id").value);
      const item = {
        id: $("team-id").value || uid("tm"),
        photo: state.teamPhotoData || (existing && existing.photo) || svgArt("Member", "#00f0ff", "#00a8ff"),
        name: $("team-name").value.trim(),
        role: $("team-role").value.trim(),
        bio: $("team-bio").value.trim(),
        skills: $("team-skills").value.split(",").map((x) => x.trim()).filter(Boolean),
        linkedin: $("team-linkedin").value.trim(),
        instagram: $("team-instagram").value.trim(),
        behance: $("team-behance").value.trim(),
        wa: $("team-wa").value.trim() || `https://wa.me/${WA_NUMBER}`
      };
      const idx = state.team.findIndex((m) => m.id === item.id);
      if (idx >= 0) state.team[idx] = item;
      else state.team.push(item);
      persist();
      renderTeam();
      renderAdminLists();
      resetTeamForm();
      toast("Data tim disimpan.");
    });
    $("btn-reset-team").addEventListener("click", resetTeamForm);
  }

  function resetTeamForm() {
    $("form-team").reset();
    $("team-id").value = "";
    $("team-wa").value = `https://wa.me/${WA_NUMBER}`;
    state.teamPhotoData = "";
    $("team-preview").classList.add("hidden");
  }

  function bindAdminClicks() {
    document.addEventListener("click", (e) => {
      const pf = e.target.closest("[data-del-pf]");
      const ds = e.target.closest("[data-del-svc]");
      const es = e.target.closest("[data-edit-svc]");
      const dt = e.target.closest("[data-del-tm]");
      const et = e.target.closest("[data-edit-tm]");
      const dr = e.target.closest("[data-del-rv]");
      if (pf) {
        state.portfolio = state.portfolio.filter((p) => p.id !== pf.dataset.delPf);
        persist(); renderPortfolio(); renderAdminLists();
      }
      if (ds) {
        state.services = state.services.filter((s) => s.id !== ds.dataset.delSvc);
        persist(); renderServices(); renderAdminLists();
      }
      if (es) {
        const s = state.services.find((x) => x.id === es.dataset.editSvc);
        if (!s) return;
        $("service-id").value = s.id;
        $("service-badge").value = s.badge;
        $("service-icon").value = s.icon;
        $("service-title").value = s.title;
        $("service-desc").value = s.desc;
        $("service-features").value = (s.features || []).join("\n");
        $("service-price").value = s.price;
      }
      if (dt) {
        state.team = state.team.filter((m) => m.id !== dt.dataset.delTm);
        persist(); renderTeam(); renderAdminLists();
      }
      if (et) {
        const m = state.team.find((x) => x.id === et.dataset.editTm);
        if (!m) return;
        $("team-id").value = m.id;
        $("team-name").value = m.name;
        $("team-role").value = m.role;
        $("team-bio").value = m.bio;
        $("team-skills").value = (m.skills || []).join(", ");
        $("team-linkedin").value = m.linkedin || "";
        $("team-instagram").value = m.instagram || "";
        $("team-behance").value = m.behance || "";
        $("team-wa").value = m.wa || `https://wa.me/${WA_NUMBER}`;
        $("team-preview").src = m.photo;
        $("team-preview").classList.remove("hidden");
        state.teamPhotoData = m.photo;
      }
      if (dr) {
        state.reviews = state.reviews.filter((r) => r.id !== dr.dataset.delRv);
        persist(); renderReviews(); renderAdminLists();
        toast("Ulasan dihapus.");
      }
    });
  }

  function bindReviewForm() {
    $("form-review").addEventListener("submit", (e) => {
      e.preventDefault();
      if (localStorage.getItem(KEYS.reviewLock) === "1") return;
      state.reviews.push({
        id: uid("rv"),
        name: $("review-name").value.trim(),
        role: $("review-role").value.trim(),
        rating: Number($("review-rating").value) || 5,
        comment: $("review-comment").value.trim(),
        createdAt: Date.now()
      });
      localStorage.setItem(KEYS.reviewLock, "1");
      persist();
      renderReviews();
      lockReviewForm();
      toast("Ulasan tersimpan.");
    });
  }

  function ambientCanvas() {
    const canvas = $("cloud-canvas");
    const ctx = canvas.getContext("2d");
    const dots = [];
    const resize = () => {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);
    for (let i = 0; i < 48; i++) {
      dots.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() * 2 + 0.4,
        s: Math.random() * 0.35 + 0.1
      });
    }
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(0, 240, 255, 0.35)";
      dots.forEach((d) => {
        d.y -= d.s;
        if (d.y < 0) d.y = canvas.height;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    tick();
  }

  async function boot() {
    state.services = loadJSON(KEYS.services, DEFAULT_SERVICES);
    state.team = loadJSON(KEYS.team, DEFAULT_TEAM);
    state.reviews = loadJSON(KEYS.reviews, DEFAULT_REVIEWS);
    try {
      const stored = await idbGet("portfolio");
      state.portfolio = stored && stored.length ? stored : loadJSON("cc_portfolio_fallback", DEFAULT_PORTFOLIO);
    } catch {
      state.portfolio = loadJSON("cc_portfolio_fallback", DEFAULT_PORTFOLIO);
    }
    if (!localStorage.getItem(KEYS.seeded)) {
      persist();
      localStorage.setItem(KEYS.seeded, "1");
    }
    renderServices();
    renderTeam();
    renderPortfolio();
    renderReviews();
    lockReviewForm();
    bindNav();
    bindStars();
    bindModals();
    bindAdminAuth();
    bindTabs();
    bindPortfolioForm();
    bindServiceForm();
    bindTeamForm();
    bindAdminClicks();
    bindReviewForm();
    ambientCanvas();
    if (sessionStorage.getItem(KEYS.session) === "1") {
      setAdmin(true);
      renderAdminLists();
    }
    void WA_ORDER;
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
