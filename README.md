# Gestion des employes

## Objectif

Amorcage d'un mini-projet dont la finalite est de mettre en place une chaine
de deploiement DevSecOps complete (Docker, GitHub Actions, k3s, Argo CD,
observabilite) autour d'une application simple de gestion des employes
(CRUD, sans authentification ni gestion d'utilisateurs). Cette etape ne
couvre que l'amorcage du depot et le squelette backend ; le developpement
fonctionnel fera l'objet d'etapes ulterieures.

## Stack

- Java 21
- Spring Boot 3.x / Maven
- PostgreSQL 16 (cible ; non utilisee a ce stade)

## Prerequis

- JDK 21
- Une instance PostgreSQL 16 accessible (locale ou via Docker), pour les
  etapes ulterieures utilisant la base de donnees

## Demarrage local

```bash
cd backend
cp ../.env.example ../.env   # a adapter, puis exporter les variables
./mvnw spring-boot:run
```

Les variables d'environnement attendues sont documentees dans
`.env.example` a la racine du depot.

## Convention de branches (GitFlow)

- `main` : code en production, toujours stable
- `develop` : branche d'integration, base des developpements (branche par
  defaut du depot)
- `feature/*` : une branche par fonctionnalite, partant de `develop` et
  fusionnee dans `develop`
- `release/*` : preparation d'une mise en production depuis `develop`
- `hotfix/*` : correctifs urgents partant de `main`

Aucune branche de feature n'est creee a ce stade.
