let linkPack = [];

console.log("Background script running");

function saveCurrentLinks() {
  browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {action: "getLinks"}).then(response => {
      linkPack = response.links;
      console.log("Links saved:", linkPack);
    });
  });
}

function reopenLinks() {
  linkPack.forEach(link => {
    browser.tabs.create({url: link});
  });
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "save") {
    saveCurrentLinks();
  } else if (message.action === "open") {
    reopenLinks();
  }
});

// Content script to fetch links from the current page
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLinks") {
    let links = Array.from(document.querySelectorAll('a')).map(link => link.href);
    sendResponse({links: links});
  }
});
