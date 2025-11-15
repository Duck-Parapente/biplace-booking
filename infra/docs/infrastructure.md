# Biplace Booking Infrastructure

## Architecture
![Architecture](archi.png)

## Pré-requis

Pour lancer le projet, il te faut:
- docker avec le plugin compose (docker-compose est déprécié)
- pour le serveur Contabo, il faut en plus créer un réseau proxy `docker network create proxy` (valable uniquement pour une installation from scratch)
- rclone configuré avec un remote "gdrive", [cf. doc](https://rclone.org/drive/#making-your-own-client-id)

## Comment déployer en staging/prod?

- Il faut déjà avoir accès au serveur du Duck en récupérant la clé PEM. Ensuite, il suffit de modifier ta `~/.ssh/config`:
    ```
    Host duck-tower
    Hostname 52.47.156.66
    User ec2-user
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/duck-tower.pem
    ```
- Chaque environnement a son dossier spécifique:
    - staging: `/srv/staging-biplace`
    - prod: `/srv/prod-biplace`
- Pour déployer un environnement, tu peux lancer `pnpm deploy:(staging|prod)` depuis ton local. Cette commande va principalement:
    - Build une image Docker avec le backend
    - L'uploader au bon endroit sur le serveur
    - La dézipper
    - Relancer les conteneurs qui sont up (caddy+db+backend)

## Quels crons sont mis en place?

### Backup de la base de données

Tous les jours, les DB de staging/prod sont backup par [backup.sh](../scripts/backup.sh):
    - Création d'un dump de la DB + compression
    - Copie du .env + compression
    - Upload des 2 archives sur le Google Drive du compte `gestion.biplace.duckparapente@gmail.com`
    - Suppression des archives qui ont plus de 7 jours

Voici la config du cron:

```
    0 3 * * * /srv/prod-biplace/infra/scripts/backup.sh >> /var/log/db_backup.log 2>&1
    0 4 * * * /srv/staging-biplace/infra/scripts/backup.sh >> /var/log/db_backup.log 2>&1
```