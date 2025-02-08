document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const imageData = urlParams.get("images");

    if (imageData) {
        let images = JSON.parse(decodeURIComponent(imageData));
        let canvas = document.getElementById("screenshotCanvas");

        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }

        let ctx = canvas.getContext("2d");
        let totalHeight = 0;
        let imgElements = [];

        for (let src of images) {
            let img = new Image();
            img.src = src;
            await new Promise(r => img.onload = r);
            imgElements.push(img);
            totalHeight += img.height;
        }

        canvas.width = imgElements[0].width;
        canvas.height = totalHeight;

        let yOffset = 0;
        for (let img of imgElements) {
            ctx.drawImage(img, 0, yOffset);
            yOffset += img.height;
        }
    }
});
