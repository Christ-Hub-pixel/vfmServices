/**
 * ==========================================================================
 * VFM SERVICE - MODULE JAVASCRIPT PRINCIPAL (SYSTÈME DE PANIER & EMAIL DEVIS)
 * Auteur: Antigravity AI - Expert Engineering
 * Standard: ES6+ Modular Vanilla JS, LocalStorage Persistence, Cart Drawer
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  VFMApp.init();
  VFMCart.init();
});

/**
 * --------------------------------------------------------------------------
 * MODULE PRINCIPAL DE L'APPLICATION VFM
 * --------------------------------------------------------------------------
 */
const VFMApp = {
  config: {
    emailContact: 'infos@vfmservices.net',
    whatsappNumber: '2250715416831',
  },

  init() {
    this.setActiveNavLink();
    this.initNavigation();
    this.initHeaderScroll();
    this.initCatalogueFiltering();
    this.initLiveSearch();
    this.initCarousels();
    this.initDevisForm();
    this.initSmoothScroll();
    this.initBackToTop();
    this.initWhatsAppWidget();
    this.initAnimatedCounters();
    this.initScrollReveal();
  },

  initCarousels() {
    // 1. Carrousel de bannières Hero (5 images : caroussel1.png à caroussel5.png)
    const heroCarousel = document.getElementById('catalogueHeroCarousel');
    if (heroCarousel) {
      const slides = heroCarousel.querySelectorAll('.hero-carousel__slide');
      const dots = heroCarousel.querySelectorAll('.hero-carousel__dot');
      const prevBtn = document.getElementById('heroPrevBtn');
      const nextBtn = document.getElementById('heroNextBtn');
      let currentIndex = 0;
      let timer = null;

      const goToSlide = (index) => {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, idx) => {
          if (idx === currentIndex) {
            slide.classList.add('active');
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
          } else {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
          }
        });
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      };

      const startAutoPlay = () => {
        stopAutoPlay();
        timer = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 2000);
      };

      const stopAutoPlay = () => {
        if (timer) clearInterval(timer);
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(currentIndex - 1);
          startAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(currentIndex + 1);
          startAutoPlay();
        });
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          goToSlide(idx);
          startAutoPlay();
        });
      });

      heroCarousel.addEventListener('mouseenter', stopAutoPlay);
      heroCarousel.addEventListener('mouseleave', startAutoPlay);

      goToSlide(0);
      startAutoPlay();
    }

    // 2. Défilement automatique toutes les 2 secondes pour les carrousels de catégories
    const categoryWrappers = document.querySelectorAll('.carousel-track-wrapper');
    categoryWrappers.forEach(wrapper => {
      let catTimer = null;

      const autoScrollCat = () => {
        const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
        if (maxScrollLeft <= 10) return;

        if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 15) {
          wrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          wrapper.scrollBy({ left: 290, behavior: 'smooth' });
        }
      };

      const startCatAuto = () => {
        stopCatAuto();
        catTimer = setInterval(autoScrollCat, 2000);
      };

      const stopCatAuto = () => {
        if (catTimer) clearInterval(catTimer);
      };

      wrapper.addEventListener('mouseenter', stopCatAuto);
      wrapper.addEventListener('mouseleave', startCatAuto);

      startCatAuto();
    });

    // 3. Boutons de navigation manuelle des carrousels par catégorie
    document.querySelectorAll('.carousel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.dataset.carouselTarget;
        const direction = btn.dataset.direction;
        const track = document.getElementById(targetId);
        if (track) {
          const wrapper = track.closest('.carousel-track-wrapper');
          if (wrapper) {
            const scrollAmount = direction === 'next' ? 290 : -290;
            wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      });
    });
  },

  setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href').split('#')[0];
      if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html') || (currentPath === 'accueil.html' && linkPath === 'accueil.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  initNavigation() {
    const navToggles = document.querySelectorAll('.nav-toggle');
    const navLists = document.querySelectorAll('.nav__list');
    const navLinks = document.querySelectorAll('.nav__link');

    navToggles.forEach(navToggle => {
      navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLists.forEach(navList => {
          const isOpen = navList.classList.toggle('open');
          if (navList.classList.contains('hidden')) {
            navList.classList.remove('hidden');
          }
          navToggle.setAttribute('aria-expanded', isOpen);
        });
      });
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLists.forEach(navList => navList.classList.remove('open'));
        navToggles.forEach(navToggle => navToggle.setAttribute('aria-expanded', 'false'));
      });
    });
  },

  initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  },

  initCatalogueFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterBtns.length || !productCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const category = e.currentTarget.dataset.filter;
        this.filterProducts(category, document.getElementById('searchInput')?.value || '');
      });
    });
  },

  initLiveSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    if (!searchInput) return;

    const handleSearch = () => {
      const query = searchInput.value.toLowerCase().trim();
      const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

      if (clearBtn) {
        if (query.length > 0) {
          clearBtn.classList.add('visible');
        } else {
          clearBtn.classList.remove('visible');
        }
      }

      this.filterProducts(activeFilter, query);
    };

    searchInput.addEventListener('input', handleSearch);

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        searchInput.focus();
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        this.filterProducts(activeFilter, '');
      });
    }
  },

  filterProducts(category, query) {
    // 1. Gérer l'affichage des blocs de carrousels par catégorie s'ils existent
    const categoryBlocks = document.querySelectorAll('.carousel-category-block');
    if (categoryBlocks.length > 0) {
      categoryBlocks.forEach(block => {
        const blockCat = block.dataset.category;
        const matchesCategory = (category === 'all' || blockCat === category);
        
        if (matchesCategory) {
          block.style.display = 'block';
        } else {
          block.style.display = 'none';
        }
      });
    }

    // 2. Filtrer chaque carte individuellement et compter le résultat
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = card.querySelector('.product-card__title')?.textContent.toLowerCase() || '';
      const cardDesc = card.querySelector('.product-card__body')?.textContent.toLowerCase() || '';

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = (!query || cardTitle.includes(query) || cardDesc.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const badge = document.getElementById('searchCountBadge');
    if (badge) {
      if (query) {
        badge.textContent = `${visibleCount} matériel${visibleCount > 1 ? 's trouvés' : ' trouvé'}`;
      } else if (category !== 'all') {
        badge.textContent = `${visibleCount} matériel${visibleCount > 1 ? 's' : ''} dans cette catégorie`;
      } else {
        badge.textContent = `61 équipements disponibles`;
      }
    }
  },

  initDevisForm() {
    const form = document.getElementById('devisForm');
    const msgInput = document.getElementById('formMessage') || document.getElementById('message');

    if (msgInput) {
      msgInput.addEventListener('input', () => {
        msgInput.dataset.userModified = 'true';
      });

      // Remplissage automatique au chargement depuis l'URL ou localStorage
      const urlParams = new URLSearchParams(window.location.search);
      const articleFromUrl = urlParams.get('article') || urlParams.get('produit') || urlParams.get('item');
      const articleFromStorage = localStorage.getItem('vfm_selected_product');

      let cartItems = [];
      try {
        const storedCart = localStorage.getItem('vfm_cart');
        if (storedCart) cartItems = JSON.parse(storedCart);
      } catch (e) {}

      const targetArticle = articleFromUrl || articleFromStorage;

      if (!msgInput.dataset.userModified) {
        if (cartItems.length > 0) {
          msgInput.value = "Bonjour VFM Service,\nJe souhaite obtenir une cotation pour le(s) matériel(s) suivant(s) :\n\n" +
            cartItems.map((item, index) => `• ${item.title} (Quantité : ${item.quantity})`).join('\n') +
            "\n\nMerci de me recontacter avec votre meilleure offre tarifaire.";
        } else if (targetArticle) {
          msgInput.value = `Bonjour VFM Service,\nJe souhaite obtenir une cotation pour le matériel suivant :\n\n• ${targetArticle} (Quantité : 1)\n\nMerci de me recontacter avec votre meilleure offre tarifaire.`;
        }
      }
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.sanitizeInput(document.getElementById('formName')?.value || '');
      const rawPhone = this.sanitizeInput(document.getElementById('formPhone')?.value || '');
      const prefix = document.getElementById('formCountryCode')?.value || '+225';
      const phone = rawPhone ? `${prefix} ${rawPhone}` : '';
      const email = this.sanitizeInput(document.getElementById('formEmail')?.value || '');
      const service = this.sanitizeInput(document.getElementById('formService')?.value || '');
      const message = this.sanitizeInput(document.getElementById('formMessage')?.value || '');

      if (!name || (!phone && !email)) {
        alert('Veuillez renseigner votre nom et au moins un moyen de contact.');
        return;
      }

      const subject = encodeURIComponent(`Demande de Devis - VFM Service (${service})`);
      const bodyText = `Bonjour VFM Service,\n\n` +
                       `Je souhaite obtenir un devis pour votre équipement/service.\n\n` +
                       `Nom Complet : ${name}\n` +
                       `Téléphone : ${phone || 'Non renseigné'}\n` +
                       `Email Client : ${email || 'Non renseigné'}\n` +
                       `Besoin Concerné : ${service}\n\n` +
                       `Message / Spécifications :\n${message || 'Aucune précision complémentaire.'}\n\n` +
                       `Cordialement,\n${name}`;

      window.location.href = `mailto:${this.config.emailContact}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    });
  },

  sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML.trim();
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  },

  initBackToTop() {
    if (document.getElementById('backToTopBtn')) return;

    const btnHTML = `
      <button id="backToTopBtn" class="back-to-top-btn" aria-label="Retour en haut de page" title="Retour en haut de page">
        ↑
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', btnHTML);

    const btn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  initWhatsAppWidget() {
    if (document.getElementById('whatsappFloatBtn')) return;

    const waHTML = `
      <a id="whatsappFloatBtn" href="https://wa.me/2250715416831" target="_blank" rel="noopener noreferrer" class="whatsapp-float-btn" aria-label="Assistance WhatsApp Directe 24/7" title="Contactez un expert VFM sur WhatsApp">
        <span class="whatsapp-pulse-ring"></span>
        💬
      </a>
    `;
    document.body.insertAdjacentHTML('beforeend', waHTML);
  },

  initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetNum = parseInt(el.getAttribute('data-counter'), 10);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 2000;
          const startTimestamp = performance.now();

          const updateCounter = (now) => {
            const elapsed = now - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
            const currentNum = Math.floor(easeProgress * targetNum);
            
            el.textContent = `${prefix}${currentNum}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = `${prefix}${targetNum}${suffix}`;
            }
          };

          requestAnimationFrame(updateCounter);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  },

  initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
  },
};

/**
 * --------------------------------------------------------------------------
 * MODULE PANIER DE DEVIS (VFMCart)
 * --------------------------------------------------------------------------
 */
const VFMCart = {
  items: [],

  init() {
    this.loadCart();
    this.injectCartDOM();
    this.bindEvents();
    this.updateUI();
  },

  loadCart() {
    try {
      const stored = localStorage.getItem('vfm_cart');
      this.items = stored ? JSON.parse(stored) : [];
    } catch (e) {
      this.items = [];
    }
  },

  saveCart() {
    try {
      localStorage.setItem('vfm_cart', JSON.stringify(this.items));
    } catch (e) {}
    this.updateUI();
  },

  addItem(title, image, category) {
    const existing = this.items.find(item => item.title === title);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: Date.now().toString(),
        title,
        image,
        category,
        quantity: 1
      });
    }
    this.saveCart();
    this.showToast(`"${title}" ajouté au devis !`);
  },

  showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  },

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
  },

  updateQuantity(id, delta) {
    const item = this.items.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(id);
    } else {
      this.saveCart();
    }
  },

  clearCart() {
    this.items = [];
    this.saveCart();
  },

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  },

  injectCartDOM() {
    // 1. Bouton Panier dans le Nav s'il n'existe pas
    const navList = document.querySelector('.nav__list');
    if (navList && !document.getElementById('navCartBtn')) {
      const cartLi = document.createElement('li');
      cartLi.innerHTML = `
        <button id="navCartBtn" class="nav__cart-btn" aria-label="Voir le panier de devis">
          🛒 Panier <span id="cartBadge" class="cart-count-badge">0</span>
        </button>
      `;
      navList.appendChild(cartLi);
    }

    // Supprimer tout bouton flottant s'il existe déjà dans le DOM
    const existingFloatBtn = document.getElementById('floatingCartBtn');
    if (existingFloatBtn) {
      existingFloatBtn.remove();
    }

    // 3. Overlay et Tiroir de Panier s'ils n'existent pas
    if (!document.getElementById('cartDrawer')) {
      const drawerHTML = `
        <div id="cartOverlay" class="cart-overlay"></div>
        <div id="cartDrawer" class="cart-drawer" role="dialog" aria-modal="true" aria-label="Panier de Devis">
          <div class="cart-drawer__header">
            <div class="cart-drawer__header-info">
              <h3 class="cart-drawer__title">
                <span class="cart-icon-badge">🛒</span> 
                Votre Panier <span id="cartHeaderCount" class="cart-count-pill">0 article</span>
              </h3>
              <p class="cart-drawer__subtitle">Sélection d'équipements pour devis express</p>
            </div>
            <div class="cart-drawer__header-actions">
              <button id="cartClearBtn" class="cart-clear-btn" title="Vider tout le panier">
                <span style="font-size: 0.85rem;">🗑️</span> Vider
              </button>
              <button id="cartCloseBtn" class="cart-drawer__close" aria-label="Fermer le panier">&times;</button>
            </div>
          </div>
          
          <div id="cartBody" class="cart-drawer__body">
            <!-- Liste des produits injectée dynamiquement -->
          </div>

          <div id="cartFooter" class="cart-drawer__footer">
            <form id="cartCheckoutForm">
              <h4 class="cart-footer__title">
                ✉️ Envoyer votre demande de devis
              </h4>
              <div class="cart-form-group">
                <input type="text" id="cartClientName" class="cart-form-input" placeholder="Votre Nom complet *" required>
              </div>
              <div class="cart-form-group">
                <div class="phone-input-group">
                  <select id="cartCountryCode" class="phone-country-select" title="Indicatif pays">
                    <option value="+225" selected>🇨🇮 +225</option>
                    <option value="+226">🇧🇫 +226</option>
                    <option value="+223">🇲🇱 +223</option>
                    <option value="+221">🇸🇳 +221</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+228">🇹🇬 +228</option>
                    <option value="+229">🇧🇯 +229</option>
                  </select>
                  <input type="tel" id="cartClientPhone" class="cart-form-input phone-with-select" placeholder="07 15 41 68 31 *" required>
                </div>
              </div>
              <div class="cart-form-group">
                <input type="email" id="cartClientEmail" class="cart-form-input" placeholder="Votre Email (facultatif)">
              </div>
              <div class="cart-form-group">
                <textarea id="cartClientNotes" class="cart-form-input cart-form-textarea" placeholder="Remarques ou spécifications particulières..."></textarea>
              </div>
              
              <button type="submit" class="btn-checkout-email">
                ✉️ Valider mon Panier & Aller au Formulaire
              </button>
              <button type="button" id="cartWhatsAppBtn" class="btn-whatsapp-devis">
                💬 Demander par WhatsApp Direct
              </button>
            </form>
          </div>
        </div>

        <div id="toastNotification" class="toast-notification">
          <span id="toastMsg"></span>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', drawerHTML);
    }

    // 3. Fenêtre Lightbox pour l'agrandissement de la loupe s'il n'existe pas
    if (!document.getElementById('lightboxModal')) {
      const lightboxHTML = `
        <div id="lightboxModal" class="lightbox-modal" role="dialog" aria-modal="true" aria-label="Agrandissement photo matériel">
          <div class="lightbox-content">
            <button id="lightboxClose" class="lightbox-close" aria-label="Fermer la vue agrandie">&times;</button>
            <div class="lightbox-image-wrapper">
              <img id="lightboxImg" src="" alt="Photo agrandie" class="lightbox-image">
            </div>
            <h3 id="lightboxTitle" class="lightbox-title"></h3>
            <p style="color: var(--color-text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">Matériel d'origine garanti VFM Service</p>
            <button id="lightboxAddBtn" class="btn btn--primary" style="width: 100%; padding: 0.75rem;">🛒 AJOUTER CE MATÉRIEL AU DEVIS</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    // 4. Attacher les écouteurs "Ajouter au Panier" et "Loupe" sur toutes les cartes
    this.bindProductButtons();
  },

  bindProductButtons() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const title = card.querySelector('.product-card__title')?.textContent.trim() || 'Matériel Pedrollo';
      const img = card.querySelector('.product-card__image')?.getAttribute('src') || 'assets/logo.png';
      const cat = card.querySelector('.product-card__category')?.textContent.trim() || 'Équipement';

      // Formater le footer avec le badge au-dessus et le bouton pilule agrandi au-dessous
      const footer = card.querySelector('.product-card__footer');
      if (footer) {
        const existingBadge = footer.querySelector('.badge');
        const badgeHTML = existingBadge ? existingBadge.outerHTML : '<span class="badge badge--blue">Pedrollo Origine</span>';

        footer.innerHTML = badgeHTML;

        const pillBtn = document.createElement('button');
        pillBtn.className = 'btn-add-devis-pill';
        pillBtn.innerHTML = '<span style="font-size: 1.1rem;">🛒⁺</span> AJOUTER AU DEVIS';

        footer.appendChild(pillBtn);
      }
    });
  },

  openLightbox(title, imgUrl, category) {
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const addBtn = document.getElementById('lightboxAddBtn');

    if (!modal || !img || !titleEl) return;

    img.src = imgUrl;
    img.alt = title;
    titleEl.textContent = title;

    if (addBtn) {
      addBtn.onclick = () => {
        this.addItem(title, imgUrl, category);
        this.closeLightbox();
      };
    }

    modal.classList.add('open');
  },

  closeLightbox() {
    document.getElementById('lightboxModal')?.classList.remove('open');
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      // 1. Clic sur n'importe quel bouton de carte produit : Ajouter au Panier et ouvrir le panier latéral
      const cardBtn = e.target.closest('.product-card__footer a, .product-card__footer button, .btn-add-devis-pill, .btn-add-cart');
      if (cardBtn) {
        const card = cardBtn.closest('.product-card');
        if (card) {
          e.preventDefault();
          const title = card.querySelector('.product-card__title')?.textContent.trim() || 'Matériel Pedrollo';
          const img = card.querySelector('.product-card__image')?.getAttribute('src') || 'assets/logo.png';
          const cat = card.querySelector('.product-card__category')?.textContent.trim() || 'Équipement';

          localStorage.setItem('vfm_selected_product', title);
          this.addItem(title, img, cat);
          this.openDrawer(); // Ouvre immédiatement le panier latéral pour validation
          return;
        }
      }

      if (e.target.closest('#navCartBtn')) {
        this.openDrawer();
      }
      if (e.target.closest('#cartCloseBtn') || e.target.id === 'cartOverlay') {
        this.closeDrawer();
      }
      if (e.target.closest('#cartClearBtn')) {
        if (confirm('Voulez-vous vraiment vider tout votre panier de devis ?')) {
          this.clearCart();
        }
      }
      if (e.target.closest('#lightboxClose') || e.target.id === 'lightboxModal') {
        this.closeLightbox();
      }
      if (e.target.closest('#cartWhatsAppBtn')) {
        this.sendCartByWhatsApp();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDrawer();
        this.closeLightbox();
      }
    });

    // Écouteur universel d'activation de 100% des boutons du site
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('a, button, .btn');
      if (!btn) return;

      // Bouton "Soumettre une Demande" ou boutons CTA
      if (btn.textContent.includes('Soumettre une Demande') || btn.textContent.includes('Soumettre un Devis')) {
        if (!window.location.pathname.endsWith('contact.html')) {
          window.location.href = 'contact.html#devisForm';
        } else {
          document.getElementById('devisForm')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    const checkoutForm = document.getElementById('cartCheckoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendCartByEmail();
      });
    }
  },

  openDrawer() {
    document.getElementById('cartOverlay')?.classList.add('open');
    document.getElementById('cartDrawer')?.classList.add('open');
    document.body.classList.add('cart-drawer-open');
  },

  closeDrawer() {
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.getElementById('cartDrawer')?.classList.remove('open');
    document.body.classList.remove('cart-drawer-open');
  },

  updateUI() {
    const count = this.getTotalCount();
    const navCount = document.getElementById('navCartCount');
    const badge = document.getElementById('cartBadge');
    const floatBadge = document.getElementById('floatCartBadge');
    const headerCount = document.getElementById('cartHeaderCount');

    if (navCount) navCount.textContent = count;
    if (badge) badge.textContent = count;
    if (floatBadge) floatBadge.textContent = count;
    if (headerCount) headerCount.textContent = `${count} ${count > 1 ? 'articles' : 'article'}`;

    // 1. Pré-remplir TOUJOURS automatiquement tous les champs message/description des formulaires de la page
    const messageFields = document.querySelectorAll('#formMessage, #message, textarea[name="message"]');
    if (messageFields.length > 0) {
      if (this.items.length > 0) {
        const summaryText = "Bonjour VFM Service,\nJe souhaite obtenir une cotation pour le(s) matériel(s) suivant(s) :\n\n" +
          this.items.map((item, index) => `• ${item.title} (Quantité : ${item.quantity})`).join('\n') +
          "\n\nMerci de me recontacte avec votre meilleure offre tarifaire.";
        
        messageFields.forEach(field => {
          if (!field.dataset.userModified) {
            field.value = summaryText;
          }
        });
      } else {
        messageFields.forEach(field => {
          if (!field.dataset.userModified) {
            field.value = '';
          }
        });
      }
    }

    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');

    if (!cartBody) return;

    if (this.items.length === 0) {
      cartBody.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon-wrapper">
            <div class="cart-empty-icon-glow"></div>
            <span class="cart-empty-icon">🛒</span>
          </div>
          <h4 class="cart-empty-title">Votre panier de devis est vide</h4>
          <p class="cart-empty-text">
            Sélectionnez des pompes hydrauliques, groupes électrogènes ou pièces pour composer votre demande de cotation officielle.
          </p>
          <a href="catalogue.html" class="btn-empty-browse" onclick="VFMCart.closeDrawer()">
            Explorer le Catalogue ➔
          </a>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
    } else {
      if (cartFooter) cartFooter.style.display = 'block';

      cartBody.innerHTML = this.items.map(item => `
        <div class="cart-item-card">
          <div class="cart-item-img-wrapper">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          </div>
          <div class="cart-item-content">
            <h5 class="cart-item-title">${item.title}</h5>
            <span class="cart-item-cat">${item.category}</span>
            <div class="cart-qty-picker">
              <button class="cart-qty-btn" onclick="VFMCart.updateQuantity('${item.id}', -1)" aria-label="Moins">-</button>
              <span class="cart-qty-value">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="VFMCart.updateQuantity('${item.id}', 1)" aria-label="Plus">+</button>
            </div>
          </div>
          <button class="cart-item-delete" onclick="VFMCart.removeItem('${item.id}')" title="Supprimer cet article">&times;</button>
        </div>
      `).join('');
    }
  },

  getCheckoutData() {
    const name = VFMApp.sanitizeInput(document.getElementById('cartClientName')?.value || '');
    const rawPhone = VFMApp.sanitizeInput(document.getElementById('cartClientPhone')?.value || '');
    const prefix = document.getElementById('cartCountryCode')?.value || '+225';
    const email = VFMApp.sanitizeInput(document.getElementById('cartClientEmail')?.value || '');
    const notes = VFMApp.sanitizeInput(document.getElementById('cartClientNotes')?.value || '');

    const phone = rawPhone ? `${prefix} ${rawPhone}` : '';

    return { name, phone, email, notes };
  },

  sendCartByEmail() {
    if (this.items.length === 0) {
      alert('Votre panier de devis est vide.');
      return;
    }

    const { name, phone, email, notes } = this.getCheckoutData();

    // Mettre à jour l'IU et fermer le panier latéral
    this.updateUI();
    this.closeDrawer();

    // Rediriger ou faire défiler jusqu'au formulaire de devis sur contact.html
    const firstTitle = this.items[0]?.title || 'Panier VFM';
    const targetUrl = `contact.html?article=${encodeURIComponent(firstTitle)}#devisForm`;
    
    if (!window.location.pathname.endsWith('contact.html')) {
      window.location.href = targetUrl;
    } else {
      document.getElementById('devisForm')?.scrollIntoView({ behavior: 'smooth' });
    }
  },

  sendCartByWhatsApp() {
    if (this.items.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    const { name, phone, email, notes } = this.getCheckoutData();

    if (!name || !phone) {
      alert('Veuillez renseigner votre nom et votre numéro de téléphone avant d\'envoyer sur WhatsApp.');
      return;
    }

    let itemsList = this.items.map((item, index) => 
      `• *${item.title}* (x${item.quantity})`
    ).join('\n');

    const whatsappMessage = `*DEMANDE DE DEVIS VFM SERVICE*\n\n` +
                            `Bonjour, je souhaite obtenir un devis pour :\n\n` +
                            `${itemsList}\n\n` +
                            `*Client :* ${name}\n` +
                            `*Téléphone :* ${phone}\n` +
                            (email ? `*Email :* ${email}\n` : '') +
                            (notes ? `*Remarques :* ${notes}\n` : '') +
                            `\nMerci !`;

    const waUrl = `https://wa.me/2250715416831?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    this.closeDrawer();
  }
};
