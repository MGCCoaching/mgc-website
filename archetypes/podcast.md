---
# ╔══════════════════════════════════════════════════════════════════╗
# ║                    ÉPISODE DE PODCAST                            ║
# ║                      MGC Coaching                                ║
# ╚══════════════════════════════════════════════════════════════════╝
#
# INSTRUCTION : Créer un dossier content/podcasts/episode-XX/
#               avec ce fichier renommé index.md
#               + une image de couverture (optionnel)

draft: true
date: {{ .Date }}

is_episode: true # Utilisé par Decap CMS pour filtrer les épisodes

# ══════════════════════════════════════════════════════════════════
# INFORMATIONS PRINCIPALES
# ══════════════════════════════════════════════════════════════════

title: "{{ replace .File.ContentBaseName "-" " " | title }}"
subtitle: "Podcast MGC Coaching"

# Description courte (150-160 caractères) pour SEO et réseaux sociaux
description: ""

# ══════════════════════════════════════════════════════════════════
# NUMÉROTATION
# ══════════════════════════════════════════════════════════════════

season: "01"                 # "01", "02", etc.
episode_number: 1            # Numéro d'épisode
episode_type: "full"         # "full", "trailer", "bonus"

# ══════════════════════════════════════════════════════════════════
# FICHIER AUDIO - Nouvelle méthode simplifiée
# ══════════════════════════════════════════════════════════════════

# MÉTHODE 1 (recommandée) : Audio sur S3/CloudFront
# L'URL sera construite automatiquement : {prefix}/s{season}/{file_name}
audio_url_prefix: "https://media.mariegaetanecomte.fr/podcasts"
file_name: ""                # Ex: "ep_01.mp3"

# MÉTHODE 2 : Upload local (laisser audio_url_prefix vide)
# audio_file: ""             # Chemin vers le fichier uploadé

# MÉTHODE 3 (compatibilité) : URL directe complète
# audio_url: ""

# Format audio
audio_format: "audio/mpeg"   # audio/mpeg (MP3) ou audio/wav

# Durée
duration: "00:00"            # Format MM:SS ou HH:MM:SS
duration_seconds: 0          # En secondes (optionnel, pour SEO)

# Taille du fichier en octets (optionnel, récupéré automatiquement si sur S3)
file_size_bytes: 0

# ══════════════════════════════════════════════════════════════════
# IMAGE DE COUVERTURE
# ══════════════════════════════════════════════════════════════════

# cover: ""                  # Uploadée via Decap CMS

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

guests: []
# Exemple:
#   - "Nom de l'invité(e)"

# ══════════════════════════════════════════════════════════════════
# CHAPITRES / TIMESTAMPS (pour le player)
# ══════════════════════════════════════════════════════════════════

chapters:
  - time: "00:00"
    title: "Introduction"
# Exemple:
#   - time: "05:00"
#     title: "Sujet principal"
#   - time: "20:00"
#     title: "Conclusion"

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
