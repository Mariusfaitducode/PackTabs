
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


                const packHeader = document.createElement("div");
                packHeader.className = "packHeader";

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

                const openButton = document.createElement("button");
                openButton.className = "packButton";

                const openIcon = document.createElement("img");
                openIcon.src = "icons/open-window.svg";
                openIcon.alt = "Open pack";
                openIcon.className = "packIcon";

                openButton.appendChild(openIcon);


                const deleteButton = document.createElement("button");
                deleteButton.className = "packButton";

                const deleteIcon = document.createElement("img");
                deleteIcon.src = "icons/delete-pack.svg";
                deleteIcon.alt = "Delete pack";
                deleteIcon.className = "packIcon";

                deleteButton.appendChild(deleteIcon);

                const expandButton = document.createElement("button");
                expandButton.className = "packButton";

                const expandIcon = document.createElement("img");
                expandIcon.src = "icons/expand-more.svg";

                expandButton.appendChild(expandIcon);

                packHeader.appendChild(packName);
                packHeader.appendChild(openButton);
                packHeader.appendChild(deleteButton);
                packHeader.appendChild(expandButton);
  
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
                    listItem.textContent = link;
                    listItem.className = "link";
                    linksList.appendChild(listItem);
                });
  
                packElement.appendChild(packHeader);
                packElement.appendChild(linksList);

                packsContainer.appendChild(packElement);
            });
        }
    });
  }


  