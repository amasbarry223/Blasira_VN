-- Script SQL pour créer un compte admin de test
-- À exécuter dans Supabase SQL Editor

-- ÉTAPE 1: Créez d'abord un compte normal via l'interface /auth
--   - Numéro: 12345678
--   - Mot de passe: admin123456
--   - Nom: Admin Test

-- ÉTAPE 2: Exécutez cette requête pour rendre le compte admin
UPDATE profiles 
SET role = 'admin', verification_status = 'verified', name = 'Admin Test'
WHERE phone = '12345678';

-- Vérification
SELECT id, name, phone, role, verification_status 
FROM profiles 
WHERE role = 'admin';

-- Si vous voulez mettre à jour un autre utilisateur existant:
-- Remplacez '12345678' par le numéro de téléphone de l'utilisateur
-- UPDATE profiles 
-- SET role = 'admin', verification_status = 'verified'
-- WHERE phone = 'VOTRE_NUMERO';

