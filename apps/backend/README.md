# Backend

## Infrastructure

Le backend utilise une DB Postgres sur Docker et un backend déployé sur Vercel. 

## Environnements (staging/prod)

- Les 2 db sont hostées sur un AWS Lightsail.
- La `.ssh/config` (clé PEM à récupérer auprès d'un maintainer):
  ```Host duck-tower
  Hostname 52.47.156.66
  User ec2-user
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/aws-duck-tower.pem```
- Le déploiement est possible 2 environnements:
    - staging: `/srv/biplace-booking-staging`
    - prod: `/srv/biplace-booking-prod`