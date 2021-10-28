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

let toggle_folder = (node) => {
    for (const child of node.children) {

        if (!child.classList.contains("folder-header")) {
            
            child.classList.toggle("folder-hidden");

        } else {

            child.children[0].classList.toggle("folder-toggle-rotate");

        }
    }
}


// TAB SYSTEM

// add a tab to dock, and focus
const activate_tab = (tab_id) => {



    // remove nav-in-focus class from other tabs
    for (const link of document.getElementsByClassName("nav-link")) {
        if (link.classList.contains("nav-in-focus")) {
            link.classList.toggle("nav-in-focus");
        }
    }

    // unfocus other tabs
    for (const tab of document.getElementsByClassName("tab")) {
        if (tab.classList.contains("tab-view")) {
            tab.classList.toggle("tab-view");
        }
    }

    const tab = document.getElementById(tab_id);
    const tab_link = document.getElementById(tab_id+"-link");
    console.log(tab_id);

    tab_link.classList.toggle("nav-link-active");

    view_tab(tab.id);

    tab_link.classList.toggle("nav-in-focus");
    tab.classList.toggle("tab-view");
    tab_link.children[0].style.visibility = "visible";
}

// unfocus and remove from dock
const close_tab = (tab_id) => {
    console.log(tab_id)
    // reveal background
    document.getElementById("welcome-inner").style.display = "flex";
};

// view, but do not put in dock
const view_tab = (tab_id) => {
    const tab = document.getElementById(tab_id);
    const tab_link = document.getElementById(tab_id + "-link");

    // 1. Check if there is another tab being viewed that is not set to open
    for (const open_tab of document.getElementsByClassName("nav-link")) {
        if (open_tab.classList.contains("nav-link-view")) {
            open_tab.classList.toggle("nav-link-view")
        }
    }

    if (tab_link.classList.contains("nav-link-active"));

    // if viewing not open - hide that tab, and view this
    // if no only viewing tabs - open new


}

const focus_tab = (tab_id) => {
    
}



const toggle_close_tab = (elem)  => {
    elem.children[0].classList.toggle("visible");
}

// on page load
window.onload = () => {

    // collapse all folders
    toggle_folder(document.getElementById("explorer-open-editors"));
    toggle_folder(document.getElementById("explorer-folder"));
    toggle_folder(document.getElementById("about"));
    toggle_folder(document.getElementById("projects"));


    // visible on hover for navlink cross out
    for (const navlink of document.getElementsByClassName("nav-link")) {
        navlink.addEventListener("mouseenter", () => {
            //console.log("mouse enter");
            toggle_close_tab(navlink);
        })
        navlink.addEventListener("mouseleave", () => {
            toggle_close_tab(navlink);
        })

        navlink.children[0].addEventListener("click", () => {
            close_tab(navlink.id.slice(0, -5));
        })

        // focus to a tab if 
        navlink.addEventListener("click", () => {
            if (navlink.classList.contains("nav-in-focus")) return;
            console.log("focusing!");
            focus_tab(navlink.textContent);
        })
    }

    // view tab on single click
    // activate tab on double click
    for (const tablink of document.getElementsByClassName("project-link")) {
        
        tablink.addEventListener("click", () => {
            console.log("viewing tab");
            view_tab(tablink.textContent);
        })
        tablink.addEventListener("dblclick", () => {
            if (tablink.classList.contains("nav-link-active")) return;
            console.log("activating tab");
            activate_tab(tablink.textContent);
        })
    }
}