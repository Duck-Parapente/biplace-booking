# Backend

## Framework Nestjs

La documentation officielle est [disponible ici](https://docs.nestjs.com/)

## Architecture

Le code est structuré en architecture hexagonale. Tout est super bien expliqué et imagé sur [ce repo](https://github.com/Sairyss/domain-driven-hexagon)

## Bounded contexts

- UserManagement: Gestion des comptes utilisateurs, rôles, profils
- PackManagement: Gestion des packs, de leurs responsables et disponibilités
- ReservationManagement: Création et gestion des souhaits et réservations
- ValidationEngine: Algorithme d’attribution automatique et calcul des priorités
- FlightLog: Clôture des vols et carnet de vol
- PlanningView: Vue consolidée calendrier + affichage public

Plus de détails sur la [page Notion](https://www.notion.so/Pr-parer-un-event-storming-28d4808c7ea280f19cd2e436ac501f7f)

## Comment développer en local?

Rien de plus simple:

- Installer les dépendances avec `pnpm install`
- Lance `pnpm dc:local` pour démarrer un conteneur avec une DB.
- Lancer `pnpm dev` pour lancer le front et le back.
- Pour lancer uniquement le backend `pnpm dev:backend` (idem pour le front)
