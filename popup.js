
// Chargement

console.log("Popup script running");

let packsArray = [];
let currentWindowId = null;

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


browser.windows.getCurrent({ populate: true }, function(currentWindow) {
  currentWindowId = currentWindow.id;
});


// Actions

document.getElementById('saveButton').addEventListener('click', () => {

    console.log("save button clicked");
    browser.runtime.sendMessage({action: "save", currentWindowId: currentWindowId});
  });
  
// document.getElementById('openButton').addEventListener('click', () => {

//     console.log("open button clicked")
//     browser.runtime.sendMessage({action: "open"});
//   });

  

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

                console.log("display pack", pack)

                console.log("current window id", currentWindowId)

                const packHeader = document.createElement("div");
                packHeader.className = "packHeader";

                const headerLeft = document.createElement("div");
                headerLeft.className = "headerLeft";

                const packColor = document.createElement("div");
                packColor.className = "packColor";

                const packName = document.createElement("input");
                packName.type = "text";
                packName.value = pack.name;
                packName.className = "packName";

                packName.addEventListener("change", function() {
                    pack.name = packName.value;
                    browser.storage.local.set({packs: data.packs}, function() {
                        console.log("Pack name updated");
                    });
                });

                headerLeft.appendChild(packColor);
                headerLeft.appendChild(packName);

                const headerButtons = document.createElement("div")
                headerButtons.className = 'headerButtons';

                const openButton = document.createElement("button");
                openButton.className = "packButton";

                const openIcon = document.createElement("img");
                openIcon.src = "icons/open-window.svg";
                openIcon.alt = "Open pack";
                openIcon.className = "packIcon";

                openButton.appendChild(openIcon);

                openButton.addEventListener("click", function() {
                    browser.runtime.sendMessage({action: "open", pack: pack});
                });


                const deleteButton = document.createElement("button");
                deleteButton.className = "packButton";

                const deleteIcon = document.createElement("img");
                deleteIcon.src = "icons/delete-pack.svg";
                deleteIcon.alt = "Delete pack";
                deleteIcon.className = "packIcon";

                deleteButton.appendChild(deleteIcon);

                deleteButton.addEventListener("click", function() {
                    browser.runtime.sendMessage({action: "delete", pack: pack});
                });

                const expandButton = document.createElement("button");
                expandButton.className = "packButton";

                const expandIcon = document.createElement("img");
                expandIcon.src = "icons/expand-more.svg";

                expandButton.appendChild(expandIcon);

                headerButtons.appendChild(openButton);
                headerButtons.appendChild(deleteButton);
                headerButtons.appendChild(expandButton);

                packHeader.appendChild(headerLeft);
                packHeader.appendChild(headerButtons);

  
                const linksList = document.createElement("ul");
                linksList.className = "links";
                linksList.style.display = "none";

                expandButton.addEventListener("click", function() {
                    if (linksList.style.display === "none") {
                        linksList.style.display = "block";
                        expandIcon.src = "icons/expand-less.svg";
                    } else {
                        linksList.style.display = "none";
                        expandIcon.src = "icons/expand-more.svg";
                    }
                });

                pack.links.forEach(link => {
                    let listItem = document.createElement("li");
                    listItem.className = "listItem";

                    let linkContainer = document.createElement("div");
                    linkContainer.className = "linkContainer";

                    let listLinkPoint = document.createElement("div");
                    listLinkPoint.className = "listLinkPoint";

                    let listLink = document.createElement("div")
                    listLink.textContent = link;
                    listLink.className = "listLink";

                    linkContainer.appendChild(listLinkPoint);
                    linkContainer.appendChild(listLink);

                    let removeLinkButton = document.createElement("button");
                    removeLinkButton.className = "packButton";

                    const removeLinkIcon = document.createElement("img");
                    removeLinkIcon.src = "icons/close-link.svg";
                    removeLinkIcon.alt = "Remove link";
                    removeLinkIcon.className = "packIcon";

                    removeLinkButton.appendChild(removeLinkIcon);

                    // listItem.appendChild(listLinkPoint);
                    listItem.appendChild(linkContainer);
                    listItem.appendChild(removeLinkButton);

                    linksList.appendChild(listItem);
                });
  
                packElement.appendChild(packHeader);
                packElement.appendChild(linksList);

                packsContainer.appendChild(packElement);

                if (pack.windowId === currentWindowId) {
                  packElement.classList.add("currentPack");
                  openButton.disabled = true;
                  openButton.classList.add("disabled");
              }
            });
        }
    });
  }


  