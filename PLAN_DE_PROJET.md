# Feuille de Route du Projet : VFM Services (Multi-Pages)

Ce document détaille l'ensemble des étapes, du démarrage jusqu'à la mise en production du site web professionnel **Multi-Pages** de **VFM Services** (Pompes hydrauliques Pedrollo, Groupes électrogènes & Outillage).

---

## 🎯 Architecture du Projet (Multi-Pages)
Le site est structuré autour de pages dédiées interconnectées :

- [x] **`index.html` / `accueil.html`** : Page d'accueil principale avec présentation de VFM Services et mise en avant de la marque phare **Pedrollo**.
- [x] **`apropos.html`** : Page À Propos (Présentation de la direction avec `assets/directrice.jpeg`, valeurs, engagement qualité).
- [x] **`catalogue.html`** : Page Catalogue Produit avec barre de recherche en direct et filtres par catégories.
- [x] **`produit.html`** : Fiche Produit détaillée avec galerie, caractéristiques techniques et demande de devis express.
- [x] **`panier.html`** : Gestionnaire de panier de devis dynamique.
- [x] **`Nos Realisations.html`** : Journal vidéo des 14 arrivages d'Italie avec lecteur modale cinéma réactif et scroll automatique.
- [x] **`contact.html`** : Page Contact & Demande de Devis (WhatsApp API direct, envoi simultané à `infos@vfmservices.net` et en CC à la gérante `virginie.konan@vfmservices.net`, géolocalisation Riviera ATCI).

---

## 🎨 Styles & Scripts
- [x] **`css/styles.css`** : Design System centralisé (Variables HSL, accélération GPU 60 FPS, responsive mobile-first).
- [x] **`accueil.css`**, **`apropos.css`**, **`catalogue.css`**, **`contact.css`** : Feuilles de styles spécifiques par page.
- [x] **`js/app.js`** & **`js/app.min.js`** : Navigation dynamique, panier, modales vidéo, sanitization XSS (OWASP).

---

## 🔍 ULTRA CODE REVIEW & Qualité (PROJET 100% FINALISÉ & PRÊT)
- [x] Conforme OWASP (Sanitization XSS, protection anti-spam Honeypot, liens sécurisés `rel="noopener noreferrer"`).
- [x] SEO & Accessibilité (WCAG 2.1 AA, JSON-LD Schema.org LocalBusiness).
- [x] Performance & Fluidité Ultra 60 FPS (Accélération GPU, `preload="none"` sur les médias).
