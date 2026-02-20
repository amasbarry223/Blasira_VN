# Guide pour créer un compte admin de test

## Méthode recommandée (via l'interface)

### Étape 1: Créer un compte utilisateur normal

1. Allez sur http://localhost:8080/auth
2. Créez un compte avec :
   - **Numéro de téléphone** : `12345678`
   - **Mot de passe** : `admin123456`
   - **Nom** : `Admin Test`

### Étape 2: Rendre le compte admin

Exécutez cette requête SQL dans Supabase (SQL Editor) :

```sql
UPDATE profiles 
SET role = 'admin', verification_status = 'verified', name = 'Admin Test'
WHERE phone = '12345678';
```

### Étape 3: Se connecter

1. Allez sur http://localhost:8080/login (ou http://localhost:8080/admin/login)
2. Connectez-vous avec :
   - **Numéro** : `12345678`
   - **Mot de passe** : `admin123456`

## Méthode alternative (mettre à jour un utilisateur existant)

Si vous avez déjà un compte utilisateur, vous pouvez le rendre admin :

```sql
-- Par numéro de téléphone
UPDATE profiles 
SET role = 'admin', verification_status = 'verified'
WHERE phone = 'VOTRE_NUMERO';

-- Par email (si vous connaissez l'email)
UPDATE profiles 
SET role = 'admin', verification_status = 'verified'
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email = 'VOTRE_NUMERO@blasira.app'
);
```

## Vérification

Pour vérifier que le compte est bien admin :

```sql
SELECT id, name, phone, role, verification_status 
FROM profiles 
WHERE role = 'admin';
```

## Accès au dashboard

Une fois le compte créé et mis à jour :
- URL : http://localhost:8080/admin/dashboard
- Login : http://localhost:8080/login

