
// Chargement

let packsArray = [];

if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener('DOMContentLoaded', function() {
  displayPacks();
});

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updatePacksDisplay") {
    // packsArray = message.packs;
    displayPacks();
  }
});


// Actions

document.getElementById('saveButton').addEventListener('click', () => {

    console.log("save button clicked");
    browser.runtime.sendMessage({action: "save"});
  });
  
  document.getElementById('openButton').addEventListener('click', () => {

    console.log("open button clicked")
    browser.runtime.sendMessage({action: "open"});
  });
  

  // Display

  function displayPacks() {
    browser.storage.local.get("packs", function(data) {
        if (data.packs && data.packs.length > 0) {
            const packsContainer = document.getElementById("packsContainer"); 
            console.log("Packs container", packsContainer);
            packsContainer.innerHTML = ""; 

            console.log(data)
  
            data.packs.forEach(pack => {
                const packElement = document.createElement("div");
                packElement.className = "pack";
  
                const title = document.createElement("h3");
                title.textContent = pack.name;
  
                const linksList = document.createElement("ul");
                pack.links.forEach(link => {
                    let listItem = document.createElement("li");
                    listItem.textContent = link;
                    linksList.appendChild(listItem);
                });
  
                packElement.appendChild(title);
                packElement.appendChild(linksList);
                
                packsContainer.appendChild(packElement);
            });
        }
    });
  }