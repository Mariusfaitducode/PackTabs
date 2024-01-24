


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

console.log("Background script running");

if (typeof browser === "undefined") {
  var browser = chrome;
}

// browser.storage.local.set({packs: []}, function() {
//   console.log("Reset packs");
// });



// Actions

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    saveCurrentLinks(message.currentWindowId);
  } 
  else if (message.action === "open") {
    console.log("open button clicked")
    console.log("message pack", message.pack)
    openPackWindow(message.pack);
  }
  else if (message.action === "delete") {
    console.log("delete button clicked")
    deletePack(message.pack);
  }
});


function saveCurrentLinks(currentWindowId) {

  browser.tabs.query({windowId: currentWindowId}, function(tabs){

      console.log("Save tabs:", tabs);
      console.log("Current window:", currentWindowId);
      saveNewPack(tabs.map(tab => tab.url), currentWindowId);
  });
}

// function reopenLinks() {

//   console.group("reopenLinks")
//   getSavedPacks();
//   // packsArray.forEach(link => {
//   //   browser.tabs.create({url: link});
//   // });
// }


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


function createNewWindowForPack(pack) {
  let urls = pack.links;
  browser.windows.create({ url: urls, type: "normal" }, function(window) {
    // Sauvegarder l'ID de la nouvelle fenêtre dans le pack
    pack.windowId = window.id;
    updatePackInStorage(pack); // Mettre à jour le pack dans le stockage
  });
}






// Stockage

// Pour sauvegarder des liens
function saveNewPack(links, windowId) {
  browser.storage.local.get({packs : []}, function(data) {
    let packs = data.packs || [];

    let newPack = new Pack();
    newPack.name = "Pack " + (packs.length + 1);
    newPack.id = packs.length + 1;
    newPack.links = links;
    newPack.windowId = windowId;
    packs.push(newPack);

    browser.storage.local.set({packs: packs}, function() {
      console.log("Nouveau pack ajouté");
      updatePopup();
    });
  });
}

// Pour récupérer des liens
function getSavedPacks() {
  browser.storage.local.get("packs", function(data) {
      console.log("Packs récupérés", data.packs);
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
      console.log("Pack updated", packs);
      updatePopup();
    }
    console.log("Pack index", packIndex);
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
      console.log("Pack deleted", packs);
      updatePopup();
    }
    console.log("Pack index", packIndex);
  });
}

// Display

function updatePopup() {
  chrome.runtime.sendMessage({ action: "updatePacksDisplay" });
}






