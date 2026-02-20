/**
 * User status labels
 */
export const STATUS_LABELS = {
  active: { label: 'Actif', color: 'green' },
  suspended: { label: 'Suspendu', color: 'red' },
  pending: { label: 'En attente', color: 'yellow' },
  verified: { label: 'Vérifié', color: 'blue' },
  rejected: { label: 'Rejeté', color: 'red' },
  student: { label: 'Étudiant vérifié', color: 'purple' },
  driver: { label: 'Conducteur confirmé', color: 'indigo' },
} as const;

/**
 * Trip types
 */
export const TRIP_TYPES = {
  voiture: { label: 'Voiture', icon: 'Car' },
  moto: { label: 'Moto', icon: 'Bike' },
} as const;

/**
 * Trip status labels
 */
export const TRIP_STATUS_LABELS = {
  published: { label: 'Publié', color: 'blue' },
  full: { label: 'Complet', color: 'orange' },
  completed: { label: 'Terminé', color: 'green' },
  cancelled: { label: 'Annulé', color: 'red' },
} as const;

/**
 * Booking status labels
 */
export const BOOKING_STATUS_LABELS = {
  pending: { label: 'En attente', color: 'yellow' },
  confirmed: { label: 'Confirmé', color: 'green' },
  completed: { label: 'Terminé', color: 'blue' },
  cancelled: { label: 'Annulé', color: 'red' },
} as const;

/**
 * User roles
 */
export const ROLES = {
  student: { label: 'Étudiant', color: 'blue' },
  driver_moto: { label: 'Conducteur Moto', color: 'purple' },
  driver_car: { label: 'Conducteur Voiture', color: 'indigo' },
  admin: { label: 'Administrateur', color: 'red' },
} as const;

/**
 * Incident types
 */
export const INCIDENT_TYPES = {
  inappropriate_behavior: { label: 'Comportement inapproprié', color: 'red' },
  delay_no_show: { label: 'Retard / No-show', color: 'orange' },
  fraud: { label: 'Fraude', color: 'red' },
  payment_issue: { label: 'Problème de paiement', color: 'yellow' },
  other: { label: 'Autre', color: 'gray' },
} as const;

/**
 * Incident priority levels
 */
export const PRIORITY_LEVELS = {
  low: { label: 'Faible', color: 'green', value: 1 },
  medium: { label: 'Moyenne', color: 'yellow', value: 2 },
  high: { label: 'Haute', color: 'orange', value: 3 },
  critical: { label: 'Critique', color: 'red', value: 4 },
} as const;

/**
 * Incident status
 */
export const INCIDENT_STATUS = {
  new: { label: 'Nouveau', color: 'red' },
  in_progress: { label: 'En cours', color: 'yellow' },
  resolved: { label: 'Résolu', color: 'green' },
  archived: { label: 'Archivé', color: 'gray' },
} as const;

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
  push: { label: 'Push', icon: 'Bell' },
  email: { label: 'Email', icon: 'Mail' },
  sms: { label: 'SMS', icon: 'MessageSquare' },
} as const;

/**
 * Notification target types
 */
export const NOTIFICATION_TARGET_TYPES = {
  all: { label: 'Tous les utilisateurs' },
  drivers: { label: 'Conducteurs' },
  passengers: { label: 'Passagers' },
  specific: { label: 'Utilisateurs spécifiques' },
} as const;

/**
 * Payment methods
 */
export const PAYMENT_METHODS = {
  orange_money: { label: 'Orange Money', color: 'orange' },
  moov_money: { label: 'Moov Money', color: 'blue' },
  cash: { label: 'Espèces', color: 'green' },
} as const;

/**
 * Malian cities (frequently used)
 */
export const MALIAN_CITIES = [
  'Bamako',
  'Sikasso',
  'Kayes',
  'Mopti',
  'Segou',
  'Koulikoro',
  'Gao',
  'Tombouctou',
  'Kidal',
] as const;

/**
 * Bamako neighborhoods (frequently used)
 */
export const BAMAKO_NEIGHBORHOODS = [
  'ACI 2000',
  'Badalabougou',
  'Badialan',
  'Baco-Djicoroni',
  'Banconi',
  'Bolibana',
  'Centre-ville',
  'Daoudabougou',
  'Djélibougou',
  'Dravéla',
  'Faladiè',
  'Garantiguibougou',
  'Hamdallaye',
  'Hippodrome',
  'Kalaban-Coro',
  'Kalabancoro',
  'Korofina',
  'Lafiabougou',
  'Magnambougou',
  'Missabougou',
  'Missira',
  'Moribabougou',
  'Niamakoro',
  'Niarela',
  "N'Tomikorobougou",
  'Ouolofobougou',
  'Point-G',
  'Quinzambougou',
  'Sabalibougou',
  'Samé',
  'Sébenikoro',
  'Sikoroni',
  'Sogoniko',
  'Sotuba',
  'Titibougou',
  'Torokorobougou',
  'Yirimadio',
] as const;

/**
 * Universities in Mali
 */
export const UNIVERSITIES = [
  'Université des Sciences Sociales et de Gestion de Bamako (USSGB)',
  'Université des Lettres et des Sciences Humaines de Bamako (ULSHB)',
  'Université des Sciences, des Techniques et des Technologies de Bamako (USTTB)',
  'Université des Sciences Juridiques et Politiques de Bamako (USJPB)',
  'École Normale Supérieure (ENSup)',
  'Institut Polytechnique Rural / Institut de Formation et de Recherche Appliquée (IPR/IFRA)',
  'École Nationale d\'Ingénieurs Abderhamane Baba Touré (ENI-ABT)',
  'Institut Universitaire de Gestion (IUG)',
  'Faculté de Médecine et d\'Odontostomatologie (FMOS)',
  'Faculté de Pharmacie (FAPH)',
  'Institut des Sciences Appliquées (ISA)',
  'Institut Supérieur de Formation et de Recherche Appliquée (ISFRA)',
  'Lycée Prosper Camara',
  'Lycée Technique de Bamako',
  'Lycée Ba Aminata Diallo',
  'Lycée Askia Mohamed',
] as const;

/**
 * Page size options for pagination
 */
export const PAGE_SIZES = [10, 25, 50, 100] as const;

/**
 * Default page size
 */
export const DEFAULT_PAGE_SIZE = 25;

