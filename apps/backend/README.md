# Backend

## Infrastructure

Le backend utilise Docker avec une DB Postgres.

## Environnements (staging/prod)

- Les 2 backs sont hostés sur un AWS Lightsail.
- La `.ssh/config` (clé PEM à récupérer auprès d'un maintainer):
  ```Host duck-tower
  Hostname 13.39.104.141
  User ec2-user
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/aws-duck-tower.pem```
- Le déploiement est possible 2 environnements:
    - staging: `/srv/biplace-booking-staging`
    - prod: `/srv/biplace-booking-prod`