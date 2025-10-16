# Profile Aggregator API

API REST développée avec Node.js pour agréger des données de profils utilisateurs depuis plusieurs sources et générer des données dérivées à forte valeur ajoutée (Dark Data).

---

## 🚀 Installation et Démarrage

1.  **Installer les dépendances :**
    ```bash
    npm install
    ```

2.  **Lancer le serveur :**
    ```bash
    npm start
    ```
    L'API est ensuite accessible à l'adresse `http://localhost:3000`.

3.  **Lancer en mode développement (avec rechargement automatique) :**
    ```bash
    npm run dev
    ```

---

## 📡 Endpoints de l'API

### Profils

* `GET /api/profiles/full`  
    Retourne un profil utilisateur complet, agrégé depuis 5 sources de données externes (infos utilisateur, téléphone, IBAN, carte bancaire et une blague).

* `GET /api/profiles/user`  
    Retourne uniquement les informations de base de l'utilisateur (nom, email, âge).

* `GET /api/profiles/batch/:count`  
    Génère un lot de profils complets (ex: `/api/profiles/batch/5`). Le maximum est de 10.

### Données Dérivées (Dark Data)

Ces endpoints fournissent des analyses qui ne sont pas présentes dans les données brutes.

* `GET /api/darkdata/stats`  
    Calcule et retourne des statistiques de performance sur les appels aux sources de données (taux de succès, erreurs par source, etc.).

* `GET /api/darkdata/risk-score`  
    Analyse un profil pour calculer un score de risque financier (0-100) basé sur l'âge, la validité de l'IBAN et le type de carte bancaire.

* `GET /api/darkdata/demographics`  
    Génère une analyse démographique sur un échantillon de 10 profils pour identifier des tendances (répartition par genre, tranches d'âge, types de cartes).

* `GET /api/darkdata/predictive`  
    Utilise un modèle simple pour prédire des indicateurs comportementaux comme la propension d'achat, la fidélité et le risque de départ (churn).

---

## 🛠️ Stack Technique

* **Runtime :** Node.js
* **Framework :** Express
* **Modules :** ES Modules (`.mjs`)
* **Client HTTP :** `node-fetch` pour les requêtes asynchrones