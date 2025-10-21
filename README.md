# Biplace Booking

## Monorepo

Pour l'instant, il y a 4 services pour gérer la réservation des biplaces:
- 2 DB (prod/staging) déployées sur un serveur AWS+Docker.
- 1 "backend" déployé sur Vercel.
- 1 "frontend" déployé sur Vercel.

Le repo utilise turborepo pour optimiser les builds, etc.