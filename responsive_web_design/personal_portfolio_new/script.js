console.log("script initialized..")


const toggle_explorer = () => {
    const explorer = document.getElementById("explorer");
    const explorer_toggle = document.getElementById("explorer-sidebar");

    if (explorer.classList.length) { // hide
        explorer.className = "";
        explorer_toggle.style.left = 0;
        explorer_toggle.innerHTML = "&gt;"
    } else { // reveal
        explorer.className = "side-content-visible";
        explorer_toggle.style.left = explorer.offsetWidth + "px";
        explorer_toggle.innerHTML = "&lt;"
    }
}

// old folder toggle buttons

const initialized_toggle = [];


let toggle_folder = (node) => {
    for (const child of node.children) {

        if (!child.classList.contains("folder-header")) {
            
            child.classList.toggle("folder-hidden");

        } else {

            child.children[0].classList.toggle("folder-toggle-rotate");

        }
    }
}
