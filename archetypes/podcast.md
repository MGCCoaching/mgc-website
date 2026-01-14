---
# ╔══════════════════════════════════════════════════════════════════╗
# ║                    ÉPISODE DE PODCAST                            ║
# ║                      MGC Coaching                                ║
# ╚══════════════════════════════════════════════════════════════════╝

is_episode: true # Utilisé par Decap CMS pour filtrer les épisodes

draft: true
date: {{ .Date }}

# Formats de sortie (data.json toujours, chapters.json si chapitres définis)
outputs:
  - HTML
  - data
  - chapters

# ══════════════════════════════════════════════════════════════════
# INFORMATIONS PRINCIPALES
# ══════════════════════════════════════════════════════════════════

title: "{{ replace .File.ContentBaseName "-" " " | title }}"
subtitle: ""
description: ""  # 150-160 caractères pour SEO

# ══════════════════════════════════════════════════════════════════
# NUMÉROTATION
# ══════════════════════════════════════════════════════════════════

season: 1                    # Entier : 1, 2, 3...
episode_number: 1
episode_type: "full"         # "full", "trailer", "bonus"

# ══════════════════════════════════════════════════════════════════
# FICHIER AUDIO
# ══════════════════════════════════════════════════════════════════

# MÉTHODE 1 (CDN) : URL construite automatiquement
# → {prefix}/s{season}/{file_name}
audio_url_prefix: "https://media.mariegaetanecomte.fr/podcasts"
file_name: ""                # Ex: "ep_01.mp3"

# MÉTHODE 2 (Bundle) : Fichier dans le dossier de l'épisode
# audio_file: "episode.mp3"

# MÉTHODE 3 (URL directe)
# audio_url: "https://example.com/audio.mp3"

audio_format: "audio/mpeg"
duration: "00:00"            # MM:SS ou HH:MM:SS

# ══════════════════════════════════════════════════════════════════
# IMAGE DE COUVERTURE
# ══════════════════════════════════════════════════════════════════

# cover: ""                  # URL ou fichier dans le bundle
# Fallback automatique : première image du bundle → fallback global

# ══════════════════════════════════════════════════════════════════
# MÉTADONNÉES
# ══════════════════════════════════════════════════════════════════

categories:
  - Podcast

tags:
  - communication
  - prise de parole

guests: []
# - "Nom Prénom (Fonction)"

youtube_video_url_01: ""
youtube_video_url_02: ""

# ══════════════════════════════════════════════════════════════════
# CHAPITRES
# ══════════════════════════════════════════════════════════════════

chapters: []
# - time: "00:00"
#   title: "Introduction"
# - time: "05:30"
#   title: "Sujet principal"
# - time: "15:00"
#   title: "Conclusion"

# ══════════════════════════════════════════════════════════════════
# OPTIONS
# ══════════════════════════════════════════════════════════════════

explicit: false
block: false                 # Exclure du RSS

platforms:
  spotify: ""
  apple_podcasts: ""
  deezer: ""
  youtube: ""

---

Contenu de l'épisode...