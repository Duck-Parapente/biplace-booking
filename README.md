# Biplace Booking

## Monorepo

Pour l'instant, il y a 4 services pour gérer la réservation des biplaces:
- 1 backend (+ db + reverse proxy) déployé sur un serveur AWS+Docker.
- 1 frontend déployé sur Vercel.

Le repo utilise turborepo pour optimiser les builds, etc.


## Infrastructure

[Voir ici](./infra/docs/infrastructure.md)


## Tooling

- Bruno pour tester nos routes HTTP (cf. dossier bruno)
- Gmail: l'adresse gestion.biplace.duckparapente@gmail.com a été créée pour:
    - administrer les autres outils (Vercel, Newrelic, Auth0, etc.)
    - éventuellement permettre de recevoir des questions/retours des utilisateurs
- [Vercel](https://vercel.com/duckparapente) pour déployer le frontend, qui fournit un plan gratuit jusqu'à 1M de edge requests /mois.
- [Auth0](https://manage.auth0.com/dashboard/eu/biplace-duckparapente/applications), qui fournit un système d'authentification avec un plan gratuit (jusqu'à 25.000 utilisateurs).
- [NewRelic](https://one.eu.newrelic.com/logger?account=7279493&duration=1800000&state=67344c39-0ea6-054f-a3c4-6dc9061ab82c) pour les logs/APM.
- Enfin, [Contabo](https://new.contabo.com/servers/vps) pour gérer l'instance VPS Contabo (pour l'instant administrée sur le compte perso de JP)