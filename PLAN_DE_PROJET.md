# Feuille de Route du Projet : VFM Services (Multi-Pages)

Ce document détaille l'ensemble des étapes, du démarrage jusqu'à la mise en production du site web professionnel **Multi-Pages** de **VFM Services** (Pompes hydrauliques Pedrollo, Groupes électrogènes & Outillage).

---

## 🎯 Architecture du Projet (Multi-Pages)
Le site est structuré autour de pages dédiées interconnectées :

- [x] **`index.html` / `accueil.html`** : Page d'accueil principale avec présentation de VFM Services et mise en avant de la marque phare **Pedrollo**.
- [x] **`apropos.html`** : Page À Propos (Présentation de la direction avec `assets/directrice.jpeg`, valeurs, engagement qualité).
- [x] **`catalogue.html`** : Page Catalogue Produit avec barre de recherche en direct et filtres par catégories.
- [x] **`contact.html`** : Page Contact & Demande de Devis sur-mesure (WhatsApp API direct, coordonnées d'Abidjan Cocody Faya).

---

## 🎨 Styles & Scripts
- [x] **`css/styles.css`** : Design System centralisé (Variables HSL, BEM, responsive mobile-first).
- [x] **`accueil.css`**, **`apropos.css`**, **`catalogue.css`**, **`contact.css`** : Feuilles de styles spécifiques par page.
- [x] **`js/app.js`** : Navigation active dynamique, recherche en direct, menu burger, sanitization XSS (OWASP).

---

## 🔍 ULTRA CODE REVIEW & Qualité
- [x] Conforme OWASP (Sanitization XSS, liens sécurisés).
- [x] SEO & Accessibilité (WCAG 2.1 AA, JSON-LD Schema.org LocalBusiness).
- [x] Performance & Responsive Mobile-First (Design Stripe/Apple Grade).
