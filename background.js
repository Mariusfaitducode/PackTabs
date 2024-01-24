
// Pack model

class Pack{
  constructor(){
    this.windowId = null;
    this.id = null;
    this.name = "";
    this.color = "";
    this.links = [];
  }
}


// Chargement

let packsArray = [];

// Détermination du navigateur (Chrome ou Firefox)
if (typeof browser === "undefined") {
  var browser = chrome;
}


// Actions

// Réceptions des messages provenant des scripts de contenu et de popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    saveCurrentLinks(message.currentWindowId);
  } 
  else if (message.action === "open") {
    openPackWindow(message.pack);
  }
  else if (message.action === "delete") {
    deletePack(message.pack);
  }
});


// Sauvegarde des liens de la fenêtre courante
function saveCurrentLinks(currentWindowId) {

  browser.tabs.query({windowId: currentWindowId}, function(tabs){
      saveNewPack(tabs.map(tab => tab.url), currentWindowId);
  });
}


// Ouverture d'un pack
function openPackWindow(pack) {
  // Vérifier si une fenêtre est déjà ouverte pour ce pack
  if (pack.windowId !== null && pack.windowId !== undefined) {

    browser.windows.get(pack.windowId, { populate: true }, function(window) {

      if (browser.runtime.lastError || !window) {
        // La fenêtre n'existe plus, ouvrir une nouvelle fenêtre
        createNewWindowForPack(pack);
      } else {
        // Mettre la fenêtre existante au premier plan
        browser.windows.update(pack.windowId, { focused: true });
      }
    });
  } else {
    // Aucune fenêtre n'est ouverte, créer une nouvelle
    createNewWindowForPack(pack);
  }
}


// Création d'une nouvelle fenêtre pour un pack
function createNewWindowForPack(pack) {
  let urls = pack.links;
  browser.windows.create({ url: urls, type: "normal" }, function(window) {
    // Sauvegarder l'ID de la nouvelle fenêtre dans le pack
    pack.windowId = window.id;
    updatePackInStorage(pack); // Mettre à jour le pack dans le stockage
  });
}


// Stockage

// Sauvegarder les liens de la fenêtre courante
function saveNewPack(links, windowId) {

  browser.storage.local.get({packs : []}, function(data) {

    let packs = data.packs || [];
    let packIndex = packs.findIndex(pack => pack.windowId === windowId);

    if (packIndex !== -1){
      // Update pack
      packs[packIndex].links = links;
    }
    else{
      // Add new pack
      let newPack = new Pack();
      newPack.name = "Pack " + (packs.length + 1);
      newPack.id = packs.length + 1;
      newPack.links = links;
      newPack.windowId = windowId;
      packs.push(newPack);
    }
    // Sauvegarder les packs
    browser.storage.local.set({packs: packs}, function() {
      updatePopup();
    });
  });
}


// Pour récupérer des liens
function getSavedPacks() {
  browser.storage.local.get("packs", function(data) {
      packsArray = data.savedLinks;
  });
}


// Pour mettre à jour un pack
function updatePackInStorage(updatedPack) {
  browser.storage.local.get({ packs: [] }, function(data) {
    let packs = data.packs;
    let packIndex = packs.findIndex(pack => pack.id === updatedPack.id);
    if (packIndex !== -1) {
      packs[packIndex] = updatedPack;
      chrome.storage.local.set({ packs: packs });
      updatePopup();
    }
  });
}


// Pour supprimer un pack
function deletePack(pack) {
  browser.storage.local.get({ packs: [] }, function(data) {
    let packs = data.packs;
    let packIndex = packs.findIndex(p => p.id === pack.id);
    if (packIndex !== -1) {
      packs.splice(packIndex, 1);
      chrome.storage.local.set({ packs: packs });
      updatePopup();
    }
  });
}


// Actualiser la popup
function updatePopup() {
  chrome.runtime.sendMessage({ action: "updatePacksDisplay" });
}






