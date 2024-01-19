// "use strict"

if (typeof browser === "undefined") {
  var browser = chrome;
}
console.log("Content script");

// This script runs in the context of web pages.
// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {

//     console.log("Content script received message:", request);

//     if (request.action === "getLinks") {
//       let links = Array.from(document.querySelectorAll('a')).map(link => link.href);
//       console.log("Links:", links)
//       sendResponse({links: links});
//     }
//   });
  