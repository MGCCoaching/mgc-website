---
# ╔══════════════════════════════════════════════════════════════════╗
# ║                    ÉPISODE DE PODCAST                            ║
# ║                      MGC Coaching                                ║
# ╚══════════════════════════════════════════════════════════════════╝
#
# INSTRUCTION : Créer un dossier content/podcasts/episode-XX/
#               avec ce fichier renommé index.md
#               + une image de couverture (optionnel)

draft: false
date: 2026-01-08T13:17:25+01:00

is_episode: true # use for decap to filter episode to Podacast collection 

# ══════════════════════════════════════════════════════════════════
# INFORMATIONS DE BASE
# ══════════════════════════════════════════════════════════════════

title: "Test Empty"
subtitle: "Podcast MGC Coaching"

# Description courte (150-160 caractères) pour SEO et réseaux sociaux
description: ""

# Description longue pour Apple Podcasts / Spotify
summary: |
  Écrivez ici une description plus complète de l'épisode.
  Vous pouvez utiliser plusieurs lignes.

# ══════════════════════════════════════════════════════════════════
# NUMÉROTATION
# ══════════════════════════════════════════════════════════════════

season: 1                    # Numéro de saison
episode_number: 1            # Numéro d'épisode
episode_type: "full"         # "full", "trailer", "bonus"

# ══════════════════════════════════════════════════════════════════
# FICHIER AUDIO
# ══════════════════════════════════════════════════════════════════

# Option 1 : URL externe (CloudFront) - RECOMMANDÉ pour production
audio_url: ""                # Ex: https://dXXXXX.cloudfront.net/podcasts/s01e01.mp3

# Option 2 : Fichier local dans le Page Bundle
# → Placer le fichier .mp3 dans le même dossier que index.md
# → Laisser audio_url vide, Hugo le détectera automatiquement

# Format audio
audio_format: "audio/mpeg"   # audio/mpeg (MP3) ou audio/wav

# Durée (les deux formats sont requis)
duration: "05:00"            # Format MM:SS ou HH:MM:SS
duration_seconds: 0          # En secondes : (min × 60) + sec

# Taille du fichier en octets (OBLIGATOIRE pour Apple Podcasts)
# Commande : ls -l fichier.mp3 | awk '{print $5}'
file_size_bytes: 0

# ══════════════════════════════════════════════════════════════════
# CATÉGORISATION
# ══════════════════════════════════════════════════════════════════

categories:
  - Podcast

tags:
  - communication
  - prise de parole

# ══════════════════════════════════════════════════════════════════
# INVITÉ(E)S
# ══════════════════════════════════════════════════════════════════

guests:
  - "Nom de l'invité(e) (Fonction)"
# Format compatible avec ton layout actuel

# ══════════════════════════════════════════════════════════════════
# CHAPITRES / TIMESTAMPS (pour le player)
# ══════════════════════════════════════════════════════════════════

chapters:
  - time: "00:00"
    title: "Introduction"
#  - time: "05:00"
#    title: "Sujet principal"
#  - time: "20:00"
#    title: "Conclusion"

# ══════════════════════════════════════════════════════════════════
# OPTIONS RSS
# ══════════════════════════════════════════════════════════════════

explicit: false              # Contenu adulte ?
block: false                 # Exclure du flux RSS ?

# ══════════════════════════════════════════════════════════════════
# LIENS PLATEFORMES (remplir après publication)
# ══════════════════════════════════════════════════════════════════

platforms:
  spotify: ""
  apple_podcasts: ""
  deezer: ""
  youtube: ""

---

### Introduction

Résumé accrocheur de l'épisode qui apparaîtra dans les cartes d'aperçu. Décrivez brièvement le sujet abordé et pourquoi il est pertinent pour votre audience.

### Points Clés Abordés

* **Premier point :** Description du premier sujet important.
* **Deuxième point :** Description du deuxième sujet important.
* **Troisième point :** Description du troisième sujet important.

### L'Invité(e) du Jour

Présentation de l'invité(e), son parcours et son expertise.

### Pour Aller Plus Loin

Ressources, liens et références mentionnés dans l'épisode.