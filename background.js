


class Pack{
  constructor(){
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
    saveCurrentLinks();
  } else if (message.action === "open") {
    reopenLinks();
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


// Display

function updatePopup() {
  chrome.runtime.sendMessage({ action: "updatePacksDisplay" });
}






