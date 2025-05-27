Hooks.once("ready", async () => {
  if (game.user.isGM) {
    console.log("[Popup MJ] MJ prêt.");

    // Création macro MJ si inexistante
    let folder = game.folders.find(f => f.name === "Macro MJ" && f.type === "Macro");
    if (!folder) folder = await Folder.create({ name: "Macro MJ", type: "Macro", color: "#ff6400" });

    let macro = game.macros.find(m => m.name === "Envoyer Popup MJ");
    if (!macro) {
      macro = await Macro.create({
        name: "Envoyer Popup MJ",
        type: "script",
        img: "icons/svg/eye.svg",
        folder: folder.id,
        command: `
const users = game.users.filter(u => u.active && !u.isGM);
if (users.length === 0) return ui.notifications.warn("Aucun joueur connecté.");

const options = ['<option value="ALL">-- TOUS LES JOUEURS --</option>'].concat(users.map(u => \`<option value="\${u.id}">\${u.name}</option>\`)).join("");

new Dialog({
  title: "Envoyer une popup à un joueur",
  content: \`
    <form>
      <label>Choisir un joueur :</label>
      <select id="target-user">\${options}</select><br /><br />
      <label>Message :</label>
      <textarea id="message" rows="3" style="width:100%"></textarea>
    </form>
  \`,
  buttons: {
    send: {
      label: "Envoyer",
      callback: (html) => {
        const userId = html.find("#target-user").val();
        const message = html.find("#message").val().trim();
        if (!userId || !message) {
          ui.notifications.warn("Sélectionnez un joueur et écrivez un message.");
          return;
        }
        if (userId === "ALL") {
          for (const user of game.users.filter(u => u.active && !u.isGM)) {
            console.log("[Popup MJ] Envoi message à:", user.name, user.id);
            game.socket.emit("module.popup-mj", {
              to: user.id,
              message,
              from: game.user.name
            });
          }
        } else {
          console.log("[Popup MJ] Envoi message à:", userId);
          game.socket.emit("module.popup-mj", {
            to: userId,
            message,
            from: game.user.name
          });
        }
        ui.notifications.info("Popup envoyée !");
      }
    },
    cancel: { label: "Annuler" }
  },
  default: "send"
}).render(true);
`
      });
    }
  }

  // Côté joueur : réception du socket
  if (!game.popupMjInitialized) {
    game.socket.on("module.popup-mj", ({ to, message, from }) => {
      console.log(`[Popup MJ] Message reçu sur ${game.user.name} (ID: ${game.user.id}), attendu ID: ${to}`);
      if (game.user.id !== to) {
        console.log("[Popup MJ] Ce message n'est pas pour cet utilisateur.");
        return;
      }
      new Dialog({
        title: "Message de " + from,
        content: `<p>${message}</p>`,
        buttons: {
          ok: {
            label: "OK",
            callback: () => {
              const gmUsers = game.users.filter(u => u.isGM && u.active);
              const gmIds = gmUsers.map(u => u.id);
              if (gmIds.length) {
                ChatMessage.create({
                  user: game.user.id,
                  whisper: gmIds,
                  content: `<p style="font-size: 3em; text-align: center; color: green;">✔️</p>`
                });
                console.log("[Popup MJ] Confirmation envoyée en whisper au MJ.");
              }
              ui.notifications.info("Message confirmé.");
            }
          }
        },
        default: "ok"
      }).render(true);
    });

    game.popupMjInitialized = true;
  }
});
