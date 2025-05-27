📦 Popup MJ vers Joueur (Foundry VTT Module)

Popup MJ vers Joueur est un module pour Foundry VTT qui permet au MJ d’envoyer une popup simple et visuelle (✔️) à un joueur spécifique ou à tous les joueurs connectés. Lorsqu’un joueur clique sur "OK", une confirmation privée est automatiquement envoyée au MJ.


✨ Fonctionnalités

Envoi de popup par le MJ via une macro installée automatiquement.

Choix du destinataire : un joueur connecté ou tous les joueurs.

Affichage d’une icône visuelle (✔️) dans la popup côté joueur.

Réponse du joueur (bouton OK) envoyée en message privé (whisper) au MJ.

Intégration légère, sans dépendance supplémentaire.


🛠️ Installation

Télécharge ou clone ce dépôt.

Zippez le dossier popup-mj si nécessaire.

Hébergez le module (popup-mj.zip) et le fichier module.json sur une plateforme accessible en HTTP(S).

Dans Foundry VTT, installez-le via l’URL du module.json en utilisant Install Module from Manifest.


📂 Structure

popup-mj/

├── module.json

└── scripts/

    └── popup-listener.js
    
    
💡 À propos

Ce module a été créé pour simplifier la communication rapide entre MJ et joueurs pendant une session. Il peut être utilisé pour signaler des moments clés, des choix, ou simplement attirer l'attention discrètement.
