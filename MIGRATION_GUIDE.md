# Guide de Migration vers PostgreSQL/Supabase

## Étapes pour migrer de localStorage vers Supabase

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anonyme

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USE_SUPABASE=true
```

### 3. Exécuter les migrations

1. Dans votre dashboard Supabase, allez dans l'éditeur SQL
2. Exécutez le contenu du fichier `supabase/migrations/create_school_schema.sql`
3. Puis exécutez le contenu du fichier `supabase/migrations/insert_default_data.sql`

### 4. Activer Supabase dans l'application

Changez `VITE_USE_SUPABASE=true` dans votre fichier `.env`

### 5. Redémarrer l'application

```bash
npm run dev
```

## Capacités avec PostgreSQL/Supabase

### Stockage illimité
- **Milliers d'élèves** (10,000+)
- **Centaines de professeurs** (500+)
- **Milliers de parents** (20,000+)
- **Millions d'enregistrements** de notes, présences, paiements

### Fonctionnalités avancées
- **Authentification intégrée** avec Supabase Auth
- **Temps réel** avec les subscriptions
- **Sauvegardes automatiques**
- **Sécurité au niveau des lignes (RLS)**
- **API REST automatique**
- **Performances optimisées**

### Sécurité
- **Row Level Security (RLS)** activé
- **Politiques d'accès** par rôle utilisateur
- **Chiffrement des données**
- **Audit trail** automatique

## Migration des données existantes

Si vous avez des données dans localStorage que vous voulez migrer :

1. Exportez vos données localStorage
2. Adaptez le format aux tables PostgreSQL
3. Importez via l'interface Supabase ou des scripts SQL

## Développement vs Production

### Développement (localStorage)
```env
VITE_USE_SUPABASE=false
```

### Production (Supabase)
```env
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Avantages de la migration

1. **Scalabilité** : Pas de limite de stockage
2. **Performance** : Base de données optimisée
3. **Sécurité** : Authentification et autorisation robustes
4. **Collaboration** : Plusieurs utilisateurs simultanés
5. **Sauvegarde** : Données sécurisées et sauvegardées
6. **API** : Accès programmatique aux données
7. **Temps réel** : Synchronisation en temps réel
8. **Monitoring** : Tableaux de bord et métriques

## Support

Pour toute question sur la migration, consultez :
- [Documentation Supabase](https://supabase.com/docs)
- [Guide PostgreSQL](https://www.postgresql.org/docs/)