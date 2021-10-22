

window.onunload = () => {
    window.scrollTo(0,0);
}

// handle navbar horizontal scroll on zoom
window.onscroll = () => {
        const scrollPos = this.scrollX;
        document.getElementById("nav-bar").style.left = -scrollPos + "px";
}

// make internal links scroll the height of the navbar added
const push_scroll = () => {
    setTimeout(
        ()=>{window.scrollBy(0,-document.getElementById("nav-bar").offsetHeight)}, 5
    );
}