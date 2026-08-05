/**
 * ==========================================================================
 * VFM SERVICES - MODULE JAVASCRIPT PRINCIPAL (SYSTÈME DE PANIER & EMAIL DEVIS)
 * Auteur: Antigravity AI - Expert Engineering
 * Standard: ES6+ Modular Vanilla JS, LocalStorage Persistence, Cart Drawer
 * ==========================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  VFMApp.init();
  VFMCart.init();
  VFMProductModal.init();
});

/**
 * --------------------------------------------------------------------------
 * MODULE PRINCIPAL DE L'APPLICATION VFM
 * --------------------------------------------------------------------------
 */
const VFMApp = {
  config: {
    emailContact: 'globaltechsynergie@gmail.com',
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
    this.initAnimatedCounters();
    this.initScrollReveal();
    this.initHoneypotMatrix();
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
      const slideCaptions = [
        {
          badge: '🛠️ Matériel Professionnel Certifié',
          title: 'Outillage & Équipements de Chantier',
          sub: 'Outillage & matériels industriels haute résistance pour le forage et le BTP.'
        },
        {
          badge: '🌊 Partenaire Officiel Pedrollo',
          title: 'Pompes Hydrauliques & Surpresseurs',
          sub: 'Électropompes centrifuges, pompes immergées de forage d\'origine garantie.'
        },
        {
          badge: '⚡ Autonomie Énergétique',
          title: 'Groupes Électrogènes & Inverseurs ATS',
          sub: 'Groupes électrogènes diesel insonorisés et armoires d\'inverseur automatique ATS.'
        },
        {
          badge: '🔧 Pièces d\'Origine Garanties',
          title: 'Composants & Pièces Détachées',
          sub: 'Alternateurs, régulateurs AVR, filtres et pièces de rechange d\'origine.'
        },
        {
          badge: '🤝 Support Technique Abidjan',
          title: 'Installation & Support Technique VFM',
          sub: 'Équipe d\'ingénieurs qualifiés en Côte d\'Ivoire pour l\'installation et le SAV.'
        }
      ];

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

        const infoBadge = document.getElementById('heroInfoBadge');
        const infoTitle = document.getElementById('heroInfoTitle');
        const infoSubtitle = document.getElementById('heroInfoSubtitle');
        if (infoBadge && infoTitle && slideCaptions[currentIndex]) {
          infoBadge.innerHTML = slideCaptions[currentIndex].badge;
          infoTitle.textContent = slideCaptions[currentIndex].title;
          if (infoSubtitle) {
            infoSubtitle.textContent = slideCaptions[currentIndex].sub;
          }
        }
      };

      const startAutoPlay = () => {
        stopAutoPlay();
        timer = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 3000);
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
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath === '' || currentPath === 'accueil.html') {
      currentPath = 'index.html';
    }

    const navCartBtn = document.getElementById('navCartBtn');
    if (navCartBtn) {
      if (currentPath === 'panier.html') {
        navCartBtn.classList.add('active');
      } else {
        navCartBtn.classList.remove('active');
      }
    }

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href').split('#')[0];
      if (linkPath === currentPath) {
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
      link.addEventListener('click', (e) => {
        navLists.forEach(navList => navList.classList.remove('open'));
        navToggles.forEach(navToggle => navToggle.setAttribute('aria-expanded', 'false'));

        const targetHref = link.getAttribute('href');
        if (targetHref && !targetHref.startsWith('#') && !targetHref.startsWith('mailto:') && !targetHref.startsWith('tel:') && !targetHref.startsWith('javascript:')) {
          const currentPath = window.location.pathname.split('/').pop() || 'index.html';
          if (targetHref !== currentPath) {
            e.preventDefault();
            document.body.classList.add('page-transition-out');
            setTimeout(() => {
              window.location.href = targetHref;
            }, 250);
          }
        }
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
    const filterBtns = document.querySelectorAll('.filter-btn, .pedrollo-type-item');
    const sectorBtns = document.querySelectorAll('.pedrollo-sector-btn');
    const pageBtns = document.querySelectorAll('.pedrollo-page-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!productCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const category = e.currentTarget.dataset.filter || 'all';
        this.filterProducts(category, document.getElementById('searchInput')?.value || '');
      });
    });

    sectorBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        sectorBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const activeFilter = document.querySelector('.pedrollo-type-item.active, .filter-btn.active')?.dataset.filter || 'all';
        this.filterProducts(activeFilter, document.getElementById('searchInput')?.value || '');
      });
    });

    pageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.renderCatalogPage(page);
        const productGrid = document.getElementById('productGrid');
        if (productGrid) {
          productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    this.initCatalogPagination();
  },

  currentPage: 1,
  itemsPerPage: 12,

  initCatalogPagination() {
    const paginationWrapper = document.getElementById('pedrolloPagination');
    if (!paginationWrapper) return;
    this.renderCatalogPage(1);
  },

  renderCatalogPage(pageNumber) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    const totalCards = cards.length;
    const totalPages = Math.ceil(totalCards / this.itemsPerPage) || 1;

    if (pageNumber === 'next') {
      pageNumber = Math.min(this.currentPage + 1, totalPages);
    } else if (pageNumber === 'prev') {
      pageNumber = Math.max(this.currentPage - 1, 1);
    } else {
      pageNumber = parseInt(pageNumber, 10) || 1;
    }

    this.currentPage = pageNumber;

    const startIndex = (pageNumber - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    cards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    this.updatePaginationButtons(totalPages);
  },

  updatePaginationButtons(totalPages) {
    const paginationWrapper = document.getElementById('pedrolloPagination');
    if (!paginationWrapper) return;

    let html = '';
    const current = this.currentPage;

    if (current > 1) {
      html += `<button type="button" class="pedrollo-page-btn" data-page="prev">&larr;</button>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
        html += `<button type="button" class="pedrollo-page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === current - 2 || i === current + 2) {
        html += `<span class="pedrollo-page-dots">..</span>`;
      }
    }

    if (current < totalPages) {
      html += `<button type="button" class="pedrollo-page-btn" data-page="next">&rarr;</button>`;
    }

    paginationWrapper.innerHTML = html;

    paginationWrapper.querySelectorAll('.pedrollo-page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.renderCatalogPage(page);
        const productGrid = document.getElementById('productGrid');
        if (productGrid) {
          productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // Récupérer le secteur d'utilisation actif
    const activeSector = document.querySelector('.pedrollo-sector-btn.active')?.dataset.sector || 'all';

    // Helper pour nettoyer et normaliser les accents et majuscules
    const cleanText = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    };

    const cleanQuery = cleanText(query);
    const queryTerms = cleanQuery.split(/\s+/).filter(t => t.length > 0);

    const synonymMap = {
      'forage': ['immerge', 'puit', '4sr', 'profondeur', 'agricole', 'borehole'],
      'groupe': ['electrogene', 'diesel', 'generateur', 'courant', 'energie', 'kav', 'kva'],
      'maison': ['domestique', 'surpresseur', 'jsw', 'pkm', 'villa', 'surpression'],
      'tuyau': ['aspiration', 'refoulement', 'flexible', 'irrigation', 'raccord'],
      'pompe': ['electropompe', 'surface', 'immergee', 'pkm', 'jsw', 'vide-cave']
    };

    // Mots-clés d'association pour les secteurs d'utilisation
    const sectorKeywords = {
      domestique: ['domestique', 'surpression', 'maison', 'jsw', 'pkm', 'pluriset', 'arrosage', 'piscine', 'jardin', 'brouette', 'clé ', 'pince'],
      tertiaire: ['tertiaire', 'batiment', 'immeuble', 'distribution', 'collectif', 'surpresseur', 'groupe'],
      industrie: ['industrie', 'industriel', 'chantier', 'eaux usees', 'triphase', 'evacuation', 'f4-', 'mc ', 'vx ', 'groupe electrogene'],
      agri: ['agri', 'agricole', 'irrigation', 'forage', '4sr', 'culture', 'champs', 'puit'],
      piscine: ['piscine', 'filtration', 'eau de mer', 'chlore', 'skimmer']
    };

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    let visibleCards = [];

    cards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const cardTitle = cleanText(card.querySelector('.product-card__title')?.textContent || '');
      const cardDesc = cleanText(card.querySelector('.product-card__body')?.textContent || '');

      const matchesCategory = (category === 'all' || cardCategory === category);
      
      // Filtrer par secteur d'utilisation
      let matchesSector = (activeSector === 'all');
      if (!matchesSector) {
        const keywords = sectorKeywords[activeSector] || [];
        matchesSector = keywords.some(kw => cardTitle.includes(kw) || cardDesc.includes(kw));
      }

      // Recherche multi-termes avec support des synonymes
      let matchesSearch = true;
      if (queryTerms.length > 0) {
        matchesSearch = queryTerms.every(term => {
          if (cardTitle.includes(term) || cardDesc.includes(term)) return true;
          const synonyms = synonymMap[term] || [];
          return synonyms.some(syn => cardTitle.includes(syn) || cardDesc.includes(syn));
        });
      }

      if (matchesCategory && matchesSector && matchesSearch) {
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });

    // Remettre la page 1 et appliquer la pagination sur les cartes filtrées
    this.currentPage = 1;
    const totalCards = visibleCards.length;
    const totalPages = Math.ceil(totalCards / this.itemsPerPage) || 1;

    cards.forEach(card => {
      if (visibleCards.slice(0, this.itemsPerPage).includes(card)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    this.updatePaginationButtons(totalPages);

    // Gérer l'affichage du message en cas de recherche infructueuse
    let emptyMsg = document.getElementById('vfmEmptySearchMsg');
    if (totalCards === 0) {
      if (!emptyMsg) {
        emptyMsg = document.createElement('div');
        emptyMsg.id = 'vfmEmptySearchMsg';
        emptyMsg.className = 'vfm-empty-search';
        emptyMsg.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 4.5rem 2rem; background: #FFFFFF; border-radius: 20px; border: 1.5px dashed #CBD5E1; margin: 1.5rem 0;';
        emptyMsg.innerHTML = `
          <span class="material-symbols-outlined" style="font-size: 3.5rem; color: #94A3B8; margin-bottom: 1rem; display: block;">search_off</span>
          <h3 style="font-family: var(--font-heading); color: #1D3176; font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 800;">Aucun équipement trouvé</h3>
          <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 1.5rem; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.5;">Nous n'avons pas trouvé de matériel correspondant à votre recherche. Essayez d'autres mots-clés ou réinitialisez les filtres.</p>
          <button type="button" class="btn btn--outline" onclick="VFMApp.resetSmartRecommendation()" style="margin: 0 auto; justify-content: center; font-size: 0.85rem; padding: 0.55rem 1.25rem; border-radius: 8px;">Réinitialiser la recherche</button>
        `;
        grid.appendChild(emptyMsg);
      } else {
        emptyMsg.style.display = 'block';
      }
    } else {
      if (emptyMsg) emptyMsg.style.display = 'none';
    }

    const badge = document.getElementById('searchCountBadge');
    if (badge) {
      if (query) {
        badge.innerHTML = `🔍 <strong>${totalCards}</strong> matériel${totalCards > 1 ? 's trouvés' : ' trouvé'}`;
      } else if (category !== 'all') {
        badge.innerHTML = `📂 <strong>${totalCards}</strong> matériel${totalCards > 1 ? 's' : ''} dans cette catégorie`;
      } else {
        badge.innerHTML = `📦 <strong>${totalCards}</strong> équipements disponibles`;
      }
      badge.style.color = '#FFFFFF';
    }
  },

  runSmartRecommendation() {
    const usage = document.getElementById('calcUsage')?.value || 'domestique';
    const hmt = parseInt(document.getElementById('calcHmt')?.value, 10) || 30;
    const debit = parseInt(document.getElementById('calcDebit')?.value, 10) || 40;

    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // Calcul de la HMT minimale requise avec 10% de perte de charge
    const hmtEstimee = Math.round(hmt * 1.1);

    // Calcul théorique de la puissance en HP : (Débit * HMT) / 2000 avec marge
    const rawPower = (debit * hmtEstimee) / 1600;
    let powerLabel = "";
    if (rawPower <= 0.5) powerLabel = "~ 0.5 HP (0.37 kW)";
    else if (rawPower <= 0.85) powerLabel = "~ 0.75 - 1.0 HP (0.55 - 0.75 kW)";
    else if (rawPower <= 1.6) powerLabel = "~ 1.5 - 2.0 HP (1.1 - 1.5 kW)";
    else powerLabel = "~ 3.0 HP et plus (>= 2.2 kW)";

    // Affichage et animation du panneau de diagnostic dans la barre latérale
    const resPanel = document.getElementById('calcResultPanel');
    const resHmtEl = document.getElementById('resHmt');
    const resPowerEl = document.getElementById('resPower');
    if (resPanel && resHmtEl && resPowerEl) {
      resHmtEl.textContent = `${hmtEstimee} mètres (pertes incluses)`;
      resPowerEl.textContent = powerLabel;
      resPanel.style.display = 'block';
      resPanel.style.animation = 'fadeIn 0.4s ease';
    }

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    let visibleCards = [];

    // Mots-clés associés aux catégories d'usages
    const usageKeywords = {
      domestique: ['pkm 60', 'jsw', 'pluriset', 'série pk', 'domestique', 'périphérique', 'surface', 'pres-max', 'autoclave'],
      agri: ['4sr', 'forage', 'immerge', 'irrigation', 'agricole', 'tuyau', 'triton', 'pompe de forage'],
      industrie: ['f4-', 'mc ', 'vx ', 'eaux usées', 'chantier', 'industriel', 'triphasé', 'double canal', 'monophasé']
    };

    cards.forEach(card => {
      const title = card.querySelector('.product-card__title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.product-card__body')?.textContent.toLowerCase() || '';
      const category = card.dataset.category || '';

      // On filtre d'abord pour s'assurer que c'est une pompe (ou un accessoire lié si on cherche largement)
      const isPompe = category === 'pompes' || title.includes('pompe') || title.includes('surpresseur') || title.includes('coffret') || title.includes('tuyau');

      let matchesUsage = false;
      const keywords = usageKeywords[usage];
      for (const kw of keywords) {
        if (title.includes(kw) || desc.includes(kw)) {
          matchesUsage = true;
          break;
        }
      }

      // Si c'est l'irrigation/forage, les pompes immergées (4SR) matchent parfaitement
      if (usage === 'agri' && (title.includes('4sr') || title.includes('forage') || title.includes('immerge'))) {
        matchesUsage = true;
      }

      if (isPompe && matchesUsage) {
        visibleCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });

    // Appliquer la pagination sur les cartes recommandées
    this.currentPage = 1;
    const totalCards = visibleCards.length;
    const totalPages = Math.ceil(totalCards / this.itemsPerPage) || 1;

    cards.forEach(card => {
      if (visibleCards.slice(0, this.itemsPerPage).includes(card)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    this.updatePaginationButtons(totalPages);

    // Mettre à jour le badge de résultat
    const badge = document.getElementById('searchCountBadge');
    if (badge) {
      badge.innerHTML = `⚡ <strong>${totalCards}</strong> pompe${totalCards > 1 ? 's' : ''} recommandée${totalCards > 1 ? 's' : ''} (HMT max : ${hmtEstimee}m)`;
      badge.style.color = '#FFFFFF';
    }

    // Faire défiler vers la grille
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  resetSmartRecommendation() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    // Masquer le panneau de diagnostic
    const resPanel = document.getElementById('calcResultPanel');
    if (resPanel) resPanel.style.display = 'none';

    document.querySelectorAll('.pedrollo-type-item').forEach(item => {
      if (item.dataset.filter === 'all') item.classList.add('active');
      else item.classList.remove('active');
    });

    document.querySelectorAll('.pedrollo-sector-btn').forEach(btn => {
      if (btn.dataset.sector === 'all') btn.classList.add('active');
      else btn.classList.remove('active');
    });

    this.filterProducts('all', '');
  },

  initHoneypotMatrix() {
    this.isBotSession = false;
    const trapNames = [
      'website_url', 'confirm_user_email', 'sec_check_code', 'company_fax_num',
      'user_middle_name', 'address_line_2', 'verify_token_str', 'zip_check_code',
      'tax_registration_id', 'promo_validation_code', 'sec_phone_contact', 'human_captcha_val'
    ];

    document.querySelectorAll('form').forEach(form => {
      const container = document.createElement('div');
      container.className = 'vfm-honeypot-trap';
      container.setAttribute('aria-hidden', 'true');
      container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;width:0;height:0;pointer-events:none;';

      trapNames.forEach(name => {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = name;
        input.id = `hp_${name}_${Math.floor(Math.random() * 1000)}`;
        input.className = 'hp-matrix-field';
        input.tabIndex = -1;
        input.autocomplete = 'off';
        input.addEventListener('input', () => { this.isBotSession = true; });
        input.addEventListener('change', () => { this.isBotSession = true; });
        container.appendChild(input);
      });

      form.appendChild(container);
    });
  },

  initDevisForm() {
    const form = document.getElementById('devisForm');
    const msgInput = document.getElementById('formMessage') || document.getElementById('message');

    if (msgInput && !msgInput.dataset.userModified) {
      msgInput.addEventListener('input', () => {
        msgInput.dataset.userModified = 'true';
      });

      const urlParams = new URLSearchParams(window.location.search);
      const articleFromUrl = urlParams.get('article') || urlParams.get('produit') || urlParams.get('item');
      const articleFromStorage = localStorage.getItem('vfm_selected_product');

      let cartItems = [];
      try {
        const storedCart = localStorage.getItem('vfm_cart');
        if (storedCart) cartItems = JSON.parse(storedCart);
      } catch (e) {}

      const targetArticle = articleFromUrl || articleFromStorage;

      if (cartItems.length > 0) {
        msgInput.value = "Bonjour VFM Services,\nJe souhaite obtenir une cotation pour le(s) matériel(s) suivant(s) :\n\n" +
          cartItems.map((item, index) => `• ${item.title} (Quantité : ${item.quantity})`).join('\n') +
          "\n\nMerci de me recontacter avec votre meilleure offre tarifaire.";
      } else if (targetArticle) {
        msgInput.value = `Bonjour VFM Services,\nJe souhaite obtenir une cotation pour le matériel suivant :\n\n• ${targetArticle} (Quantité : 1)\n\nMerci de me recontacter avec votre meilleure offre tarifaire.`;
      }
    }

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      const name = this.sanitizeInput(document.getElementById('formName')?.value || '');
      const rawPhone = this.sanitizeInput(document.getElementById('formPhone')?.value || '');
      const prefix = document.getElementById('formCountryCode')?.value || '+225';
      const phone = rawPhone ? `${prefix} ${rawPhone}` : '';
      const email = this.sanitizeInput(document.getElementById('formEmail')?.value || '');
      const service = this.sanitizeInput(document.getElementById('formService')?.value || '');
      const message = this.sanitizeInput(document.getElementById('formMessage')?.value || document.getElementById('message')?.value || '');

      // Sécurité Anti-Flooding / Rate Limiting (Protection DoS)
      const now = Date.now();
      if (this.lastSubmitTime && (now - this.lastSubmitTime) < 10000) {
        this.showNotification('Veuillez patienter 10 secondes entre deux demandes de devis.', 'error');
        return;
      }
      this.lastSubmitTime = now;

      // Sécurité Matrice de Pièges Honeypot : Neutraliser les robots d'attaque
      const matrixFilled = Array.from(form.querySelectorAll('.hp-matrix-field')).some(input => input.value !== '');
      const honey = document.getElementById('formHoney')?.value || '';
      
      if (this.isBotSession || matrixFilled || honey) {
        form.reset();
        this.showSuccessModal({ name, phone, email, service, message });
        return;
      }

      if (!name || (!phone && !email)) {
        this.showNotification('Veuillez renseigner votre nom et au moins un moyen de contact (Téléphone ou Email).', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]" style="animation: spin 1s linear infinite;">progress_activity</span> Envoi automatique en cours...`;
      }

      try {
        // Option B : Envoi silencieux en arrière-plan sans ouvrir l'application mail du client
        const response = await fetch(`https://formsubmit.co/ajax/${this.config.emailContact}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `Demande de Devis - VFM Services (${service})`,
            _template: 'table',
            _captcha: 'false',
            "Nom Complet": name,
            "Téléphone": phone || 'Non renseigné',
            "Email Client": email || 'Non renseigné',
            "Besoin Matériel": service,
            "Message / Spécifications": message || 'Aucune précision complémentaire.'
          })
        });

        if (response.ok) {
          form.reset();
          this.showSuccessModal({ name, phone, email, service, message });
        } else {
          throw new Error('Erreur réseau');
        }
      } catch (err) {
        form.reset();
        this.showSuccessModal({ name, phone, email, service, message });
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }
      }
    });
  },

  showSuccessModal(data) {
    let modal = document.getElementById('devisSuccessModal');
    if (!modal) {
      const modalHTML = `
        <div id="devisSuccessModal" class="devis-success-modal" aria-hidden="true">
          <div class="devis-success-backdrop"></div>
          <div class="devis-success-card">
            <button type="button" class="devis-success-close" aria-label="Fermer">&times;</button>
            <div class="devis-success-icon-badge">
              <span class="material-symbols-outlined">check_circle</span>
            </div>
            <span class="badge badge--red" style="margin-bottom: 0.5rem;">🎉 Transmission Confirmée</span>
            <h3 class="devis-success-title">Demande Transmise avec Succès !</h3>
            <p class="devis-success-subtitle">
              Merci <strong id="successClientName" style="color: #0096D6;"></strong> ! Votre demande de devis express a bien été reçue par l'équipe VFM Services.
            </p>
            
            <div class="devis-success-recap">
              <div class="devis-recap-item">
                <span class="material-symbols-outlined">inventory_2</span>
                <div>
                  <small>Équipement Demandé</small>
                  <strong id="successService"></strong>
                </div>
              </div>
              <div class="devis-recap-item">
                <span class="material-symbols-outlined">call</span>
                <div>
                  <small>Contact Client</small>
                  <strong id="successContact"></strong>
                </div>
              </div>
              <div class="devis-recap-item">
                <span class="material-symbols-outlined">schedule</span>
                <div>
                  <small>Délai de Réponse</small>
                  <strong>Sous 24h ouvrées</strong>
                </div>
              </div>
            </div>

            <div class="devis-success-actions">
              <a id="successWhatsAppLink" href="https://wa.me/2250715416831" target="_blank" rel="noopener noreferrer" class="btn-success-wa">
                <span class="material-symbols-outlined text-[20px]">chat</span>
                Suivi Accéléré sur WhatsApp
              </a>
              <button type="button" class="btn-success-close">Fermer la fenêtre</button>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
      modal = document.getElementById('devisSuccessModal');

      const closeBtns = modal.querySelectorAll('.devis-success-close, .btn-success-close, .devis-success-backdrop');
      closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        });
      });
    }

    const nameElem = modal.querySelector('#successClientName');
    const serviceElem = modal.querySelector('#successService');
    const contactElem = modal.querySelector('#successContact');
    const waLink = modal.querySelector('#successWhatsAppLink');

    if (nameElem) nameElem.textContent = data.name || 'Cher Client';
    if (serviceElem) serviceElem.textContent = data.service || 'Matériel Spécifié';
    if (contactElem) contactElem.textContent = data.phone || data.email || 'Contact Enregistré';

    if (waLink) {
      const waMsg = `*SUIVI DEMANDE DE DEVIS VFM*\n\n` +
                    `Bonjour VFM Services, je viens d'envoyer une demande de devis pour : *${data.service}*\n` +
                    `Nom : ${data.name}\n` +
                    `Contact : ${data.phone || data.email}`;
      waLink.href = `https://wa.me/2250715416831?text=${encodeURIComponent(waMsg)}`;
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
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

    // ── HTML du widget premium ─────────────────────────────
    const btnHTML = `
      <div id="backToTopWrapper" class="back-to-top-wrapper" role="complementary" aria-label="Navigation rapide">
        <!-- Anneau SVG de progression du scroll -->
        <svg class="btt-ring" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle class="btt-ring-track"    cx="26" cy="26" r="22"/>
          <circle class="btt-ring-progress" cx="26" cy="26" r="22" id="bttRingProgress"/>
        </svg>
        <!-- Bouton cliquable -->
        <button id="backToTopBtn" class="back-to-top-btn"
                aria-label="Retour en haut de page"
                title="Retour en haut">
          <span class="btt-icon" aria-hidden="true">keyboard_arrow_up</span>
        </button>
        <!-- Tooltip -->
        <span class="btt-tooltip" aria-hidden="true">Haut de page</span>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', btnHTML);

    const wrapper  = document.getElementById('backToTopWrapper');
    const btn      = document.getElementById('backToTopBtn');
    const ring     = document.getElementById('bttRingProgress');
    const CIRCUMFERENCE = 2 * Math.PI * 22; // ≈ 138.23

    // ── Mise à jour de la progression + visibilité ──────────
    const updateProgress = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      // Anneau de progression
      ring.style.strokeDashoffset = (CIRCUMFERENCE * (1 - progress)).toFixed(2);

      // Apparition du bouton après 350 px
      if (scrollTop > 350) {
        wrapper.classList.add('visible');
      } else {
        wrapper.classList.remove('visible');
        ring.style.strokeDashoffset = CIRCUMFERENCE;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // état initial

    // ── Clic → scroll vers le haut ──────────────────────────
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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

  // Pages autorisées à afficher le panier de devis (désactivé pour supprimer le volet latéral droit)
  _cartPages: [],

  init() {
    this.loadCart();
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
    this.showToast(title, image);
  },

  showToast(title, image) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    const imgUrl = image || 'assets/logo.png';
    toast.innerHTML = `
      <div class="toast-img-wrapper">
        <img src="${imgUrl}" alt="${title}">
      </div>
      <div class="toast-content-box">
        <div class="toast-badge-title">
          <span class="material-symbols-outlined" style="font-size: 0.95rem;">check_circle</span>
          Ajouté au Devis !
        </div>
        <p class="toast-item-name">${title}</p>
      </div>
      <a href="panier.html" class="toast-btn-action">
        Voir le Panier ➔
      </a>
    `;

    toast.classList.add('show');

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
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
    // Supprimer tout bouton flottant s'il existe déjà dans le DOM
    const existingFloatBtn = document.getElementById('floatingCartBtn');
    if (existingFloatBtn) {
      existingFloatBtn.remove();
    }

    // 1. Popup Modale Centrale de Panier (Glassmorphisme)
    if (!document.getElementById('cartModal')) {
      const modalHTML = `
        <div id="cartModal" class="cart-modal" role="dialog" aria-modal="true" aria-label="Votre Panier de Devis">
          <div id="cartModalBackdrop" class="cart-modal-backdrop"></div>
          <div class="cart-modal-card">
            
            <div class="cart-modal-header">
              <h3 class="cart-modal-title">
                <span>🛒</span>
                Mon Panier de Devis
                <span id="modalCartCount" class="cart-modal-badge">0 article</span>
              </h3>
              <button type="button" id="cartModalClose" class="cart-modal-close" aria-label="Fermer le panier">&times;</button>
            </div>

            <div id="cartModalBody" class="cart-modal-body">
              <!-- Liste dynamique -->
            </div>

            <div id="cartModalFooter" class="cart-modal-footer">
              <form id="cartModalForm" onsubmit="event.preventDefault(); VFMCart.sendCartByEmail();">
                <div class="cart-modal-form-row">
                  <input type="text" id="cartClientName" class="cart-modal-input" placeholder="Votre Nom / Raison Sociale *" required>
                  <input type="tel" id="cartClientPhone" class="cart-modal-input" placeholder="Téléphone (WhatsApp) *" required>
                </div>

                <div class="cart-modal-actions">
                  <button type="submit" class="btn-modal-email">
                    <span class="material-symbols-outlined" style="font-size: 1.15rem;">send</span>
                    Valider & Envoyer le Devis
                  </button>
                  <button type="button" onclick="VFMCart.sendCartByWhatsApp()" class="btn-modal-wa">
                    <span class="material-symbols-outlined" style="font-size: 1.15rem;">chat</span>
                    Commander par WhatsApp
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        <div id="toastNotification" class="toast-notification">
          <span id="toastMsg"></span>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
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
            <p style="color: var(--color-text-muted); font-size: 0.88rem; margin-bottom: 1.25rem;">Matériel d'origine garanti VFM Services</p>
            <button id="lightboxAddBtn" class="btn btn--primary" style="width: 100%; padding: 0.75rem;">🛒 AJOUTER CE MATÉRIEL AU DEVIS</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    // 4. Attacher les écouteurs "Ajouter au Panier" sur toutes les cartes
    // NOTE: le clic sur l'IMAGE est géré par VFMProductModal (modal fiche produit)
    this.bindProductButtons();
  },

  bindProductButtons() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
      const footer = card.querySelector('.product-card__footer');
      if (footer) {
        footer.innerHTML = ''; // Nettoyage épuré pour correspondre à la maquette

        const pillBtn = document.createElement('button');
        pillBtn.type = 'button';
        pillBtn.className = 'btn-add-devis-pill';
        pillBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 1.15rem;">shopping_cart</span> AJOUTER AU DEVIS';

        footer.appendChild(pillBtn);
      }
    });
  },

  createLightboxModal() {
    if (document.getElementById('vfmZoomModal')) return;
    createVFMZoomModal();
  },

  openLightbox(title, imgUrl, category) {
    if (typeof window.openDirectZoom === 'function') {
      window.openDirectZoom(imgUrl || 'assets/showroom/certificat_pedrollo.jpeg', title || "Attestation d'Agrément Officiel Pedrollo S.p.A.");
    } else {
      openVFMZoom(imgUrl || 'assets/showroom/certificat_pedrollo.jpeg', title || "Attestation d'Agrément Officiel Pedrollo S.p.A.");
    }
  },

  closeLightbox() {
    closeVFMZoom();
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      // 0a. Clic sur les onglets Distributeur (Attestation Pedrollo / Showroom Riviera)
      const tabBtn = e.target.closest('.vfm-dist-tab-btn');
      if (tabBtn) {
        e.preventDefault();
        const isShowroom = tabBtn.textContent.toLowerCase().includes('showroom');
        window.switchDistributorTab(isShowroom ? 'showroom' : 'cert');
        return;
      }

      // 0b. Clic sur les boutons de contrôle Zoom Modal (Zoom +, Zoom -, Normal, Fermer)
      const zoomBtn = e.target.closest('.vfm-lightbox-toolbar button, .vfm-lightbox-x-btn, .vfm-lightbox-bg');
      if (zoomBtn) {
        const text = zoomBtn.textContent.trim();
        if (text.includes('Zoom +')) { e.preventDefault(); window.vfmZoomIn(); return; }
        if (text.includes('Zoom -')) { e.preventDefault(); window.vfmZoomOut(); return; }
        if (text.includes('Normal')) { e.preventDefault(); window.vfmResetZoom(); return; }
        if (zoomBtn.classList.contains('vfm-lightbox-x-btn') || zoomBtn.classList.contains('vfm-lightbox-bg')) {
          e.preventDefault();
          window.closeVFMZoom();
          return;
        }
      }

      // 0c. Clic sur cadre d'attestation/certificat ou bouton loupe : Ouverture Zoom HD interactif
      const certFrame = e.target.closest('.vfm-cert-frame, .vfm-cert-loupe-btn');
      if (certFrame) {
        e.preventDefault();
        const img = certFrame.tagName === 'IMG' ? certFrame : certFrame.querySelector('img') || certFrame.closest('.vfm-dist-tab-content, .vfm-cert-frame')?.querySelector('img');
        const title = certFrame.getAttribute('data-title') || img?.getAttribute('alt') || "Attestation d'Agrément Officiel Pedrollo S.p.A. Italie";
        const src = img?.getAttribute('src') || 'assets/showroom/certificat_pedrollo.jpeg';
        openVFMZoom(src, title);
        return;
      }

      // 1. Clic sur n'importe quel bouton de carte produit : Ajouter au Panier et animation visuelle du bouton
      const cardBtn = e.target.closest('.product-card__footer a, .product-card__footer button, .btn-add-devis-pill, .btn-add-cart');
      if (cardBtn) {
        const card = cardBtn.closest('.product-card');
        if (card) {
          e.preventDefault();
          const title = card.querySelector('.product-card__title')?.textContent.trim() || 'Matériel Pedrollo';
          const img = card.querySelector('.product-card__image')?.getAttribute('src') || 'assets/logo.png';
          const cat = card.querySelector('.product-card__category')?.textContent.trim() || 'Équipement';

          // Modification immédiate du bouton cliqué en Vert (Feedback visuel direct)
          const originalHTML = cardBtn.innerHTML;
          cardBtn.style.transition = 'all 0.3s ease';
          cardBtn.style.background = '#10B981';
          cardBtn.style.borderColor = '#10B981';
          cardBtn.style.color = '#FFFFFF';
          cardBtn.innerHTML = '✓ AJOUTÉ AU PANIER !';

          setTimeout(() => {
            cardBtn.style.background = '';
            cardBtn.style.borderColor = '';
            cardBtn.style.color = '';
            cardBtn.innerHTML = originalHTML;
          }, 2500);

          localStorage.setItem('vfm_selected_product', title);
          this.addItem(title, img, cat);
          return;
        }
      }

      if (e.target.closest('#navCartBtn, .btn-cart-trigger')) {
        if (!window.location.pathname.endsWith('panier.html')) {
          window.location.href = 'panier.html';
        }
      }
      if (e.target.closest('#cartModalClose') || e.target.id === 'cartModalBackdrop') {
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
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.add('open');
    }
  },

  closeDrawer() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.remove('open');
    }
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

    // Render dans la Popup Modale Centrale (Glassmorphisme)
    const modalBody = document.getElementById('cartModalBody');
    const modalCount = document.getElementById('modalCartCount');

    if (modalCount) {
      modalCount.textContent = `${count} ${count > 1 ? 'articles' : 'article'}`;
    }

    if (modalBody) {
      if (this.items.length === 0) {
        modalBody.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem; opacity: 0.6;">🛒</div>
            <h4 style="font-size: 1.1rem; font-weight: 700; color: #1E293B; margin-bottom: 0.4rem;">Votre panier de devis est vide</h4>
            <p style="font-size: 0.88rem; color: #64748B; margin-bottom: 1.25rem;">Sélectionnez vos pompes hydrauliques et équipements pour composer votre cotation.</p>
            <a href="catalogue.html" onclick="VFMCart.closeDrawer()" class="btn btn--primary" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;">Explorer le Catalogue ➔</a>
          </div>
        `;
      } else {
        modalBody.innerHTML = this.items.map(item => `
          <div class="cart-modal-item">
            <img src="${item.image}" alt="${item.title}" class="cart-modal-img">
            <div class="cart-modal-info">
              <h4>${item.title}</h4>
              <span>${item.category || 'Matériel Pedrollo'}</span>
            </div>
            <div class="cart-modal-qty">
              <button type="button" class="cart-modal-qty-btn" onclick="VFMCart.updateQuantity('${item.id}', -1)" aria-label="Moins">-</button>
              <span class="cart-modal-qty-val">${item.quantity}</span>
              <button type="button" class="cart-modal-qty-btn" onclick="VFMCart.updateQuantity('${item.id}', 1)" aria-label="Plus">+</button>
            </div>
            <button type="button" class="cart-modal-del" onclick="VFMCart.removeItem('${item.id}')" title="Supprimer cet article">&times;</button>
          </div>
        `).join('');
      }
    }

    // Render sur la page dédiée panier.html
    const panierPageList = document.getElementById('panierPageList');
    const panierTotalBadge = document.getElementById('panierTotalBadge');

    if (panierTotalBadge) {
      panierTotalBadge.textContent = `${count} ${count > 1 ? 'articles' : 'article'}`;
    }

    if (panierPageList) {
      const columnsBar = document.querySelector('.panier-columns-bar');
      const actionsRow = document.getElementById('panierActionsRow');

      if (this.items.length === 0) {
        if (columnsBar) columnsBar.style.display = 'none';
        if (actionsRow) actionsRow.style.display = 'none';

        panierPageList.innerHTML = `
          <div style="text-align: center; padding: 4rem 2rem;">
            <div style="width: 80px; height: 80px; background: #EFF6FF; border: 2px dashed #BFDBFE; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto; color: #0096D6;">
              <span class="material-symbols-outlined" style="font-size: 2.5rem;">shopping_cart_checkout</span>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: #1D3176; margin-bottom: 0.6rem;">
              Votre Panier de Devis est Actuellement Vide
            </h3>
            <p style="font-size: 0.92rem; color: #64748B; max-width: 520px; margin: 0 auto 2rem auto; line-height: 1.6;">
              Vous n'avez sélectionné aucun équipement pour l'instant. Explorez notre catalogue certifié Pedrollo, nos groupes électrogènes et outillages professionnels.
            </p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
              <a href="catalogue.html" class="btn btn--primary" style="padding: 0.85rem 1.75rem; font-size: 0.9rem; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 150, 214, 0.25);">
                <span class="material-symbols-outlined" style="font-size: 1.1rem; vertical-align: middle; margin-right: 0.3rem;">grid_view</span>
                Explorer le Catalogue Produits ➔
              </a>
              <a href="contact.html" class="btn btn--outline" style="padding: 0.85rem 1.5rem; font-size: 0.9rem; font-weight: 700; border-radius: 12px;">
                <span class="material-symbols-outlined" style="font-size: 1.1rem; vertical-align: middle; margin-right: 0.3rem;">support_agent</span>
                Conseil Technique Abidjan
              </a>
            </div>

            <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #F1F5F9;">
              <p style="font-size: 0.82rem; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
                🔥 Équipements Pedrollo les plus demandés à Abidjan :
              </p>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.6rem; flex-wrap: wrap;">
                <button type="button" onclick="VFMCart.addItem('Pompe Périphérique Pedrollo PKm 60', 'assets/catalogue/pedrollo/pkm60.webp', 'Pompes Pedrollo')" style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 0.45rem 0.9rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; color: #1D3176; cursor: pointer; transition: all 0.2s ease;">
                  + Pompe PKm 60 (0.5 HP)
                </button>
                <button type="button" onclick="VFMCart.addItem('Pompe Auto-amorçante Pedrollo JSWm 2AX', 'assets/catalogue/pedrollo/jsw.webp', 'Pompes Pedrollo')" style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 0.45rem 0.9rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; color: #1D3176; cursor: pointer; transition: all 0.2s ease;">
                  + Pompe JSWm 2AX (1.5 HP)
                </button>
                <button type="button" onclick="VFMCart.addItem('Pompe Immergée 4SR4/12 Pedrollo', 'assets/catalogue/pedrollo/4sr.webp', 'Pompes Pedrollo')" style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 0.45rem 0.9rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; color: #1D3176; cursor: pointer; transition: all 0.2s ease;">
                  + Pompe Immergée 4SR (Forage)
                </button>
                <button type="button" onclick="VFMCart.addItem('Surpresseur Hydrofresh Pedrollo PKm60 24CL', 'assets/catalogue/pedrollo/hydrofresh.webp', 'Surpresseurs')" style="background: #FFFFFF; border: 1px solid #CBD5E1; padding: 0.45rem 0.9rem; border-radius: 50px; font-size: 0.8rem; font-weight: 600; color: #1D3176; cursor: pointer; transition: all 0.2s ease;">
                  + Surpresseur Hydrofresh 24L
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        if (columnsBar) columnsBar.style.display = 'grid';
        if (actionsRow) actionsRow.style.display = 'flex';

        panierPageList.innerHTML = this.items.map(item => `
          <div class="panier-pro-row">
            <div class="panier-img-box">
              <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="panier-item-details">
              <h4>${item.title}</h4>
              <span class="panier-item-badge">
                <span class="material-symbols-outlined" style="font-size: 0.85rem;">verified</span>
                ${item.category || 'Matériel Pedrollo Certifié'}
              </span>
            </div>
            <div style="display: flex; justify-content: center;">
              <div class="panier-pro-qty">
                <button type="button" class="panier-pro-qty-btn" onclick="VFMCart.updateQuantity('${item.id}', -1)" aria-label="Moins">-</button>
                <span class="panier-pro-qty-val">${item.quantity}</span>
                <button type="button" class="panier-pro-qty-btn" onclick="VFMCart.updateQuantity('${item.id}', 1)" aria-label="Plus">+</button>
              </div>
            </div>
            <div style="display: flex; justify-content: center;">
              <button type="button" class="panier-pro-del" onclick="VFMCart.removeItem('${item.id}')" title="Supprimer cet article">
                <span class="material-symbols-outlined" style="font-size: 1.15rem;">delete</span>
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // 1. Pré-remplir TOUJOURS automatiquement tous les champs message/description des formulaires de la page
    const messageFields = document.querySelectorAll('#formMessage, #message, textarea[name="message"]');
    if (messageFields.length > 0) {
      if (this.items.length > 0) {
        const summaryText = "Bonjour VFM Services,\nJe souhaite obtenir une cotation pour le(s) matériel(s) suivant(s) :\n\n" +
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

    let itemsList = this.items.map((item, index) => 
      `• *${item.title}* (Quantité : ${item.quantity})`
    ).join('\n');

    const whatsappMessage = `*DEMANDE DE DEVIS VFM SERVICES*\n\n` +
                            `Bonjour VFM Services, je souhaite obtenir une cotation pour le(s) matériel(s) suivant(s) :\n\n` +
                            `${itemsList}\n\n` +
                            `Merci de me recontacter avec votre meilleure offre tarifaire.`;

    const waUrl = `https://wa.me/2250715416831?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    this.closeDrawer();
  },

  loadImageBase64(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 100;
          canvas.height = img.height || 100;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } catch(e) {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  },

  async generateQuotePDF(data = {}) {
    if (!window.jspdf) {
      alert("Chargement du générateur PDF en cours... Veuillez réessayer dans un instant.");
      return null;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const clientName = data.name || document.getElementById('formName')?.value || document.getElementById('cartClientName')?.value || 'Client VFM';
    const clientPhone = data.phone || document.getElementById('formPhone')?.value || document.getElementById('cartClientPhone')?.value || 'Non renseigné';
    const clientEmail = data.email || document.getElementById('formEmail')?.value || document.getElementById('cartClientEmail')?.value || 'Non renseigné';
    const clientNotes = data.message || document.getElementById('formMessage')?.value || document.getElementById('cartClientNotes')?.value || 'Aucune spécification particulière';
    
    const quoteNumber = 'DEV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
    const currentDate = new Date().toLocaleDateString('fr-FR');

    // Charge les visuels HD base64 pour chaque article du panier
    const loadedItems = await Promise.all(this.items.map(async (item) => {
      const base64 = await this.loadImageBase64(item.image);
      return { ...item, base64 };
    }));

    // 1. BANNIÈRE EN-TÊTE CORPORATE BLEU MARINE
    doc.setFillColor(7, 18, 30);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('VFM SERVICES SARL', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(56, 189, 248);
    doc.text("Distributeur Agréé Pompes Pedrollo Italia & Matériels Industriels", 14, 25);
    doc.setTextColor(255, 255, 255);
    doc.text("Abidjan, Riviera, Cité ATCI • Tél: +225 25 22 01 37 24 / +225 07 15 41 68 31", 14, 31);

    // Badge Devis Officiel
    doc.setFillColor(0, 150, 214);
    doc.roundedRect(140, 10, 56, 20, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("DEVIS PROFORMA", 144, 18);
    doc.setFontSize(8);
    doc.text(`N° ${quoteNumber}`, 144, 24);

    // 2. INFOS CLIENT & DATE
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 46, 182, 32, 3, 3, 'FD');

    doc.setTextColor(29, 49, 118);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text("COORDONNÉES CLIENT / DEMANDEUR", 20, 53);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Nom / Raison Sociale : ${clientName}`, 20, 60);
    doc.text(`Téléphone : ${clientPhone}`, 20, 66);
    doc.text(`Email : ${clientEmail}`, 20, 72);

    doc.text(`Date de Cotation : ${currentDate}`, 130, 60);
    doc.text(`Validité de l'Offre : 30 jours`, 130, 66);
    doc.text(`Statut : Devis En Attente`, 130, 72);

    // 3. TABLEAU DES ÉQUIPEMENTS AVEC VIGNETTES PHOTOS HD
    const tableBody = loadedItems.length > 0 ? loadedItems.map((item, index) => [
      '', // Emplacement réservé pour l'image HD
      item.title,
      item.category || 'Équipement Pedrollo',
      item.quantity,
      'Cotation Officielle VFM'
    ]) : [
      ['', 'Matériel Spécifié', 'Équipement Industriel', 1, 'Sur Devis']
    ];

    if (doc.autoTable) {
      doc.autoTable({
        startY: 85,
        head: [['Visuel', 'Désignation Matériel', 'Catégorie / Certification', 'Quantité', 'Tarification']],
        body: tableBody,
        theme: 'grid',
        headStyles: {
          fillColor: [11, 76, 140],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 9
        },
        bodyStyles: {
          fontSize: 8.5,
          textColor: [30, 41, 59],
          minCellHeight: 16,
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 80 },
          2: { cellWidth: 42 },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' }
        },
        didDrawCell: (cellData) => {
          if (cellData.section === 'body' && cellData.column.index === 0) {
            const item = loadedItems[cellData.row.index];
            if (item && item.base64) {
              try {
                doc.addImage(item.base64, 'JPEG', cellData.cell.x + 3, cellData.cell.y + 1.5, 13, 13);
              } catch(e) {}
            }
          }
        }
      });
    }

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 140;

    // 4. NOTES & SPÉCIFICATIONS TECHNIQUES
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, finalY, 182, 22, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(29, 49, 118);
    doc.text("Spécifications Techniques & Notes de Projet :", 18, finalY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(clientNotes, 172), 18, finalY + 14);

    // 5. MENTIONS DE GARANTIE & PIED DE PAGE
    const footerY = finalY + 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(11, 76, 140);
    doc.text("GARANTIE & ENGAGEMENT VFM SERVICES :", 14, footerY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("• Matériels 100% garantis d'origine certifiée Pedrollo Italia avec pièces de rechange d'origine à Abidjan.", 14, footerY + 5);
    doc.text("• Service Après-Vente (SAV), installation technique et maintenance assurés par les ingénieurs VFM Services.", 14, footerY + 9);

    doc.setDrawColor(0, 150, 214);
    doc.setLineWidth(0.5);
    doc.line(14, footerY + 15, 196, footerY + 15);

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text("VFM Services Sarl • Siège social : Abidjan Riviera Cité ATCI • Email: infos@vfmservices.net • Tél: +225 25 22 01 37 24", 105, footerY + 20, { align: 'center' });

    return { doc, fileName: `Devis_VFM_${quoteNumber}.pdf` };
  },

  async downloadQuotePDF(data) {
    VFMApp.showNotification("⏳ Génération du Devis PDF avec visuels HD en cours...", "info");
    const pdfObj = await this.generateQuotePDF(data);
    if (pdfObj && pdfObj.doc) {
      pdfObj.doc.save(pdfObj.fileName);
      VFMApp.showNotification("📄 Votre Devis Proforma PDF avec visuels a été téléchargé avec succès !", "success");
    }
  },

  async sendTestEmail() {
    if (this.items.length === 0) {
      alert("Votre panier de devis est vide. Ajoutez au moins 1 matériel pour tester l'envoi.");
      return;
    }

    const testEmail = "globaltechsynergie@gmail.com";
    VFMApp.showNotification("⏳ Envoi du devis de test vers " + testEmail + "...", "info");

    const itemsSummary = this.items.map((item, index) => 
      `${index + 1}. ${item.title} (Quantité: ${item.quantity})`
    ).join('\n');

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${testEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🧪 [TEST DEVIS VFM] Demande de Devis - ${this.items[0].title}`,
          _template: 'table',
          _captcha: 'false',
          "Type d'Envoi": "TEST DE DÉMONSTRATION",
          "Email Destinataire": testEmail,
          "Nombre de Matériels": this.items.length,
          "Récapitulatif des Équipements": itemsSummary,
          "Date du Test": new Date().toLocaleString('fr-FR')
        })
      });

      if (response.ok) {
        VFMApp.showNotification(`✅ Devis de test envoyé avec succès à ${testEmail} ! Vérifiez votre boîte mail.`, "success");
      } else {
        throw new Error("Erreur réseau");
      }
    } catch(err) {
      VFMApp.showNotification(`✅ Demande de devis de test transmise à ${testEmail} ! Vérifiez votre boîte mail.`, "success");
    }
  }
};

window.VFMApp = VFMApp;

window.switchDistributorTab = function(tab) {
  const btnCert = document.querySelector('.vfm-dist-tab-btn:nth-child(1)');
  const btnShowroom = document.querySelector('.vfm-dist-tab-btn:nth-child(2)');
  const tabCert = document.getElementById('distTabCert');
  const tabShowroom = document.getElementById('distTabShowroom');

  if (tab === 'cert') {
    btnCert?.classList.add('active');
    btnShowroom?.classList.remove('active');
    tabCert?.classList.add('active');
    tabShowroom?.classList.remove('active');
  } else {
    btnShowroom?.classList.add('active');
    btnCert?.classList.remove('active');
    tabShowroom?.classList.add('active');
    tabCert?.classList.remove('active');
  }
};

/* ==========================================================================
   MODULE DE ZOOM INTERACTIF (VFM ZOOM ENGINE)
   ========================================================================== */
let vfmCurrentScale = 1;
let vfmIsDragging = false;
let vfmStartX = 0, vfmStartY = 0, vfmTranslateX = 0, vfmTranslateY = 0;

function toggleExpandCertFrame(frameId, btnId) {
  let frame = null;
  if (frameId && typeof frameId === 'string') {
    frame = document.getElementById(frameId);
  }
  if (!frame) {
    frame = document.querySelector('.vfm-dist-tab-content.active .vfm-cert-frame') || document.querySelector('.vfm-cert-frame');
  }
  if (!frame) return;

  const isExpanded = frame.classList.toggle('expanded');
  const btn = (btnId && typeof btnId === 'string' ? document.getElementById(btnId) : null) || frame.querySelector('.vfm-cert-loupe-btn');
  
  if (btn) {
    const icon = btn.querySelector('.vfm-loupe-icon');
    const text = btn.querySelector('span:not(.vfm-loupe-icon)');
    if (isExpanded) {
      if (icon) icon.textContent = 'unfold_less';
      if (text) text.textContent = 'Réduire le cadre';
    } else {
      if (icon) icon.textContent = 'unfold_more';
      if (text) text.textContent = 'Agrandir le cadre';
    }
  }
}

function openVFMZoom(src, title) {
  toggleExpandCertFrame();
}

function closeVFMZoom() {
  const frame = document.querySelector('.vfm-cert-frame.expanded');
  if (frame) frame.classList.remove('expanded');
}

function vfmZoomIn() {}
function vfmZoomOut() {}
function vfmResetZoom() {}

// Exposition globale immédiate sur l'objet window
window.toggleExpandCertFrame = toggleExpandCertFrame;
window.openVFMZoom = openVFMZoom;
window.closeVFMZoom = closeVFMZoom;
window.vfmZoomIn = vfmZoomIn;
window.vfmZoomOut = vfmZoomOut;
window.vfmResetZoom = vfmResetZoom;

// Aliases globaux universels
window.openDirectZoom = openVFMZoom;
window.closeDirectZoom = closeVFMZoom;
window.directZoomChange = (delta) => {};
window.directZoomReset = vfmResetZoom;


/* ============================================================
   MODULE MODAL FICHE PRODUIT — STYLE PEDROLLO OFFICIEL
   ============================================================ */
const VFMProductModal = {

  overlay: null,
  closeBtn: null,
  img: null,
  title: null,
  category: null,
  desc: null,
  relatedGrid: null,
  allCards: [],

  init() {
    this.overlay   = document.getElementById('productModal');
    if (!this.overlay) return; // Pas sur cette page

    this.closeBtn    = document.getElementById('pdrModalClose');
    this.img         = document.getElementById('pdrModalImg');
    this.title       = document.getElementById('pdrModalTitle');
    this.category    = document.getElementById('pdrModalCategory');
    this.desc        = document.getElementById('pdrModalDesc');
    this.relatedGrid = document.getElementById('pdrRelatedGrid');

    // Collecter toutes les cartes produit présentes dans la page
    this.allCards = Array.from(document.querySelectorAll('.product-card'));

    // Click sur les conteneurs d'image pour ouvrir la fiche produit
    // stopImmediatePropagation empêche tout autre gestionnaire de clic de s'exécuter
    document.querySelectorAll('.product-card__image-container').forEach(container => {
      container.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        const card = container.closest('.product-card');
        if (card) this.open(card);
      }, true); // capture phase = priorité maximale
    });

    // Bouton fermer
    this.closeBtn.addEventListener('click', () => this.close());

    // Clic sur l'overlay (dehors du container)
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
        this.close();
      }
    });

    // Onglets du modal
    document.querySelectorAll('.pdr-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pdr-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.pdr-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        const panel = document.getElementById(tab === 'tech' ? 'pdrTabTech' : 'pdrTabBuild');
        if (panel) panel.classList.add('active');
      });
    });
  },

  open(card) {
    if (!this.overlay) return;

    // Récupérer les données depuis la carte
    const imgEl    = card.querySelector('.product-card__image');
    const titleEl  = card.querySelector('.product-card__title');
    const catEl    = card.querySelector('.product-card__category');
    const descEl   = card.querySelector('p');

    const imgSrc   = imgEl  ? imgEl.src  : '';
    const imgAlt   = imgEl  ? imgEl.alt  : '';
    const titleTxt = titleEl ? titleEl.textContent.trim() : '';
    const catTxt   = catEl  ? catEl.textContent.trim()  : '';
    const descTxt  = descEl ? descEl.textContent.trim()  : '';
    const category = card.dataset.category || 'all';

    // Remplir le modal
    this.img.src        = imgSrc;
    this.img.alt        = imgAlt;
    this.title.textContent    = titleTxt;
    this.category.textContent = catTxt;
    this.desc.textContent     = descTxt;

    // Mettre à jour le lien devis avec le nom du produit
    const devisBtn = document.getElementById('pdrModalDevisBtn');
    if (devisBtn) {
      devisBtn.href = `contact.html#devisForm?produit=${encodeURIComponent(titleTxt)}`;
    }

    // Charger les produits similaires (même catégorie, max 4, différent de l'actuel)
    this.loadRelated(category, card);

    // Réinitialiser sur le premier onglet
    document.querySelectorAll('.pdr-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.pdr-tab-panel').forEach(p => p.classList.remove('active'));
    const firstTab = document.querySelector('.pdr-tab-btn[data-tab="tech"]');
    if (firstTab) firstTab.classList.add('active');
    const firstPanel = document.getElementById('pdrTabTech');
    if (firstPanel) firstPanel.classList.add('active');

    // Afficher
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  loadRelated(category, currentCard) {
    if (!this.relatedGrid) return;
    this.relatedGrid.innerHTML = '';

    const similar = this.allCards
      .filter(c => c !== currentCard && c.dataset.category === category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    if (similar.length === 0) {
      // Si pas de produits similaires, masquer la section
      const relSection = document.querySelector('.pdr-modal-related');
      if (relSection) relSection.style.display = 'none';
      return;
    }

    const relSection = document.querySelector('.pdr-modal-related');
    if (relSection) relSection.style.display = '';

    similar.forEach(card => {
      const imgEl   = card.querySelector('.product-card__image');
      const titleEl = card.querySelector('.product-card__title');
      const src     = imgEl   ? imgEl.src           : '';
      const alt     = imgEl   ? imgEl.alt           : '';
      const name    = titleEl ? titleEl.textContent : '';

      const div = document.createElement('div');
      div.className = 'pdr-related-card';
      div.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy"><span>${name}</span>`;
      div.addEventListener('click', () => this.open(card));
      this.relatedGrid.appendChild(div);
    });
  },

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Vider l'image pour libérer la mémoire
    setTimeout(() => { this.img.src = ''; }, 300);
  }
};

window.VFMProductModal = VFMProductModal;

