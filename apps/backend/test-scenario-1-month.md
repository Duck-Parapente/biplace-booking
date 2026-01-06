# Scénario de Test - Simulation sur 2 semaines

## 📋 Objectifs du test

- Tester les demandes de réservation et leurs différents statuts
- Valider l'algorithme de priorité du moteur de validation
- Vérifier l'annulation et la clôture des réservations
- Contrôler le remplissage du carnet de vol

## 👥 Profils des utilisateurs

### 1. Eric

- **Email**: eric@test.com
- **Score initial**: 120
- **Comportement**: Pilote expérimenté, régulier, responsable du BiUFO

### 2. Julien

- **Email**: julien@test.com
- **Score initial**: 85
- **Comportement**: Pilote actif week-end, responsable du Sora

### 3. Hugo

- **Email**: hugo@test.com
- **Score initial**: 45
- **Comportement**: Pilote occasionnel, annule parfois

### 4. JP

- **Email**: jp@test.com
- **Score initial**: 20
- **Comportement**: Nouveau dans le club, en progression

## 🪂 Matériel (Packs)

### BiUFO

- **Responsable**: Eric
- **Carnet de vol**: 50h / 100 vols max

### Sora

- **Responsable**: Julien
- **Carnet de vol**: 40h / 90 vols max

### Yeti

- **Responsable**: Externe (non utilisateur)
- **Carnet de vol**: 30h / 80 vols max

## 📅 Calendrier - 11 au 24 janvier 2026

### Semaine 1 (11-17 janvier)

#### Lundi 6 janvier - Création des demandes

- **Eric**: Demande pour le 11/01 - Choix: BiUFO, Sora - "Vol matinal si beau"
- **Julien**: Demande pour le 11/01 - Choix: Sora, Yeti - "Premier vol de l'année"
- **Hugo**: Demande pour le 11/01 - Choix: Yeti, BiUFO, Sora - "Dispo samedi"
- **JP**: Demande pour le 12/01 - Choix: Yeti - "Besoin aile école"

#### Mardi 7 janvier à 20h - Attribution automatique

**Plage d'attribution: J+1 à J+5 (8 au 12 janvier)**
**Résultat attribution pour 11-12/01:**

- 11/01 BiUFO → Eric (score 120, responsable)
- 11/01 Sora → Julien (score 85, responsable)
- 11/01 Yeti → Hugo (score 45)
- 12/01 Yeti → JP (score 20, CONFIRMED)

#### Samedi 11 janvier - Jour de vol

- **Eric**: Clôture BiUFO - 2h30, 3 vols - "Excellent vol cross" → Coût: 5 jours (6→11/01) → Score: 130
- **Julien**: Clôture Sora - 2h00, 2 vols - "Super conditions" → Coût: 5 jours (6→11/01) → Score: 93
- **Hugo**: ANNULE Yeti - "Imprévu familial" → Coût: 5 jours (6→11/01) → Score: 35 (pénalité -10)

#### Dimanche 12 janvier - Jour de vol

- **JP**: Clôture Yeti - 1h15, 2 vols - "Premiers thermiques !" → Coût: 6 jours (6→12/01) → Score: 26

#### Lundi 13 janvier - Nouvelles demandes

- **Eric**: Demande pour le 18/01 - Choix: BiUFO, Sora
- **Julien**: Demande pour le 18/01 - Choix: Sora, BiUFO
- **Hugo**: Demande pour le 18/01 - Choix: Yeti, Sora - "Me rattraper"
- **JP**: Demande pour le 18/01 - Choix: Yeti, Sora
- **Julien**: Demande pour le 19/01 - Choix: Sora, Yeti

#### Lundi 13 janvier à 20h - Attribution automatique

**Plage d'attribution: J+1 à J+5 (14 au 18 janvier)**
**Résultat attribution pour 18-19/01:**

- 18/01 BiUFO → Eric (score 130)
- 18/01 Sora → Julien (score 101, responsable)
- 18/01 Yeti → JP (score 26)
- 19/01 Sora → Julien (score 101, CONFIRMED)
- Hugo: REFUSED (pas de pack disponible, score 35 trop faible)

### Semaine 2 (18-24 janvier)

#### Samedi 18 janvier - Jour de vol

- **Eric**: Clôture BiUFO - 3h00, 4 vols - "Journée parfaite" → Coût: 5 jours (13→18/01) → Score: 140
- **Julien**: Clôture Sora - 2h30, 3 vols - "Longue session" → Coût: 5 jours (13→18/01) → Score: 109
- **JP**: Clôture Yeti - 1h45, 2 vols - "Progression thermique" → Coût: 5 jours (13→18/01) → Score: 33

#### Dimanche 19 janvier - Jour de vol

- **Julien**: Clôture Sora - 1h30, 2 vols - "Vol tranquille" → Coût: 6 jours (13→19/01) → Score: 116

#### Lundi 20 janvier - Nouvelles demandes

- **Eric**: Demande pour le 25/01 - Choix: BiUFO, Yeti
- **Julien**: Demande pour le 25/01 - Choix: Sora, BiUFO, Yeti
- **Hugo**: Demande pour le 25/01 - Choix: Yeti, BiUFO - "Cette fois c'est sûr"
- **Hugo**: Demande pour le 24/01 - Choix: BiUFO, Sora, Yeti
- **JP**: Demande pour le 25/01 - Choix: Yeti

#### Lundi 20 janvier à 20h - Attribution automatique

**Plage d'attribution: J+1 à J+5 (21 au 25 janvier)**
**Résultat attribution pour 24-25/01:**

- 24/01 BiUFO → Hugo (score 35, seul à demander ce jour)
- 25/01 BiUFO → Eric (score 140)
- 25/01 Sora → Julien (score 116, responsable)
- 25/01 Yeti → JP (score 33)

#### Vendredi 24 janvier - Jour de vol

- **Hugo**: Clôture BiUFO - 2h00, 2 vols - "Enfin volé !" → Coût: 4 jours (20→24/01) → Score: 43

## 📊 Tableau récapitulatif des actions

| Date      | Utilisateur | Action    | Pack              | Détails           | Score avant | Score après |
| --------- | ----------- | --------- | ----------------- | ----------------- | ----------- | ----------- |
| 06/01     | Eric        | DEMANDE   | BiUFO, Sora       | Vol 11/01         | 120         | 120         |
| 06/01     | Julien      | DEMANDE   | Sora, Yeti        | Vol 11/01         | 85          | 85          |
| 06/01     | Hugo        | DEMANDE   | Yeti, BiUFO, Sora | Vol 11/01         | 45          | 45          |
| 06/01     | JP          | DEMANDE   | Yeti              | Vol 12/01         | 20          | 20          |
| 07/01 20h | Eric        | CONFIRMED | BiUFO             | Attribution 11/01 | 120         | 120         |
| 07/01 20h | Julien      | CONFIRMED | Sora              | Attribution 11/01 | 85          | 85          |
| 07/01 20h | Hugo        | CONFIRMED | Yeti              | Attribution 11/01 | 45          | 45          |
| 07/01 20h | JP          | CONFIRMED | Yeti              | Attribution 12/01 | 20          | 20          |
| 11/01     | Eric        | CLOSED    | BiUFO             | 2h30, 3v, coût 5j | 120         | 130         |
| 11/01     | Julien      | CLOSED    | Sora              | 2h00, 2v, coût 5j | 85          | 93          |
| 11/01     | Hugo        | CANCELLED | Yeti              | Coût 5j           | 45          | 35          |
| 12/01     | JP          | CLOSED    | Yeti              | 1h15, 2v, coût 6j | 20          | 26          |
| 13/01     | Eric        | DEMANDE   | BiUFO, Sora       | Vol 18/01         | 130         | 130         |
| 13/01     | Julien      | DEMANDE   | Sora, BiUFO       | Vol 18/01         | 93          | 93          |
| 13/01     | Hugo        | DEMANDE   | Yeti, Sora        | Vol 18/01         | 35          | 35          |
| 13/01     | JP          | DEMANDE   | Yeti, Sora        | Vol 18/01         | 26          | 26          |
| 13/01     | Julien      | DEMANDE   | Sora, Yeti        | Vol 19/01         | 93          | 93          |
| 13/01 20h | Eric        | CONFIRMED | BiUFO             | Attribution 18/01 | 130         | 130         |
| 13/01 20h | Julien      | CONFIRMED | Sora              | Attribution 18/01 | 93          | 93          |
| 13/01 20h | JP          | CONFIRMED | Yeti              | Attribution 18/01 | 26          | 26          |
| 13/01 20h | Hugo        | REFUSED   | -                 | Pas de pack dispo | 35          | 35          |
| 13/01 20h | Julien      | CONFIRMED | Sora              | Attribution 19/01 | 93          | 93          |
| 18/01     | Eric        | CLOSED    | BiUFO             | 3h00, 4v, coût 5j | 130         | 140         |
| 18/01     | Julien      | CLOSED    | Sora              | 2h30, 3v, coût 5j | 93          | 109         |
| 18/01     | JP          | CLOSED    | Yeti              | 1h45, 2v, coût 5j | 26          | 33          |
| 19/01     | Julien      | CLOSED    | Sora              | 1h30, 2v, coût 6j | 109         | 116         |
| 20/01     | Eric        | DEMANDE   | BiUFO, Yeti       | Vol 25/01         | 140         | 140         |
| 20/01     | Julien      | DEMANDE   | Sora, BiUFO, Yeti | Vol 25/01         | 108         | 108         |
| 20/01     | Hugo        | DEMANDE   | Yeti, BiUFO       | Vol 25/01         | 35          | 35          |
| 20/01     | Hugo        | DEMANDE   | BiUFO, Sora, Yeti | Vol 24/01         | 35          | 35          |
| 20/01     | JP          | DEMANDE   | Yeti              | Vol 25/01         | 33          | 33          |
| 20/01 20h | Hugo        | CONFIRMED | BiUFO             | Attribution 24/01 | 35          | 35          |
| 20/01 20h | Eric        | CONFIRMED | BiUFO             | Attribution 25/01 | 140         | 140         |
| 20/01 20h | Julien      | CONFIRMED | Sora              | Attribution 25/01 | 116         | 116         |
| 20/01 20h | JP          | CONFIRMED | Yeti              | Attribution 25/01 | 33          | 33          |
| 24/01     | Hugo        | CLOSED    | BiUFO             | 2h00, 2v, coût 4j | 35          | 43          |

## 📊 Bilan des 2 semaines

### Scores finaux

- **Eric**: 120 → 140 (+20) - 2 vols réalisés
- **Julien**: 85 → 116 (+31) - 3 vols réalisés
- **Hugo**: 45 → 43 (-2) - 1 vol réalisé, 1 annulation
- **JP**: 20 → 33 (+13) - 2 vols réalisés

### Calcul du coût

Le coût = nombre de jours entre la création de la réservation et sa clôture/annulation

- Maximum: date du vol - date création
- Utilisé pour calculer la variation de score

### Carnets de vol

- **BiUFO**: 5h30 / 7 vols (11% / 7% utilisé)
- **Sora**: 6h00 / 7 vols (15% / 7.8% utilisé)
- **Yeti**: 3h00 / 4 vols (10% / 5% utilisé)

### Statistiques des demandes

- **Total demandes**: 14
- **Confirmées**: 12 (85.7%)
- **Refusées**: 1 (7.1%)
- **Annulées**: 1 (7.1%)
- **Clôturées**: 8 (66.7% des confirmées)

### Tests validés

✅ **Priorité par score**: Eric (140) > Julien (116) > Hugo (43) > JP (33)
✅ **Responsable favorisé**: Eric et Julien obtiennent souvent leurs packs
✅ **Pénalité annulation**: Hugo perd 10 points
✅ **Bonus régularité**: Tous les pilotes actifs progressent
✅ **Gestion conflits**: Distribution optimale par l'algorithme
✅ **Statuts**: PENDING → CONFIRMED → CLOSED/CANCELLED
✅ **Carnet de vol**: Accumulation cohérente
✅ **Attribution automatique**: Exécutée à 20h pour J+1 à J+5
✅ **Calcul du coût**: Basé sur le nombre de jours (création → clôture/annulation)

## 🎯 Points de contrôle

### Algorithme de priorité

- [ ] Les scores déterminent bien l'attribution
- [ ] Les responsables sont favorisés sur leurs packs
- [ ] Les pénalités/bonus fonctionnent correctement
- [ ] L'attribution s'exécute à 20h pour J+1 à J+5
- [ ] Le calcul du coût (jours entre création et clôture) est correct

### Transitions de statuts

- [ ] PENDING → CONFIRMED (attributions réussies)
- [ ] PENDING → REFUSED (pas de pack disponible)
- [ ] CONFIRMED → CANCELLED (annulation Hugo)
- [ ] CONFIRMED → CLOSED (vols effectués)

### Carnet de vol

- [ ] Temps et vols s'accumulent correctement
- [ ] Les commentaires sont enregistrés
- [ ] Les scores évoluent après clôture

### Cas testés

- [x] Annulation avec pénalité (Hugo -10 points, coût 5 jours)
- [x] Demandes multiples même jour (11/01, 18/01, 25/01)
- [x] Refus par manque de matériel (Hugo 18/01)
- [x] Responsable prioritaire (Eric, Julien)
- [x] Nouveau pilote progression (JP +13)
- [x] Attribution à 20h pour J+1 à J+5 (3 attributions)
- [x] Coût variable selon durée (4 à 6 jours testés)
