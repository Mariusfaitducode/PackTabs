// This script runs in the context of web pages.
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLinks") {
      let links = Array.from(document.querySelectorAll('a')).map(link => link.href);
      sendResponse({links: links});
    }
  });
  