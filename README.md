# Gestion des employes

## Objectif

Mini-projet dont la finalite est de mettre en place une chaine de
deploiement DevSecOps complete (Docker, GitHub Actions, k3s, Argo CD,
observabilite) autour d'une application simple de gestion des employes
(CRUD, sans authentification ni gestion d'utilisateurs). Cette etape couvre
le backend metier complet et le frontend complet. Les images de production,
les manifestes Kubernetes et les workflows CI feront l'objet d'etapes
ulterieures.

## Stack

- Backend : Java 21, Spring Boot 3.x / Maven, PostgreSQL 16, Flyway
- Frontend : React + Vite + TypeScript, Node.js 20

## Prerequis

- Docker et Docker Compose (v2), pour le demarrage local complet
- JDK 21 et une instance PostgreSQL 16, pour une execution du backend hors
  conteneur
- Node.js 20, pour une execution du frontend hors conteneur

## Demarrage local (docker compose)

```bash
cp .env.example .env   # a adapter si besoin, valeurs par defaut deja utilisables
docker compose up
```

- PostgreSQL demarre avec un volume nomme (`pgdata`) et un healthcheck
  (`pg_isready`) ; le backend attend que la base soit prete avant de
  demarrer, le frontend attend le demarrage du backend.
- Le backend tourne avec le profil `local` (`SPRING_PROFILES_ACTIVE=local`
  dans `.env.example`), qui charge en plus le jeu de donnees de demonstration
  (voir "Migrations Flyway" ci-dessous).
- Interface disponible sur `http://localhost:5173`. Le serveur de
  developpement Vite proxifie `/api` vers le service `backend` du reseau
  Docker (voir "Frontend / acces a l'API" ci-dessous) : aucun appel direct au
  port 8080 depuis le navigateur.
- API accessible directement sur `http://localhost:8080/api` (utile pour des
  appels `curl` de verification).
- Aucun Dockerfile applicatif n'est utilise a ce stade (hors perimetre) :
  backend et frontend tournent dans des conteneurs generiques (`maven`,
  `node`) avec le code source monte en volume.

## Demarrage local (sans Docker)

```bash
# backend, necessite une instance PostgreSQL 16 deja accessible (cf. DB_*)
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

```bash
# frontend, dans un autre terminal
cd frontend
npm install
npm run dev
```

## Frontend / acces a l'API

Le frontend appelle l'API sur le chemin relatif `/api` (meme origine que la
page), jamais une URL codee en dur :

- **En developpement** (`npm run dev`, avec ou sans Docker), le serveur Vite
  proxifie `/api` vers le backend (`frontend/vite.config.ts`). La cible du
  proxy est lue depuis `API_PROXY_TARGET` (variable interne au serveur de
  dev, jamais exposee au bundle client) : `http://backend:8080` dans
  `docker-compose.yml`, ou `http://localhost:8080` par defaut hors Docker.
- **`VITE_API_URL`** (voir `.env.example`) reste disponible pour surcharger
  ponctuellement cette base par une URL absolue (ex. pointer vers une autre
  API), mais n'est pas necessaire au fonctionnement normal — c'est
  volontaire : une URL d'API figee au build empecherait de promouvoir la
  meme image entre environnements.
- `APP_CORS_ORIGIN` cote backend reste utile pour un appel hors proxy (ex.
  avec `VITE_API_URL` renseignee), mais le parcours nominal ne CORS pas
  puisqu'il reste sur la meme origine.

## Migrations Flyway

- `backend/src/main/resources/db/migration/` : schema versionne
  (`V1__init_schema.sql` : type enum `employee_status`, table `employees`,
  index sur `department`/`status`, trigger `updated_at`). Charge dans tous
  les environnements, y compris en production.
- `backend/src/main/resources/db/seed/` : jeu de donnees de demonstration
  (`R__seed_data.sql`, migration repetable). Charge **uniquement** quand
  `spring.flyway.locations` est etendu par le profil `local`
  (`application-local.yml`). Le profil par defaut ne charge que
  `classpath:db/migration` : un deploiement en production (VPS) n'execute
  jamais ce fichier et ne reçoit jamais de donnees de demonstration.

## Variables d'environnement

Voir `.env.example` pour les valeurs d'illustration. Recapitulatif :

| Variable | Description |
| --- | --- |
| `POSTGRES_DB` | Nom de la base PostgreSQL (service `db` docker-compose) |
| `POSTGRES_USER` | Utilisateur PostgreSQL |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL |
| `DB_URL` | URL JDBC utilisee par le backend |
| `DB_USERNAME` | Utilisateur DB cote backend |
| `DB_PASSWORD` | Mot de passe DB cote backend |
| `SPRING_PROFILES_ACTIVE` | Profil Spring actif (`local` charge les donnees de demonstration) |
| `APP_CORS_ORIGIN` | Seule origine autorisee en CORS sur `/api/**` (appels hors proxy) |
| `VITE_API_URL` | Optionnel : surcharge ponctuelle de la base d'API frontend (sinon `/api` relatif) |

## Endpoints

Base : `/api`. Toutes les reponses d'erreur suivent le meme format JSON
uniforme (`timestamp`, `status`, `error`, `message`, `path`, et `errors`
en plus pour les 400 de validation).

| Methode | Chemin | Description | Parametres | Codes de retour |
| --- | --- | --- | --- | --- |
| GET | `/api/employees` | Liste paginee des employes | `page` (defaut 0), `size` (defaut 10), `sort` (`champ,asc\|desc`, defaut `lastName,asc`, liste blanche de champs sinon 400), `department` (optionnel), `status` (`active`\|`inactive`, optionnel), `search` (optionnel, sur prenom/nom) | 200, 400 (sort/status invalide) |
| GET | `/api/employees/{id}` | Detail d'un employe | - | 200, 404 |
| POST | `/api/employees` | Creation d'un employe | corps JSON `EmployeeRequest` | 201, 400 (validation ou date d'embauche future) |
| PUT | `/api/employees/{id}` | Mise a jour d'un employe | corps JSON `EmployeeRequest` | 200, 400, 404 |
| DELETE | `/api/employees/{id}` | Suppression d'un employe | - | 204, 404 |
| GET | `/api/departments` | Liste distincte des departements existants | - | 200 |

## Convention de branches (GitFlow)

- `main` : code en production, toujours stable, protegee (aucun push direct)
- `develop` : branche d'integration, base des developpements (branche par
  defaut du depot)
- `feature/*` : une branche par fonctionnalite, partant de `develop` et
  fusionnee dans `develop` via pull request
- `release/*` : preparation d'une mise en production depuis `develop`
- `hotfix/*` : correctifs urgents partant de `main`
