# 🚀 Cursor Prompt Expert — Back-Office Dashboard BLASIRA

> **Contexte projet :** Blasira est une plateforme de covoiturage communautaire pour étudiants et particuliers au Mali (Bamako). Le back-office sert aux administrateurs pour gérer utilisateurs, trajets, incidents, notifications et KPIs.

---

## PROMPT PRINCIPAL (coller dans Cursor Composer)

```
Tu es un expert développeur Frontend spécialisé en dashboards admin modernes.
Je veux restructurer entièrement le back-office de BLASIRA, une plateforme 
de covoiturage communautaire (Mali). Voici les règles strictes à suivre :

## 🎨 DESIGN SYSTEM — Blasira Admin

### Palette de couleurs
- Primary : #1A56DB (bleu Blasira)
- Secondary : #7E3AF2 (violet accent)
- Success : #0E9F6E (vert validation)
- Warning : #FF5A1F (orange alertes)
- Danger : #F05252 (rouge incidents)
- Background : #F9FAFB (gris très clair)
- Sidebar bg : #111827 (dark navy)
- Card bg : #FFFFFF
- Text primary : #111827
- Text muted : #6B7280

### Typography
- Font: Inter (Google Fonts)
- Titres dashboard : font-semibold, tracking-tight
- Labels : text-sm, text-gray-500
- Valeurs KPI : text-3xl font-bold

### Style général
- Design moderne "glass morphism" léger sur les KPI cards
- Sidebar dark avec icônes Lucide React
- Arrondis : rounded-xl sur les cards, rounded-2xl sur les modals
- Ombres : shadow-sm sur les cards, shadow-lg sur les modals
- Transitions : transition-all duration-200

---

## 📁 STRUCTURE DE FICHIERS À CRÉER

```
src/
├── components/
│   ├── layout/
│   │   ├── AdminLayout.jsx          # Layout principal avec sidebar + topbar
│   │   ├── Sidebar.jsx              # Navigation latérale dark
│   │   ├── TopBar.jsx               # Barre supérieure avec recherche + avatar
│   │   └── BreadCrumb.jsx           # Fil d'Ariane
│   ├── ui/
│   │   ├── KpiCard.jsx              # Carte KPI réutilisable
│   │   ├── StatusBadge.jsx          # Badge statut (actif, suspendu, vérifié...)
│   │   ├── DataTable.jsx            # Tableau data avec tri, pagination, search
│   │   ├── Modal.jsx                # Modal réutilisable
│   │   ├── ConfirmDialog.jsx        # Dialog de confirmation (actions critiques)
│   │   ├── Avatar.jsx               # Avatar utilisateur avec fallback initiales
│   │   ├── Skeleton.jsx             # Loading skeleton
│   │   └── EmptyState.jsx           # État vide avec illustration
│   ├── charts/
│   │   ├── ActivityChart.jsx        # Graphe activité (recharts LineChart)
│   │   ├── TripsMapChart.jsx        # Carte des trajets populaires (recharts)
│   │   └── UserGrowthChart.jsx      # Courbe croissance utilisateurs
│   └── features/
│       ├── users/
│       │   ├── UserTable.jsx
│       │   ├── UserDetailDrawer.jsx
│       │   └── UserFilters.jsx
│       ├── trips/
│       │   ├── TripTable.jsx
│       │   ├── TripDetailModal.jsx
│       │   └── TripFilters.jsx
│       ├── incidents/
│       │   ├── IncidentList.jsx
│       │   └── IncidentDetailModal.jsx
│       └── notifications/
│           ├── NotificationComposer.jsx
│           └── NotificationHistory.jsx
├── pages/
│   ├── Dashboard.jsx                # Page principale avec KPIs
│   ├── Users.jsx                    # Gestion utilisateurs
│   ├── Trips.jsx                    # Modération trajets
│   ├── Incidents.jsx                # Incidents signalés
│   ├── Notifications.jsx            # Envoi notifications
│   └── Settings.jsx                 # Paramètres admin
├── hooks/
│   ├── useUsers.js                  # Hook fetch + mutations utilisateurs
│   ├── useTrips.js
│   ├── useIncidents.js
│   └── usePagination.js
├── services/
│   ├── api.js                       # Instance axios avec interceptors
│   ├── usersService.js
│   ├── tripsService.js
│   └── incidentsService.js
├── store/
│   └── adminStore.js                # Zustand ou Context global
└── utils/
    ├── formatters.js                # formatDate, formatPrice, formatPhone
    └── constants.js                 # STATUS, ROLES, TRIP_TYPES
```

---

## 🧩 COMPOSANTS CLÉS — IMPLÉMENTATION DÉTAILLÉE

### 1. AdminLayout.jsx
```jsx
// Layout principal : sidebar fixe dark (w-64) + contenu scrollable
// Sidebar collapsible sur mobile (hamburger)
// TopBar sticky avec : recherche globale, cloche notifications, avatar admin
// Utiliser React Router v6 pour la navigation
// Active link highlighting dans la sidebar
```

### 2. KpiCard.jsx
```jsx
// Props : title, value, change (%), icon, color, isLoading
// Design : fond blanc, bordure gauche colorée (4px), icône dans cercle coloré
// Afficher la variation (▲ +12% vs mois dernier) en vert/rouge
// Animation count-up au chargement (react-countup ou CSS)
// Skeleton loader si isLoading = true
```

### 3. DataTable.jsx
```jsx
// Props : columns, data, isLoading, onRowClick, actions
// Features : 
//   - Tri par colonne (asc/desc)
//   - Recherche inline
//   - Pagination (10/25/50 par page)
//   - Sélection multiple avec bulk actions
//   - Export CSV
//   - Skeleton rows pendant le chargement
// Utiliser @tanstack/react-table v8
```

### 4. StatusBadge.jsx
```jsx
// Statuts possibles :
const STATUSES = {
  active: { label: 'Actif', color: 'green' },
  suspended: { label: 'Suspendu', color: 'red' },
  pending: { label: 'En attente', color: 'yellow' },
  verified: { label: 'Vérifié', color: 'blue' },
  student: { label: 'Étudiant vérifié', color: 'purple' },
  driver: { label: 'Conducteur confirmé', color: 'indigo' },
}
// Style : pill arrondi, point coloré animé (pulse) pour "actif"
```

---

## 📊 PAGE DASHBOARD — Spécifications complètes

### KPIs à afficher (ligne 1)
1. **Utilisateurs totaux** — avec croissance vs mois dernier
2. **Trajets actifs** — trajets en cours aujourd'hui
3. **Réservations du jour** — confirmées / en attente
4. **Incidents non résolus** — badge rouge si > 5

### Graphiques (ligne 2)
- Graphe LineChart : activité des 30 derniers jours (trajets + réservations)
- BarChart : répartition par type (moto vs voiture)
- DonutChart : statuts utilisateurs (actifs, inactifs, suspendus)

### Tableaux récents (ligne 3)
- 5 derniers utilisateurs inscrits
- 5 derniers incidents signalés (avec priorité)

### Layout Grid
```
[KPI 1] [KPI 2] [KPI 3] [KPI 4]     ← grid-cols-4
[   LineChart (70%)   ] [DonutChart] ← grid-cols-3
[ Derniers users ] [ Derniers incidents ] ← grid-cols-2
```

---

## 👥 PAGE GESTION UTILISATEURS

### Filtres disponibles
- Statut : Tous / Actifs / Suspendus / En attente de vérification
- Rôle : Conducteur / Passager / Les deux
- Badge : Étudiant vérifié / Conducteur confirmé
- Date d'inscription : range picker
- Recherche : nom, email, téléphone

### Colonnes du tableau
| Avatar | Nom | Email | Téléphone | Badge | Statut | Trajets | Inscription | Actions |

### Actions par utilisateur
- 👁️ Voir le profil complet (drawer latéral)
- ✅ Vérifier / Valider le compte
- 🚫 Suspendre temporairement
- 🗑️ Supprimer définitivement (avec confirmation)
- 📧 Envoyer un message direct

### UserDetailDrawer
- Photo de profil + nom + badges
- Stats : trajets effectués, note moyenne, signalements reçus
- Historique des trajets (liste scrollable)
- Timeline des actions admin (suspension, vérification...)
- Boutons d'action rapide

---

## 🚗 PAGE MODÉRATION TRAJETS

### Filtres
- Statut : Actif / Terminé / Annulé / Signalé
- Type : Moto / Voiture
- Ville / Quartier départ-arrivée
- Date : aujourd'hui / cette semaine / custom range
- Prix : range slider

### Colonnes
| Conducteur | Départ → Arrivée | Date/Heure | Type | Places | Prix | Réservations | Statut | Actions |

### Actions
- Voir détails complets
- Annuler un trajet (avec notification auto au conducteur)
- Signaler comme suspect
- Voir le conducteur associé

---

## 🚨 PAGE INCIDENTS

### Vue Kanban OU Liste avec filtres par sévérité
```
Colonnes Kanban :
[Nouveau 🔴] → [En cours 🟡] → [Résolu 🟢] → [Archivé ⚫]
```

### Types d'incidents
- Comportement inapproprié
- Retard / No-show
- Fraude
- Problème de paiement
- Autre

### Card incident inclut
- Reporter + Signalé (avatars)
- Type + Description courte
- Trajet associé
- Date signalement
- Priorité (Faible / Moyenne / Haute / Critique)
- Bouton "Traiter" → modal de résolution

---

## 🔔 PAGE NOTIFICATIONS

### Composer de notification
- Cible : Tous / Conducteurs / Passagers / Utilisateurs spécifiques (multiselect)
- Type : Push / Email / SMS
- Titre + Corps du message
- Programmation : Maintenant / Date précise
- Aperçu temps réel du rendu

### Historique
- Tableau : Date, Cible, Type, Taux ouverture, Statut
- Filtres par type et statut

---

## ⚙️ BONNES PRATIQUES DE CODE — OBLIGATOIRES

### Architecture
- Utiliser des custom hooks pour toute la logique API (useUsers, useTrips...)
- Services séparés pour les appels API (services/usersService.js)
- Zustand pour le state global (sidebar open/closed, notifications count...)
- React Query (TanStack Query) pour le cache + fetching + mutations

### Performance
- React.memo sur les composants lourds (DataTable, Charts)
- useMemo pour les données filtrées/triées
- useCallback pour les handlers passés en props
- Lazy loading des pages avec React.lazy + Suspense
- Virtualisation si liste > 100 items (react-virtual)

### UX / Accessibilité
- Loading states sur TOUTES les actions async (boutons avec spinner)
- Toast notifications pour toutes les actions (react-hot-toast)
- Confirmation dialog pour les actions destructives
- Gestion d'erreurs avec messages explicites (pas de "Error 500")
- Keyboard navigation (Tab, Enter, Escape)
- aria-labels sur tous les éléments interactifs
- Focus trap dans les modals

### Code Quality
- TypeScript si le projet le supporte (types pour User, Trip, Incident)
- PropTypes obligatoires si JavaScript
- Nommer les handlers : handleSubmit, handleDelete, handleStatusChange
- Extraire les constantes : STATUS_LABELS, TRIP_TYPES, ROLES
- Commentaires JSDoc sur les composants réutilisables

---

## 📦 DÉPENDANCES À INSTALLER

```bash
npm install @tanstack/react-table @tanstack/react-query
npm install recharts
npm install zustand
npm install react-hot-toast
npm install lucide-react
npm install date-fns
npm install axios
npm install react-router-dom
npm install @headlessui/react
npm install clsx tailwind-merge
```

---

## 🎯 ORDRE DE DÉVELOPPEMENT RECOMMANDÉ

1. **AdminLayout + Sidebar + TopBar** (structure de base)
2. **Design System** (KpiCard, StatusBadge, Avatar, Skeleton)
3. **Dashboard page** (KPIs + Charts avec data mockée)
4. **DataTable générique** (réutilisé dans toutes les pages)
5. **Page Users** (la plus importante pour les admins)
6. **Page Trips** (modération)
7. **Page Incidents** (kanban ou liste)
8. **Page Notifications** (composer)
9. **Branchement API réelle** (remplacer les mocks)
10. **Tests + Polish** (animations, responsive, a11y)

---

## 🌍 SPÉCIFICITÉS LOCALES (Mali)

- Affichage des prix en **FCFA** (ex: `15 000 FCFA`)
- Formats de téléphone malien : `+223 XX XX XX XX`
- Villes fréquentes : Bamako, Sikasso, Kayes, Mopti, Segou
- Quartiers Bamako : Badalabougou, ACI 2000, Hamdallaye, Magnambougou...
- Universitées : USTTB, FSEG, FMPOS, IUG...
- Heure : UTC+0 (pas de décalage)
- Support futur : Bambara (prévoir i18n avec react-i18next)

---

## ✅ CHECKLIST FINALE

- [ ] Sidebar responsive (collapsible mobile)
- [ ] Toutes les pages ont un état de chargement
- [ ] Toutes les pages ont un état vide (EmptyState)
- [ ] Actions destructives ont une confirmation
- [ ] Toasts pour les actions utilisateur
- [ ] Tableau avec pagination + recherche + tri
- [ ] KPIs avec variation mensuelle
- [ ] Graphiques avec tooltips et légendes
- [ ] Filtres persistants (URL params ou localStorage)
- [ ] Thème cohérent sur toutes les pages
```

---

## 💡 TIPS CURSOR

- **Utilise Composer** (Cmd+I) avec ce prompt complet
- **Référence les fichiers** existants avec `@fichier` pour que Cursor les prenne en compte
- **Génère page par page** : commence par `@AdminLayout` puis `@Dashboard`
- **Active "Include codebase"** pour que Cursor respecte ta structure existante
- **Utilise `/generate`** pour chaque composant UI individuellement si besoin

---

*Prompt créé pour le projet Blasira — Plateforme de covoiturage communautaire, Mali 🇲🇱*