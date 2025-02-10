async function captureFullPage() {
    let images = [];
    let scrollHeight = document.body.scrollHeight;    
    let viewportHeight = window.innerHeight;
    let currentScroll = 0;

    // Hide scrollbar
    document.documentElement.style.overflow = "hidden";

    while (currentScroll < scrollHeight) {
        window.scrollTo(0, currentScroll);
        
        // Wait for the page to load after scrolling
        await new Promise(r => setTimeout(r, 500));

        // Capture screenshot
        let screenshot = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: "capture" }, (response) => {
                if (response && response.screenshot) {
                    resolve(response.screenshot);
                } else {
                    reject("Screenshot capture failed");
                }
            });
        });

        images.push(screenshot);
        currentScroll += viewportHeight;

        // If we reach the bottom, stop scrolling
        if (currentScroll >= scrollHeight - viewportHeight) break;
    }

    // Restore scrollbar
    document.documentElement.style.overflow = "auto";

    // Merge all images into one
    chrome.runtime.sendMessage({ action: "open_tab", images });
}

captureFullPage();