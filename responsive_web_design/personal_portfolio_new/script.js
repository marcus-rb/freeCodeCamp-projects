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

const tab_order = {
    get_tab_amount: () => {
        // how many tabs are open?
        return document.getElementsByClassName("nav-link-active").length;
    },
    get_temp_tab_number: () => {

        for (const tab of document.getElementsByClassName("nav-link-active")) {
            if (tab.classList.contains("nav-link-view")) return parseInt(tab.style.order);
        }
        return undefined;
    }
}

const update_tab_order = () => {
    let order = 0;
    for (const link of document.getElementsByClassName("nav-link")) {
        if(link.classList.contains("nav-link-active")) {
            link.style.order = order;
            order++;
        }
    }
}

// returns a project link, for use in open tabs view
const project_link = (innerHTML) => {
    const elem = document.createElement("a");
    elem.classList.add("project-link");
    elem.innerHTML = '<img class="file-img" src="image_files/mb_logo.svg"></img>' + innerHTML;

    return elem;
}

// focus on open tab
const focus_tab = (tab_id) => {

    // if tab is being closed do not focus
    if (!document.getElementById(tab_id+"-link").classList.contains("nav-link-active")) return;

    for (const tab of document.getElementsByClassName("tab-view")) {
        tab.classList.toggle("tab-view");
    }

    for (const tab_link of document.getElementsByClassName("nav-in-focus")) {
        tab_link.classList.toggle("nav-in-focus");
    }

    document.getElementById(tab_id + "-link").classList.toggle("nav-in-focus");
    document.getElementById(tab_id).classList.toggle("tab-view");
}

// open a tab
const open_tab = (tab_id) => {

    if (document.getElementsByClassName("nav-link-active").length == 0) 
        document.getElementById("welcome-inner").style.display = "none";

    const tab_link = document.getElementById(tab_id + "-link");

    // if already open do nothing
    if (tab_link.classList.contains("nav-link-active")) return;

    tab_link.classList.toggle("nav-link-active");
}
 
// close a tab
const close_tab = (tab_id) => {
    const tab = document.getElementById(tab_id);
    const tab_link = document.getElementById(tab_id + "-link");

    // remove view class from tab if in focus
    if (tab_link.classList.contains("nav-in-focus"))
        tab.classList.toggle("tab-view");

    tab_link.classList.toggle("nav-link-active");
    tab_link.classList.contains("nav-link-view") ? tab_link.classList.toggle("nav-link-view") : null ;

    update_tab_order();
    // temp next open tab
    for (const open_tab of document.getElementsByClassName("nav-link-active")) {
        focus_tab(open_tab.id.slice(0,-5));
        return;
    }

    // no more tabs: re-render welcome:
    document.getElementById("welcome-inner").style.display = "flex";
}

// view a tab without docking 
const view_tab = (tab_id) => {
    
    const tab_link = document.getElementById(tab_id + "-link");

    // if open - change
    if (tab_link.classList.contains("nav-link-active")) {
        focus_tab(tab_id);
        return;
    }

    // if already in view - do nothing
    if (tab_link.classList.contains("nav-link-view")) return;

    if (tab_order.get_temp_tab_number() === undefined) {
        console.log("push temp tab to the back!");
        tab_link.style.order = tab_order.get_tab_amount() + 1;
    } else {
        console.log("replace temp tab!");
        tab_link.style.order = tab_order.get_temp_tab_number();
    }

    // close other temporary open tabs:
    if (document.getElementsByClassName("nav-link-view").length) {
        close_tab(
            document.getElementsByClassName("nav-link-view")[0].id.slice(0,-5)
        );
    }

    open_tab(tab_id);
    focus_tab(tab_id);
 
    tab_link.classList.toggle("nav-link-view");
}

// add a tab to dock, and focus
const activate_tab = (tab_id) => {
    const tab_link = document.getElementById(tab_id + "-link");

    open_tab(tab_id);

    tab_link.style.order = tab_order.get_tab_amount() + 1;
    document.getElementById("placeholder-open-tabs").style.display = "none";
    document.getElementById("open-tabs-inner").appendChild(project_link(tab_id));

    focus_tab(tab_id);



    if (tab_link.classList.contains("nav-link-view")) {
        tab_link.classList.toggle("nav-link-view");
    }
}

// changing visibility of close button
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

        // close tab when pressing x
        navlink.children[0].addEventListener("click", () => {
            close_tab(navlink.id.slice(0, -5));
        })

        // focus to a tab if link open
        navlink.addEventListener("click", () => {
            if (navlink.classList.contains("nav-in-focus")) return;
            focus_tab(navlink.id.slice(0,-5));
        })
    }

    // view tab on single click
    // activate tab on double click
    for (const tablink of document.getElementsByClassName("project-link")) {
        
        tablink.addEventListener("click", () => {
            if (tablink.classList.contains("nav-link-view")) return;
            view_tab(tablink.textContent);
        })
        tablink.addEventListener("dblclick", () => {
            if (tablink.classList.contains("nav-link-active")) return;
            activate_tab(tablink.textContent);
        })
    }
}