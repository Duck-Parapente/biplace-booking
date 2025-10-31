# Biplace Booking

## Monorepo

Pour l'instant, il y a 4 services pour gérer la réservation des biplaces:
- 1 backend (+ db + reverse proxy) déployé sur un serveur AWS+Docker.
- 1 frontend déployé sur Vercel.

Le repo utilise turborepo pour optimiser les builds, etc.


## Infrastructure

[Voir ici](./infra/docs/infrastructure.md)


## Tooling

- Gmail: l'adresse gestion.biplace.duckparapente@gmail.com a été créée pour:
    - administrer les autres outils (Vercel, Newrelic, Auth0, etc.)
    - éventuellement permettre de recevoir des questions/retours des utilisateurs
- [Vercel](https://vercel.com/duckparapente) pour déployer le frontend, qui fournit un plan gratuit jusqu'à 1M de edge requests /mois.
- [Auth0](https://manage.auth0.com/dashboard/eu/biplace-duckparapente/applications), qui fournit un système d'authentification avec un plan gratuit (jusqu'à 25.000 utilisateurs).
- [NewRelic](https://one.eu.newrelic.com/logger?account=7279493&duration=1800000&state=67344c39-0ea6-054f-a3c4-6dc9061ab82c) pour les logs/APM.
- [Posthog](https://us.posthog.com/project/241216/error_tracking?filterTestAccounts=true&filterGroup=%7B%22type%22%3A%22AND%22%2C%22values%22%3A%5B%7B%22type%22%3A%22AND%22%2C%22values%22%3A%5B%7B%22key%22%3A%22%24current_url%22%2C%22value%22%3A%22localhost%22%2C%22operator%22%3A%22not_icontains%22%2C%22type%22%3A%22event%22%7D%5D%7D%5D%7D) pour suivre l'error tracking et les sessions replays.
- Enfin, [AWS](https://console.aws.amazon.com/) pour gérer l'instance AWS Lightsail (pour l'instant administrée sur le compte perso de JP)