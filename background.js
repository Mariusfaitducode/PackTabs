


class Pack{
  constructor(){
    this.windowId = null;
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
    saveCurrentLinks();
  } else if (message.action === "open") {
    console.log("open button clicked")
    console.log("message pack", message.pack)
    openPackWindow(message.pack);
  }
});


function saveCurrentLinks() {

  browser.tabs.query({currentWindow: true}, function(tabs){
    console.log("Save tabs:", tabs);
    saveNewPack(tabs.map(tab => tab.url));
    localStorage.setItem("links", tabs.map(tab => tab.url));

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
function saveNewPack(links) {
  browser.storage.local.get({packs : []}, function(data) {
    let packs = data.packs || [];

    let newPack = new Pack();
    newPack.name = "Pack " + (packs.length + 1);
    newPack.links = links;
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
    let packIndex = packs.findIndex(pack => pack.name === updatedPack.name);
    if (packIndex !== -1) {
      packs[packIndex] = updatedPack;
      chrome.storage.local.set({ packs: packs });
      console.log("Pack updated", packs);
    }
    console.log("Pack index", packIndex);
  });
}


// Display

function updatePopup() {
  chrome.runtime.sendMessage({ action: "updatePacksDisplay" });
}






