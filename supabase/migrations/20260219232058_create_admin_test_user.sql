-- Script pour créer un compte admin de test
-- 
-- MÉTHODE 1: Mettre à jour un utilisateur existant en admin
-- Remplacez 'VOTRE_PHONE' par le numéro de téléphone d'un utilisateur existant
-- Exemple: UPDATE profiles SET role = 'admin' WHERE phone = '12345678';

-- MÉTHODE 2: Mettre à jour par email (si vous connaissez l'email)
-- UPDATE profiles 
-- SET role = 'admin', verification_status = 'verified'
-- WHERE id IN (
--   SELECT id FROM auth.users 
--   WHERE email = '12345678@blasira.app'
-- );

-- MÉTHODE 3: Créer un compte admin de test
-- 1. Créez d'abord un compte normal via l'interface publique (/auth)
--    - Numéro: 12345678
--    - Mot de passe: admin123456
--    - Nom: Admin Test
-- 2. Ensuite, exécutez cette requête pour le rendre admin:
UPDATE profiles 
SET role = 'admin', verification_status = 'verified', name = 'Admin Test'
WHERE phone = '12345678';

-- Vérification: Vérifiez que l'utilisateur est bien admin
-- SELECT id, name, phone, role, verification_status 
-- FROM profiles 
-- WHERE role = 'admin';
