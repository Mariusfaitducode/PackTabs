


class Pack{
  constructor(){
    this.links = [];
    this.name = "";
  }
}


// Chargement

let packsArray = [];

console.log("Background script running");

if (typeof browser === "undefined") {
  var browser = chrome;
}



// Actions

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    saveCurrentLinks();
  } else if (message.action === "open") {
    reopenLinks();
  }
});

// Content script to fetch links from the current page
// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "getLinks") {
//     let links = Array.from(document.querySelectorAll('a')).map(link => link.href);
//     sendResponse({links: links});
//   }
// });

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






