
# Cahier de charge - Système de calcul de consommation d’électricité

## 1. Informations générales

* **Nom du projet :** EcoTrack
* **Objectif :** Créer un système qui permet de recueillir les données et calculer la consommation d'électricité pour 10 compteurs, gérer les périodes et les prix fixes, permettre à l’admin de suivre les statistiques via un tableau de bord.
* **Version :** 1.0
* **Date de début :** 04/12/2025

---

## 2. Contexte du projet

Ce projet s’inscrit dans le cadre de l’optimisation de la gestion énergétique.
Chaque centre dispose d’un compteur électrique, et le système permettra de centraliser les données pour un suivi précis de la consommation et des coûts.

---

## 3. Parties prenantes

### **1. Superviseur :**

* Peut consulter toutes les données.
* Peut ajouter, modifier et supprimer les utilisateurs et techniciens.
* Suivi des utilisateurs et techniciens.
* Visualisation des statistiques et rapports.
* Gestion des utilisateurs et rôles.
* Calcul automatique de la consommation d’électricité pour chaque compteur.
* Calcul du coût selon la période et le prix fixé.
* Visualisation des statistiques et graphiques.
* Export des données en Excel ou PDF.
* Savoir quel technicien a saisi les données.
* Gestion des prix par période.
* Chaque période dans la tableaux contient trois colonnes :

  * **Consommation du période actuelle**
  * **Consommation calculée** (consommation = consommation_actuelle - consommation_période_précédente)
  * **Prix à payer** (consommation × prix_unitaire)

### **2. Technicien :**

* Saisit les données de consommation d’électricité.
* Remplit les valeurs pour la période définie.

### **3. Utilisateur :**

* Visualisation des données.

---

## 4. Objectifs spécifiques

* Automatiser le calcul de la consommation et du coût.
* Éviter les erreurs manuelles dans le suivi des compteurs.
* Générer des rapports et statistiques mensuelles.

---

## 5. Exigences non-fonctionnelles (qualité)

* **Performance :** Les graphiques doivent se charger en moins de 5 secondes.
* **Sécurité :** Les données doivent être protégées par JWT et chiffrées.
* **Accessibilité :** Interface responsive (mobile & desktop).

---

## 6. Périodes temporelles

* **Période 1 :** de 8h à 17h
* **Période 2 :** de 17h à 22h
* **Période 3 :** de 22h à 8h

Chaque période possède un **prix fixe** appliqué à la consommation enregistrée.

---

## 7. Exigences techniques

* **Frontend :** Next.js + Shadcn UI
* **Backend :** Node.js + Express.js + MongoDB
* **Rapports :** Graphiques ou tableaux statistiques
* **Sécurité :** Authentification via JWT
* **Stockage :** MongoDB pour toutes les données

---

## 8. UML et Documentation

* **Diagramme de classes :**

    ```typescript
      `User`: {
          id: ObjectId,
          nom: string,
          prenom: string,
          numero: string,
          password: string,
          role: enum("admin", "technicien", "utilisateur")
      }

      `Meter`: {
          id: ObjectId,
          nom: string,              // Exemple : "Chambre froide", "Clim Terrasse"
          localisation: string,     // Exemple : "RDC", "Mezzanine"
      }

      `ConsumptionRecord`: {
          id: ObjectId,
          meter_id: ObjectId,           // Référence au compteur concerné
          utilisateur: ObjectId,        // Référence au technicien
          date: Date,                   // Date et Temps du saisie
          consommation_actuelle: number,
          consommation_precedente: number,
          consommation_calculee: number, // automatique : actuelle - précédente
          prix_unitaire: number,         // lié à la période
          montant_total: number          // consommation_calculee * prix_unitaire
      }

      `Period`: {
          id: ObjectId,
          nom: string,              // Exemple : "Période 1"
          prix: number,
          heure_debut: string,      // "08:00"
          heure_fin: string         // "17:00"
      }
    ```

* **Diagramme de séquence :**

  * Processus de saisie des données par le technicien et calcul automatique traité par l’admin.

* **Rôles et permissions :**

  * **Admin :** CRUD complet sur toutes les données.
  * **Technician :** Ajout et modification de ses propres données uniquement.
  * **Utilisateur :** Visualisation des données.

---

## 10. Remarques

* Le système doit être flexible pour modifier les **prix des périodes** à tout moment.
* L’application doit garantir une traçabilité complète de toutes les saisies effectuées.

---

## 11. Conclusion

Ce projet vise à offrir un système centralisé de gestion de la consommation d’électricité pour plusieurs centres, garantissant un suivi précis, une facturation automatique et une analyse efficace des coûts énergétiques.

## meter names

from 1er to 8er
chambre froid
RDC(re de chause)
mezianine
clim teras
cuisine RDC
clim mezianine
choufrie
C.G (compteur general)
General 1
General 2
General 3
