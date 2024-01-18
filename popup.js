document.getElementById('saveButton').addEventListener('click', () => {
    browser.runtime.sendMessage({action: "save"});
  });
  
  document.getElementById('openButton').addEventListener('click', () => {
    browser.runtime.sendMessage({action: "open"});
  });
  