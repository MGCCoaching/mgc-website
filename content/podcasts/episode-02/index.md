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
date: 2025-02-20T10:00:00+01:00

# ══════════════════════════════════════════════════════════════════
# INFORMATIONS DE BASE
# ══════════════════════════════════════════════════════════════════

title: "Sample Podcast"
subtitle: "Podcast Sample MGC Coaching"

# Description courte (150-160 caractères) pour SEO et réseaux sociaux
description: "Here is a short description that suposed to describe the episode"

# Description longue pour Apple Podcasts / Spotify
summary: |
  Écrivez ici une description plus complète de l'épisode.
  Vous pouvez utiliser plusieurs lignes.

# ══════════════════════════════════════════════════════════════════
# NUMÉROTATION
# ══════════════════════════════════════════════════════════════════

season: 1                    # Numéro de saison
episode_number: 2            # Numéro d'épisode
episode_type: "full"         # "full", "trailer", "bonus"

# ══════════════════════════════════════════════════════════════════
# FICHIER AUDIO
# ══════════════════════════════════════════════════════════════════

# Option 1 : URL externe (CloudFront) - RECOMMANDÉ pour production
audio_url: "/podcast-S01/ep_02.wav"                # Ex: https://dXXXXX.cloudfront.net/podcasts/s01e01.mp3

# Option 2 : Fichier local dans le Page Bundle
# → Placer le fichier .mp3 dans le même dossier que index.md
# → Laisser audio_url vide, Hugo le détectera automatiquement

# Format audio
audio_format: "audio/wav"   # audio/mpeg (MP3) ou audio/wav

# Durée (les deux formats sont requis)
duration: "04:55"            # Format MM:SS ou HH:MM:SS
duration_seconds: 295          # En secondes : (min × 60) + sec

# Taille du fichier en octets (OBLIGATOIRE pour Apple Podcasts)
# Commande : ls -l fichier.mp3 | awk '{print $5}'
file_size_bytes: 78201188

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
  - time: "2:00"
    title: "Main topic"
  - time: "2:30"
    title: "Steph"
  - time: "04:15"
    title: "Conclusion"

# ══════════════════════════════════════════════════════════════════
# OPTIONS RSS
# ══════════════════════════════════════════════════════════════════

explicit: false              # Contenu adulte ?
block: false                 # Exclure du flux RSS ?

# ══════════════════════════════════════════════════════════════════
# LIENS PLATEFORMES (remplir après publication)
# ══════════════════════════════════════════════════════════════════

platforms:
  spotify: "spotify//"
  apple_podcasts: "appleMusic//"
  deezer: "deezer//"
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