document.addEventListener("DOMContentLoaded", async function () {
    const { jsPDF } = window.jspdf;
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

        // Load images asynchronously
        for (let src of images) {
            let img = new Image();
            img.crossOrigin = "anonymous"; // Important for CORS images
            img.src = src;
            await new Promise(resolve => img.onload = resolve);
            imgElements.push(img);
            totalHeight += img.height;
        }

        // Set canvas size
        canvas.width = imgElements[0].width;
        canvas.height = totalHeight;

        let yOffset = 0;
        for (let img of imgElements) {
            ctx.drawImage(img, 0, yOffset);
            yOffset += img.height;
        }
    }

    // Ensure the buttons exist before adding event listeners
    document.getElementById("downloadImage")?.addEventListener("click", function () {
        let canvas = document.getElementById("screenshotCanvas");
        if (!canvas) {
            console.error("Canvas not found for download!");
            return;
        }

        let link = document.createElement("a");
        link.download = "screenshot.jpg";
        link.href = canvas.toDataURL("image/jpeg", 1.0); // Ensures max quality
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById("downloadPdf")?.addEventListener("click", function () {
        let canvas = document.getElementById("screenshotCanvas");
        let imgData = canvas.toDataURL("image/jpeg");

        let pdfWidth = (canvas.width * 0.264583); // Convert px to mm (1px = 0.264583mm)
        let pdfHeight = (canvas.height * 0.264583);

        let pdf = new jsPDF({
        orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight] // Exact size of the image
        });

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("screenshot.pdf");

    });
});
