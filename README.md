# Biplace Booking

## Infrastructure

- L'app "backend" utilise Docker avec une DB Postgres
- Le frontend quant à lui est déployé directement sur Vercel
- Le repo utilise turborepo pour optimiser les builds, etc.

## Environnements (staging/prod)

- Les 2 backs sont hostés sur un AWS Lightsail.
- La `.ssh/config` (clé PEM à récupérer auprès d'un maintainer):
  ```Host duck-tower
  Hostname 13.39.104.141
  User ec2-user
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/aws-duck-tower.pem```
- L'app est déployée sur 2 environnements:
    - staging: `/srv/biplace-booking-staging`
    - prod: `/srv/biplace-booking-prod`