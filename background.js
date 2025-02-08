chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["content.js"]
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "capture") {
        chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
            sendResponse({ screenshot: dataUrl });
        });
        return true; 
    }

    if (request.action === "open_tab") {
        let imageUrls = encodeURIComponent(JSON.stringify(request.images));
        let newTabUrl = chrome.runtime.getURL(`screenshot.html?images=${imageUrls}`);
        chrome.tabs.create({ url: newTabUrl });
    }
});

