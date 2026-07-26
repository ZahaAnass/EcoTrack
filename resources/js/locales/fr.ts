// French dictionary — keys are the English source strings.
// French is the primary language of EcoTrack.
export const fr: Record<string, string> = {
    // ── Navigation & chrome ──
    Platform: 'Plateforme',
    Dashboard: 'Tableau de bord',
    Approvals: 'Validations',
    Meters: 'Compteurs',
    'Tariff periods': 'Périodes tarifaires',
    Users: 'Utilisateurs',
    Reports: 'Rapports',
    Simulator: 'Simulateur',
    'New reading': 'Nouveau relevé',
    'My entries': 'Mes relevés',
    History: 'Historique',
    Settings: 'Paramètres',
    Notifications: 'Notifications',
    'Mark all as read': 'Tout marquer comme lu',
    'Nothing here yet — new activity will show up in this bell.':
        'Rien pour le moment — la nouvelle activité apparaîtra dans cette cloche.',

    // ── Common words ──
    Actions: 'Actions',
    Active: 'Actif',
    Inactive: 'Inactif',
    Amount: 'Montant',
    Cancel: 'Annuler',
    Clear: 'Effacer',
    Columns: 'Colonnes',
    'Show columns': 'Afficher les colonnes',
    Consumption: 'Consommation',
    Current: 'Actuel',
    Date: 'Date',
    Delete: 'Supprimer',
    Edit: 'Modifier',
    Electricity: 'Électricité',
    electricity: 'électricité',
    Email: 'E-mail',
    Location: 'Emplacement',
    Meter: 'Compteur',
    Name: 'Nom',
    Next: 'Suivant',
    Previous: 'Précédent',
    Password: 'Mot de passe',
    Pending: 'En attente',
    Approved: 'Validé',
    Rejected: 'Rejeté',
    Period: 'Période',
    Preview: 'Aperçu',
    Reading: 'Relevé',
    Readings: 'Relevés',
    readings: 'relevés',
    Reason: 'Motif',
    Result: 'Résultat',
    Role: 'Rôle',
    'Serial number': 'N° de série',
    'No serial': 'Sans n° de série',
    'No location': 'Sans emplacement',
    Status: 'Statut',
    Summary: 'Résumé',
    Technician: 'Technicien',
    Technicians: 'Techniciens',
    'Unit price': 'Prix unitaire',
    Used: 'Consommé',
    Utility: 'Type',
    Water: 'Eau',
    water: 'eau',
    Joined: 'Inscrit le',
    Accounts: 'Comptes',
    '(you)': '(vous)',
    'View all': 'Voir tout',
    'Save changes': 'Enregistrer',
    Admin: 'Admin',
    Viewer: 'Observateur',
    Back: 'Retour',
    'Log in': 'Se connecter',
    'Get started': 'Commencer',
    Features: 'Fonctionnalités',
    'How it works': 'Comment ça marche',
    Roles: 'Rôles',

    // ── Pagination / tables ──
    'Showing :from to :to of :total results':
        'Affichage de :from à :to sur :total résultats',
    'No results found': 'Aucun résultat trouvé',
    'No readings found': 'Aucun relevé trouvé',
    'Try changing the filters, or check back later.':
        'Modifiez les filtres ou revenez plus tard.',

    // ── Filters ──
    'All meters': 'Tous les compteurs',
    'All periods': 'Toutes les périodes',
    'All statuses': 'Tous les statuts',
    'All utilities': 'Tous les types',
    'All time': 'Toute la période',
    Today: "Aujourd'hui",
    'This week': 'Cette semaine',
    'This month': 'Ce mois-ci',
    'This year': 'Cette année',
    'Time range': 'Plage de temps',
    'From date': 'Date de début',
    'To date': 'Date de fin',
    'Search by meter name or serial…': 'Rechercher par nom ou n° de série…',
    'Search by name or email…': 'Rechercher par nom ou e-mail…',
    'Search by name, serial or location…':
        'Rechercher par nom, n° de série ou emplacement…',
    'Search meter, serial or technician…':
        'Rechercher compteur, n° de série ou technicien…',
    'Try a different search, or add a new user.':
        'Essayez une autre recherche ou ajoutez un utilisateur.',

    // ── Dashboards ──
    'Admin Dashboard': 'Tableau de bord admin',
    'Technician Dashboard': 'Tableau de bord technicien',
    'Facility overview': "Vue d'ensemble du site",
    'Consumption overview': "Vue d'ensemble de la consommation",
    'Field readings': 'Relevés terrain',
    ':count readings waiting for your approval.':
        ':count relevés attendent votre validation.',
    'All readings reviewed — nothing waiting on you.':
        'Tous les relevés sont traités — rien en attente.',
    ':count readings in total': ':count relevés au total',
    ':count active meters are waiting on you.':
        ':count compteurs actifs vous attendent.',
    'Review queue': "File d'attente",
    'Pending approval': 'En attente de validation',
    'Pending review': 'En attente de revue',
    'Electricity this month': 'Électricité ce mois-ci',
    'Water this month': 'Eau ce mois-ci',
    'Billed this month': 'Facturé ce mois-ci',
    'Cost this month': 'Coût ce mois-ci',
    'Active meters': 'Compteurs actifs',
    'Waiting for approval': 'En attente de validation',
    'Queue is clear': "La file d'attente est vide",
    'New readings from technicians will appear here for review.':
        'Les nouveaux relevés des techniciens apparaîtront ici pour revue.',
    'Electricity — last 30 days (kWh)': 'Électricité — 30 derniers jours (kWh)',
    'Water — last 30 days (m³)': 'Eau — 30 derniers jours (m³)',
    'Recent readings': 'Relevés récents',
    'Recent approved readings': 'Relevés validés récents',
    'Latest entries': 'Derniers relevés',
    'View history': "Voir l'historique",
    'Validated readings across the facility, updated as admins approve them.':
        'Relevés validés du site, mis à jour au fil des validations.',
    'No readings yet': 'Aucun relevé pour le moment',
    'Record your first meter reading to get started.':
        'Enregistrez votre premier relevé pour commencer.',
    'Nothing approved yet': 'Rien de validé pour le moment',
    'Approved readings will show up here as soon as an admin validates them.':
        'Les relevés validés apparaîtront ici dès validation par un admin.',

    // ── Approvals ──
    'Readings & approvals': 'Relevés & validations',
    'Review technician readings — approved values become billing history.':
        'Vérifiez les relevés des techniciens — les valeurs validées deviennent l’historique de facturation.',
    All: 'Tous',
    Approve: 'Valider',
    Reject: 'Rejeter',
    'Reject this reading?': 'Rejeter ce relevé ?',
    ':meter — :value :unit, recorded by :technician. They will see your reason and can correct and resubmit.':
        ':meter — :value :unit, enregistré par :technician. Il verra votre motif et pourra corriger puis resoumettre.',
    'Reason (optional)': 'Motif (facultatif)',
    'e.g. Value does not match the meter photo':
        'ex. La valeur ne correspond pas à la photo du compteur',
    'Reject reading': 'Rejeter le relevé',
    'a technician': 'un technicien',
    'View reading': 'Voir le relevé',
    'Reading detail': 'Détail du relevé',
    'Delete this reading?': 'Supprimer ce relevé ?',
    'This cannot be undone.': 'Cette action est irréversible.',
    'Delete reading': 'Supprimer le relevé',
    'Edit reading': 'Modifier le relevé',
    'Back to history': "Retour à l'historique",
    'Reading history': 'Historique des relevés',
    'All approved readings, newest first.':
        'Tous les relevés validés, du plus récent au plus ancien.',
    'Open reports': 'Ouvrir les rapports',
    'Reading date': 'Date du relevé',
    'Recorded by': 'Enregistré par',
    'Approved by': 'Validé par',
    'Rejected by': 'Rejeté par',
    'Rejection reason': 'Motif du rejet',
    'Tariff period': 'Période tarifaire',
    'This reading was rejected': 'Ce relevé a été rejeté',
    'No reason was given. Correct the value and resubmit.':
        'Aucun motif fourni. Corrigez la valeur et resoumettez.',
    'Saving resubmits this reading for admin approval.':
        "L'enregistrement soumet à nouveau ce relevé pour validation.",
    'Everything you have recorded. Pending and rejected readings can still be edited.':
        'Tout ce que vous avez enregistré. Les relevés en attente ou rejetés restent modifiables.',

    // ── Reading form ──
    'Record a reading': 'Enregistrer un relevé',
    'Enter the value shown on the meter dial. It goes to an admin for approval.':
        'Saisissez la valeur affichée sur le compteur. Elle sera soumise à validation.',
    'Choose the meter you are reading': 'Choisissez le compteur relevé',
    'When was the reading taken?': 'Quand le relevé a-t-il été fait ?',
    'Meter reading': 'Valeur du compteur',
    'Greater than :value': 'Supérieur à :value',
    'That is a jump of more than :max :unit — the entry will be blocked. Double-check the dial.':
        'Écart supérieur à :max :unit — la saisie sera bloquée. Vérifiez le cadran.',
    'Previous approved reading': 'Dernier relevé validé',
    'First reading for this meter': 'Premier relevé pour ce compteur',
    'Estimated amount': 'Montant estimé',
    'Pick a tariff period to estimate the amount.':
        'Choisissez une période tarifaire pour estimer le montant.',
    'Pick a meter to see its previous reading and a live cost estimate.':
        'Choisissez un compteur pour voir son dernier relevé et une estimation du coût.',
    'Save reading': 'Enregistrer le relevé',
    'Water uses the daily tariff: :price :currency per m³. No period to choose.':
        "L'eau utilise le tarif journalier : :price :currency par m³. Aucune période à choisir.",
    'No water tariff exists yet — ask an admin to create one.':
        "Aucun tarif eau n'existe encore — demandez à un admin d'en créer un.",

    // ── Meters ──
    'The physical electricity and water meters technicians read.':
        "Les compteurs d'électricité et d'eau relevés par les techniciens.",
    'Add meter': 'Ajouter un compteur',
    'Edit meter': 'Modifier le compteur',
    'No meters found': 'Aucun compteur trouvé',
    'Add your first meter so technicians can start recording readings.':
        'Ajoutez votre premier compteur pour que les techniciens puissent commencer.',
    'Register a new electricity or water meter.':
        "Enregistrez un nouveau compteur d'électricité ou d'eau.",
    'Changes apply to future readings; existing history keeps its snapshot.':
        "Les changements s'appliquent aux futurs relevés ; l'historique existant est conservé.",
    'Create meter': 'Créer le compteur',
    'Meter name': 'Nom du compteur',
    'e.g. Kitchen — ground floor': 'ex. Cuisine — rez-de-chaussée',
    'Where is the meter installed?': 'Où le compteur est-il installé ?',
    'Delete “:name”?': 'Supprimer « :name » ?',
    'This meter has :count readings — deletion will be refused. Set it to inactive instead.':
        'Ce compteur possède :count relevés — la suppression sera refusée. Passez-le en inactif.',
    'The meter has no readings and will be removed permanently.':
        "Ce compteur n'a aucun relevé et sera supprimé définitivement.",
    'The serial number is what technicians match against the physical meter — keep it identical to the plate on the device.':
        "Le n° de série permet aux techniciens d'identifier le compteur physique — gardez-le identique à la plaque.",
    "Inactive meters disappear from the technician's reading form but keep their full history in reports.":
        'Les compteurs inactifs disparaissent du formulaire de relevé mais gardent leur historique dans les rapports.',

    // ── Periods ──
    'Electricity is billed by time-of-day windows; water has one flat daily tariff.':
        "L'électricité est facturée par plages horaires ; l'eau a un tarif journalier unique.",
    'Electricity uses time-of-day windows; water has one flat daily tariff.':
        "L'électricité utilise des plages horaires ; l'eau a un tarif journalier unique.",
    'Add period': 'Ajouter une période',
    'Add tariff period': 'Ajouter une période tarifaire',
    'Edit period': 'Modifier la période',
    'No tariff periods': 'Aucune période tarifaire',
    'Create at least one period so readings can be priced.':
        'Créez au moins une période pour tarifer les relevés.',
    'Existing readings keep the price they were recorded with.':
        'Les relevés existants conservent le prix appliqué lors de leur saisie.',
    'Create period': 'Créer la période',
    'Period name': 'Nom de la période',
    'e.g. Peak hours': 'ex. Heures pleines',
    'Starts at': 'Début',
    'Ends at': 'Fin',
    'Whole day': 'Toute la journée',
    overnight: 'nocturne',
    'Delete period': 'Supprimer la période',
    'This period is used by existing readings and cannot be deleted.':
        'Cette période est utilisée par des relevés existants et ne peut pas être supprimée.',
    'This period has no readings and will be removed permanently.':
        "Cette période n'a aucun relevé et sera supprimée définitivement.",
    ':count readings priced with this period': ':count relevés tarifés avec cette période',
    'Overnight windows are fine — 23:00 to 08:00 covers the night tariff.':
        'Les plages nocturnes sont possibles — 23:00 à 08:00 couvre le tarif de nuit.',
    'New readings snapshot this price at the moment they are recorded — changing it later never rewrites billing history.':
        "Les nouveaux relevés figent ce prix au moment de la saisie — le modifier ne réécrit jamais l'historique.",
    'Water is billed at one flat tariff for the whole day — no time window to configure.':
        "L'eau est facturée à un tarif unique pour toute la journée — aucune plage horaire à configurer.",
    'Water already has its daily tariff — edit that period instead.':
        "L'eau possède déjà son tarif journalier — modifiez cette période.",

    // ── Users ──
    'Users & roles': 'Utilisateurs & rôles',
    'Who can record, approve, and view consumption data.':
        'Qui peut saisir, valider et consulter les données de consommation.',
    'Add user': 'Ajouter un utilisateur',
    'Edit user': "Modifier l'utilisateur",
    'No users found': 'Aucun utilisateur trouvé',
    'Delete :name?': 'Supprimer :name ?',
    'Their account is removed permanently. Readings they recorded stay in the history.':
        "Le compte est supprimé définitivement. Ses relevés restent dans l'historique.",
    'Delete user': "Supprimer l'utilisateur",
    'Create user': "Créer l'utilisateur",
    'The account is created verified and can sign in right away.':
        'Le compte est créé vérifié et peut se connecter immédiatement.',
    'Leave the password fields empty to keep the current password.':
        'Laissez les champs mot de passe vides pour conserver le mot de passe actuel.',
    'New password (optional)': 'Nouveau mot de passe (facultatif)',
    'Confirm password': 'Confirmer le mot de passe',
    'Full access — approves readings and manages meters, tariffs and users.':
        'Accès complet — valide les relevés et gère compteurs, tarifs et utilisateurs.',
    'Records meter readings in the field and tracks their approval.':
        'Saisit les relevés sur le terrain et suit leur validation.',
    'Read-only access to approved consumption data and reports.':
        'Accès en lecture seule aux données validées et aux rapports.',
    Admins: 'Admins',
    Viewers: 'Observateurs',

    // ── Reports ──
    'Approved readings only — the numbers you can bill against.':
        'Relevés validés uniquement — les chiffres sur lesquels facturer.',
    'Export Excel': 'Exporter Excel',
    'Total cost': 'Coût total',
    'Nothing to report': 'Rien à signaler',
    'No approved readings match these filters.':
        'Aucun relevé validé ne correspond à ces filtres.',
    'Cost by meter': 'Coût par compteur',
    'Top :top of :total meters, by billed amount (:currency).':
        'Top :top sur :total compteurs, par montant facturé (:currency).',
    'Matching readings': 'Relevés correspondants',

    // ── Simulator ──
    'Cost simulator': 'Simulateur de coût',
    'Quick what-if calculations — nothing on this page is ever saved.':
        "Calculs rapides — rien sur cette page n'est jamais enregistré.",
    'Use this to sanity-check a bill, test a tariff change, or estimate a reading before it is recorded.':
        'Vérifiez une facture, testez un changement de tarif ou estimez un relevé avant sa saisie.',
    'Previous reading': 'Relevé précédent',
    'Current reading': 'Relevé actuel',
    'Pick a tariff': 'Choisir un tarif',
    'No tariff for this utility': 'Aucun tarif pour ce type',
    'Or a custom price': 'Ou un prix personnalisé',
    'Overrides the tariff': 'Remplace le tarif',
    'Using your custom price': 'Prix personnalisé utilisé',
    'The current reading must be greater than the previous one.':
        'Le relevé actuel doit être supérieur au précédent.',
    'This is a scratchpad — close the page and it is gone.':
        'Ceci est un brouillon — fermez la page et tout disparaît.',

    // ── Notifications ──
    ':technician recorded :amount on :meter':
        ':technician a enregistré :amount sur :meter',
    ':technician resubmitted :amount on :meter':
        ':technician a resoumis :amount sur :meter',
    'Your reading of :amount on :meter was approved':
        'Votre relevé de :amount sur :meter a été validé',
    'Your reading of :amount on :meter was rejected':
        'Votre relevé de :amount sur :meter a été rejeté',
    'A technician': 'Un technicien',

    // ── Settings ──
    'Manage your profile and account settings':
        'Gérez votre profil et les paramètres du compte',
    Profile: 'Profil',
    'Two-Factor Auth': 'Double authentification',
    Appearance: 'Apparence',
    'Profile settings': 'Paramètres du profil',
    'Password settings': 'Paramètres du mot de passe',
    'Appearance settings': "Paramètres d'apparence",
    'Profile information': 'Informations du profil',
    'Update your name and email address': 'Mettez à jour votre nom et votre e-mail',
    'Update password': 'Mettre à jour le mot de passe',
    'Ensure your account is using a long, random password to stay secure':
        'Utilisez un mot de passe long et aléatoire pour rester en sécurité',
    'Two-Factor Authentication': 'Double authentification',
    'Manage your two-factor authentication settings':
        'Gérez vos paramètres de double authentification',
    "Update your account's appearance settings":
        "Réglez l'apparence de votre compte",
    'Delete account': 'Supprimer le compte',
    'Delete your account and all of its resources':
        'Supprimez votre compte et toutes ses données',

    // ── Landing ──
    'Every meter,': 'Chaque compteur,',
    'every drop,': 'chaque goutte,',
    'on the record.': 'sous contrôle.',
    'Approved data only': 'Données validées uniquement',
    'EcoTrack turns hand-read utility meters into an approved, auditable history — with time-of-day tariffs, live dashboards and costs your whole team can trust.':
        'EcoTrack transforme les relevés manuels en un historique validé et auditable — avec tarifs horaires, tableaux de bord en direct et des coûts fiables pour toute votre équipe.',
    'Create an account': 'Créer un compte',
    'See how it works': 'Voir comment ça marche',
    'Open dashboard': 'Ouvrir le tableau de bord',
    'Go to your dashboard': 'Accéder à votre tableau de bord',
    'Built for the way utilities are actually read':
        'Conçu pour la réalité des relevés de compteurs',
    'No IoT hardware required — EcoTrack makes human meter reading reliable, reviewable and beautiful.':
        "Aucun matériel IoT requis — EcoTrack rend le relevé humain fiable, vérifiable et élégant.",
    'From meter dial to trusted number in three steps':
        'Du cadran du compteur au chiffre fiable en trois étapes',
    'Everyone sees exactly what they need':
        'Chacun voit exactement ce dont il a besoin',
    'Dark mode, done properly': 'Mode sombre, bien fait',
    'A deep-forest theme with charts validated for contrast and color-blind safety — in both modes.':
        'Un thème forêt profonde avec des graphiques validés pour le contraste et le daltonisme — dans les deux modes.',
    'Your data is never stuck': 'Vos données ne sont jamais bloquées',
    'Every filtered list and report exports exactly as you see it. No lock-in, ever.':
        'Chaque liste filtrée et chaque rapport s’exportent tels quels. Aucun verrouillage.',
    'Start putting your meters on the record':
        'Mettez vos compteurs sous contrôle',
    'Log in with your team account, record the first reading, and watch the dashboard come alive.':
        "Connectez-vous, enregistrez le premier relevé et regardez le tableau de bord s'animer.",
    'energy & water tracking': "suivi d'énergie & d'eau",
    // Landing features
    'Dual-utility tracking': 'Suivi bi-énergie',
    'Electricity in kWh, water in m³ — color-coded everywhere so a glance tells you which is which. Never a mixed-up axis or unit.':
        "Électricité en kWh, eau en m³ — un code couleur partout pour tout distinguer d'un coup d'œil. Jamais d'axe ni d'unité mélangés.",
    'Approval workflow': 'Circuit de validation',
    'Every reading passes an admin review. Rejected entries go back to the technician with a reason; approved ones are locked into history.':
        "Chaque relevé passe par une revue admin. Les rejets reviennent au technicien avec un motif ; les validés sont verrouillés dans l'historique.",
    'Time-of-day tariffs': 'Tarifs horaires',
    'Peak, off-peak and overnight windows each carry their own price. Readings snapshot the tariff, so old bills never change.':
        'Heures pleines, creuses et nocturnes ont chacune leur prix. Les relevés figent le tarif : les anciennes factures ne changent jamais.',
    'Reports that bill': 'Des rapports qui facturent',
    'Trends, per-meter cost breakdowns and totals over any date range — computed only from approved, audit-ready data.':
        'Tendances, coûts par compteur et totaux sur toute période — calculés uniquement sur des données validées.',
    'One-click CSV export': 'Export en un clic',
    'Any filtered view exports to a clean CSV for your accountant, spreadsheet, or archive. What you see is what you get.':
        'Chaque vue filtrée s’exporte proprement pour votre comptable, tableur ou archive. Ce que vous voyez est ce que vous obtenez.',
    'Works where you work': 'Fonctionne où vous travaillez',
    'Tables become cards on a phone, forms fit a technician’s pocket, and dark mode is a first-class citizen — not an afterthought.':
        'Les tableaux deviennent des cartes sur mobile, les formulaires tiennent dans la poche du technicien, et le mode sombre est natif.',
    // Landing steps
    'Record in the field': 'Relever sur le terrain',
    'The technician picks the meter and sees its last approved value on the spot — typos are caught before they are saved.':
        'Le technicien choisit le compteur et voit sa dernière valeur validée — les fautes de frappe sont bloquées avant enregistrement.',
    'Approve with context': 'Valider en contexte',
    'Admins review each reading with the consumption delta and cost already computed. One click to approve, a reason to reject.':
        'Les admins voient chaque relevé avec le delta et le coût déjà calculés. Un clic pour valider, un motif pour rejeter.',
    'Understand & export': 'Comprendre & exporter',
    'Approved data flows into dashboards, trends and CSV exports — the numbers your bills and budgets can rely on.':
        'Les données validées alimentent tableaux de bord, tendances et exports — des chiffres fiables pour vos factures et budgets.',
    // Landing roles
    'Guided reading form': 'Formulaire de relevé guidé',
    'Previous value shown live': 'Valeur précédente affichée en direct',
    'Edit & resubmit rejections': 'Corriger et resoumettre les rejets',
    'Approval queue': "File d'attente de validation",
    'Meters, tariffs & users': 'Compteurs, tarifs & utilisateurs',
    'Full reports & exports': 'Rapports complets & exports',
    'Approved data only ': 'Données validées uniquement',
    'Consumption dashboards': 'Tableaux de bord de consommation',
    'Self-serve reports': 'Rapports en libre-service',
    // ── Gasoil ──
    Gasoil: 'Gasoil',
    'Gasoil stock': 'Stock de gasoil',
    'Deliveries in, daily consumption out — the tank in real time.':
        'Livraisons en entrée, consommation quotidienne en sortie — la cuve en temps réel.',
    'Add import': 'Ajouter une livraison',
    'Add consumption': 'Ajouter une consommation',
    'Record a gasoil delivery': 'Enregistrer une livraison de gasoil',
    'The quantity is added to the tank immediately.':
        'La quantité est ajoutée à la cuve immédiatement.',
    Quantity: 'Quantité',
    Unit: 'Unité',
    'liters (L)': 'litres (L)',
    'tons (t)': 'tonnes (t)',
    '≈ :liters L (1 t ≈ :perTon L of diesel)': '≈ :liters L (1 t ≈ :perTon L de gasoil)',
    'Note (optional)': 'Note (facultatif)',
    'e.g. Delivery — 4 t truck': 'ex. Livraison — camion 4 t',
    'Add to stock': 'Ajouter au stock',
    "Record a day's consumption": 'Enregistrer la consommation du jour',
    'It is deducted from the tank once approved. :stock L currently in stock.':
        'Elle est déduite de la cuve après validation. :stock L actuellement en stock.',
    'Record consumption': 'Enregistrer la consommation',
    'e.g. Generator — night shift': 'ex. Groupe électrogène — nuit',
    'Low stock': 'Stock bas',
    'Only :stock L left in the tank (alert level: :threshold L). Plan a delivery.':
        'Il ne reste que :stock L dans la cuve (seuil d’alerte : :threshold L). Prévoyez une livraison.',
    'Current stock': 'Stock actuel',
    ':percent% of all-time imports still in the tank · alert at :threshold L':
        ':percent% des livraisons totales encore en cuve · alerte à :threshold L',
    'Imported (total)': 'Importé (total)',
    'Consumed (total)': 'Consommé (total)',
    'Consumed this month': 'Consommé ce mois-ci',
    'Gasoil — last 30 days (L)': 'Gasoil — 30 derniers jours (L)',
    Movements: 'Mouvements',
    Type: 'Type',
    Note: 'Note',
    Import: 'Livraison',
    'Delete this entry?': 'Supprimer cette entrée ?',
    'The stock is recalculated without it. This cannot be undone.':
        'Le stock est recalculé sans elle. Action irréversible.',
    'Gasoil stock is low: :liters L remaining':
        'Stock de gasoil bas : il reste :liters L',
    'Alert settings': "Réglages de l'alerte",
    'Admins are notified when the stock crosses below this level. Current level: :threshold L.':
        'Les admins sont notifiés quand le stock passe sous ce niveau. Niveau actuel : :threshold L.',
    'Alert me when stock falls below': 'M’alerter quand le stock passe sous',
    '% of total imports': '% des livraisons totales',
    'The level follows your deliveries — 10% of everything imported so far.':
        'Le niveau suit vos livraisons — p. ex. 10 % de tout ce qui a été importé.',
    'Save alert level': "Enregistrer le niveau d'alerte",

    // Landing stats
    'utilities, one ledger': 'énergies, un seul registre',
    'roles with clear duties': 'rôles aux responsabilités claires',
    'of reports from approved data': 'des rapports issus de données validées',
    'CSV export on every view': 'export sur chaque vue',
};
