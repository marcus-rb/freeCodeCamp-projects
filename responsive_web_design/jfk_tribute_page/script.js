// Handling constant aspect ratio for timeline images

const images = document.getElementsByClassName("timeline-img");
const scaleImages = () => {
    for (const image of images) {
        image.style.height = image.offsetWidth * 9 / 16 + "px";
    }
    console.log("scaling...");
}

window.onload = scaleImages;
window.onresize = scaleImages;