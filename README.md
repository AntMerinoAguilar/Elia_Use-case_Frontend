# 🚀 eDuty - Interface Utilisateur pour la Gestion des Shifts

## 📌 Introduction

L'interface frontend de **eDuty** permet aux agents de **visualiser et gérer leurs shifts**, **échanger leurs horaires**, **suivre leurs demandes en temps réel** et **visualiser leur balance des shifts**.

L'application offre plusieurs fonctionnalités clés :

- **Authentification sécurisée** avec identifiants administrés
- **Affichage d'un calendrier collectif** des shifts sur plusieurs semaines
- **Création et gestion des demandes d'échange et de remplacement**
- **Système de notifications en temps réel**
- **Affichage de la balance des shifts des agents**
- **Interface ergonomique et intuitive** pour une gestion simplifiée

## 💻 Déploiement

L'application est accessible à l'adresse suivante :

**URL du frontend** : `https://eduty-groupe2.vercel.app/`

---

## 📌 Technologies utilisées

- **Framework** : React.js
- **Gestion des requêtes API** : Fetch / Axios
- **Gestion de l'état** : Context API / useState
- **Styles** : CSS et CSS inline
- **UI Components** : Material-UI (@mui/material, @mui/icons-material)
- **Gestion des dates** : Moment.js / Moment Timezone
- **Calendrier** : React Big Calendar
- **Icônes** : Lucide React
- **Déploiement** : Vercel

---

## 📌 Fonctionnalités principales

### 🔑 Authentification

- **Connexion** avec un username et un mot de passe (générés par l'administrateur).
- **Redirection automatique** après connexion vers le calendrier collectif.
- **Stockage sécurisé du token d'authentification** (cookies/httpOnly).

### 📅 Calendrier Collectif

- **Affichage dynamique des shifts** des agents.
- **Affichage des shifts de 6 employés simultanément**.
- **Navigation** pour consulter les semaines suivantes/précédentes.
- **Possibilité de changer le format d'affichage** : vue mois, semaine ou jour.
- **Les shifts sont cliquables** : en cliquant sur un shift, l'agent peut voir les **informations de l'agent assigné**, ainsi que la **date de début et de fin du shift**.

### 🔄 Gestion des demandes de modification d'horaires

- **Création d'une demande** d'swap, de remplacement ou de remplacement urgent.
- **Affichage des demandes disponibles** sous forme de cartes stylisées.
- **Modal interactive** permettant d'accepter une demande.
- **Sélection dynamique d'un shift en échange dans le cas d’un swap**.
- **Mise à jour en temps réel** après acceptation.
- **Possibilité de supprimer ses propres demandes**, ce qui les supprime **pour tout le monde**.

### 📊 Balance des shifts

- **Affichage de la balance des shifts** de tous les agents dans la **balance globale**.
- **Les agents peuvent visualiser leur propre balance des shifts** dans leur profil.
- **Mise à jour dynamique** en fonction des échanges et modifications.

### 🔔 Notifications

- **Réception de notifications en temps réel** pour chaque création de demande de remplacement, de remplacement urgent, de swap public, ou de swap destiné spécifiquement à l'agent.
- **Accès direct** à la page correspondante en cliquant sur la notification, facilitant ainsi le suivi des demandes.
- **Notifications pour les créateurs de demandes** : les agents qui ont soumis une demande reçoivent une notification dès qu'un autre agent accepte leur demande.
- **Les notifications se marquent comme lues** automatiquement dès que l'agent clique dessus.

---

## 📌 Installation et lancement en local

### 1️⃣ Prérequis

- Node.js installé (`>=16.0` recommandé)
- Un accès à l'API backend de **eDuty**

### 2️⃣ Cloner le projet

```sh
git clone https://github.com/AntMerinoAguilar/Elia_Use-case_Frontend.git
cd Elia_Use-case_Frontend
```

### 3️⃣ Installer les dépendances

```sh
npm install
```

### 4️⃣ Configurer les variables d'environnement

Créer un fichier `.env` à la racine et ajouter :

```env
VITE_API_URL=http://localhost:3000/api
```

### 5️⃣ Lancer l'application

```sh
npm run dev
```

L'application sera disponible sur `https://eduty-groupe2.vercel.app/`.

---

## 📌 Structure du projet

```
/src
 ├── assets      # Fichiers statiques (images, icônes, etc.)
 ├── components  # Composants réutilisables et UI(boutons, modals, formulaires, navigation, etc.)
 ├── config      # Fichiers de configuration de l'application
 ├── context     # Gestion de l'état global avec Context API
 ├── pages       # Pages principales de l'application (authentification, calendrier, échanges, profil, notifications, etc.)
 ├── styles      # Fichiers CSS
 ├── App.jsx     # Composant racine de l'application
 ├── main.jsx    # Point d'entrée principal
```

---

## 🗺️📈 Roadmap (features à implémenter)

### 🔍 **Filtres avancés sur les demandes de changement**
Amélioration de l'interface des demandes de changement avec des filtres permettant une gestion plus précise et rapide des demandes.

### 🎨 **Amélioration de l'UI (ergonomie & CSS)**  
Optimisation de l'**expérience utilisateur** pour rendre l'application plus fluide et intuitive.

### ⛔ **Restriction des demandes de changement**   
Implémentation d’une restriction empêchant les agents de soumettre une demande de changement pour un shift déjà passé.

### 🔄 **Amélioration du swap**   
- Lorsqu’un agent accepte une demande de swap, la **date de fin** du shift qu'il propose en échange sera **automatiquement** ajustée pour correspondre à la **durée** du shift proposé par l'agent émetteur de cet échange.  
- Exemple : l'agent émetteur veut échanger du 10 au 12 (2 jours), alors la sélection du shift en retour doit automatiquement ajuster la date de fin pour qu'elle couvre la même durée. C'est-à-dire que si l'agent qui accepte ce swap, sélectionne son shift du 23 au 30 et qu'à l'intérieur de ce shift il veut échanger à partir du 25, la date de fin sera **automatiquement** définie au 27.

### 📜 **Historique des changements de shifts**   
Ajout d’une **section historique** permettant aux agents de consulter et suivre les changements de shifts passés. Un suivi détaillé des échanges sera accessible à tout moment.

### 📲 **Intégration de Toastify pour les alertes**   
Ajout de **Toastify** pour afficher des alertes de manière élégante et non intrusive. Les utilisateurs pourront recevoir des alertes de succès, d'erreur ou d'information avec des animations et des styles personnalisables, améliorant ainsi l’expérience utilisateur et la réactivité de l'application.

---

## 🌐 Lien vers le dépôt Backend

Le projet backend associé est disponible sur GitHub :

[🔗 Elia Use-case Backend](https://github.com/AntMerinoAguilar/Elia_Use-case_Backend)

🌟 **eDuty - Une interface moderne et intuitive pour gérer vos shifts !** 🚀\
📧 **Contactez-nous pour toute question ou amélioration !**
