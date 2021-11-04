
// Sidebar functionality

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

let toggle_folder = (folder_elem) => {
    for (const child of folder_elem.children) {

        if (!child.classList.contains("folder-header")) {
            
            child.classList.toggle("folder-hidden");

        } else {

            child.children[0].classList.toggle("folder-toggle-rotate");

        }
    }
}

// \about\other.mb page related
function syntax_highlight_json_page() {
    const target_element = document.querySelector("#other-json");

    const string_pattern = /".*?"/g;
    const number_pattern = /\d+/g;

    let html_str = target_element.innerHTML;
    
    target_element.innerHTML.match(number_pattern).forEach((match)=>{
        html_str = html_str.replace(match, `<span style="color: #51c97b;">${match}</span>`);
    })
    target_element.innerHTML.match(string_pattern).forEach((match) => {
        html_str = html_str.replace(match, `<span style="color: #d46371;">${match}</span>`);
    });

    target_element.innerHTML = html_str;
}

function reveal_json() {
    syntax_highlight_json_page();

    document.getElementById("other-intro").style.display = "none";
    document.getElementById("other-json").style.display = "block";
}


// TAB SYSTEM
/* 
 * .nav-link-active - the tab is present on the navbar
 * .nav-link-focus - the tab is currently the open tab / tab in view
 * .nav-link-preview - the tab is temporarily open
 */ 

const tab_order_interface = {
    get_tab_amount: function() {
        return document.getElementsByClassName("nav-link-active").length;
    },
    refresh_tab_order: function() {
        let order = 1;
        for (const link of document.getElementsByClassName("nav-link")) {
            link.style.order = "unset";
            if(link.classList.contains("nav-link-active")) {
                link.style.order = order;
                order++;
            }
        }
    },
    current_open_index: null
};

// Get a link corresponding to a tab
const project_link = (innerHTML) => {
    const link = document.createElement("a");
    link.classList.add("project-link");
    link.classList.add("open-link");
    link.innerHTML = '<img class="file-img" src="image_files/mb_logo.svg"></img>' + innerHTML;
    link.addEventListener("click", () => {focus_tab(innerHTML);});

    return link;
}

// - Focus on a tab on the dock -
function focus_tab(tab_id)  {

    // if tab is being closed do not focus 
    // (clicking close also triggers the onclick for the element below it, which triggers focus)
    if (!document.getElementById(tab_id+"-link").classList.contains("nav-link-active")) return;

    for (const tab of document.getElementsByClassName("tab-view")) {
        tab.classList.remove("tab-view");
    }

    for (const tab_navlink of document.getElementsByClassName("nav-in-focus")) {
        tab_navlink.classList.remove("nav-in-focus");
    }

    document.getElementById(tab_id + "-link").classList.add("nav-in-focus");
    document.getElementById(tab_id).classList.add("tab-view");
}

// - Add tab to dock -
function dock_tab(tab_id) {
    const tab_navlink = document.getElementById(tab_id + "-link");

    if (document.getElementsByClassName("nav-link-active").length == 0) 
        document.getElementById("welcome-inner").style.display = "none";

    // if already open do nothing
    if (tab_navlink.classList.contains("nav-link-active")) return;

    tab_navlink.classList.add("nav-link-active");
    tab_navlink.style.order = tab_order_interface.get_tab_amount();
}
 
// - Close tab and remove from dock -
function close_tab(tab_id, switching_preview_tab = false) {
    const tab = document.getElementById(tab_id);
    const tab_navlink = document.getElementById(tab_id + "-link");
    const next_dock_tab = tab_navlink.style.order - 1;

    // remove view class from tab if in focus
    if (tab_navlink.classList.contains("nav-in-focus"))
        tab.classList.remove("tab-view");

    tab_navlink.classList.remove("nav-link-active");
    if (switching_preview_tab) {
        tab_navlink.style.order = "unset";
        tab_navlink.classList.remove("nav-link-preview");
    } else {
        tab_navlink.classList.contains("nav-link-preview") ? tab_navlink.classList.remove("nav-link-preview") : null ;
        tab_order_interface.refresh_tab_order();
    }

    

    if (!switching_preview_tab) {
        tab_order_interface.refresh_tab_order();
    } else { tab_navlink.style.order = "unset"; }

    // remove link from "open tabs" section. Display "nothing here yet" if no more links are present
    for (const link of document.getElementById("open-tabs-inner").children) {
        if (link.textContent == tab_navlink.id.slice(0,-5)) {
            document.getElementById("open-tabs-inner").removeChild(link);   
        }
    }
    if (!document.getElementsByClassName("open-link").length) 
        document.getElementById("placeholder-open-tabs").style.display = "unset";

    
    // focus on next tab left until there are noe more tabs to open
    const active_tab_navlinks = document.getElementsByClassName("nav-link-active");

    if (next_dock_tab) {
        active_tab_navlinks.forEach((link)=>{

            if (link.style.order == next_dock_tab) {
                focus_tab(link.id.slice(0,-5));
                return;
            }
        });
    } else if (next_dock_tab == 0) {
        if (active_tab_navlinks.length) {
            active_tab_navlinks.forEach((link) => {
                if (link.style.order == 1) {
                    focus_tab(link.id.slice(0,-5));
                    return;
                }
            })
        } else {
            document.getElementById("welcome-inner").style.display = "flex";
        }
    }
}

// - Open and dock tab, but add flag(.nav-link-preview) so that next opened tab will replace this -
function preview_tab(tab_id) {
    const tab_navlink = document.getElementById(tab_id + "-link");

    // Already active? No need to open
    if (tab_navlink.classList.contains("nav-link-active")) {
        focus_tab(tab_id);
        return;
    }

    // If another tab is temporarily open, close it
    if (document.getElementsByClassName("nav-link-preview").length) {
        close_tab(
            document.getElementsByClassName("nav-link-preview")[0].id.slice(0,-5), true
        );
    }

    dock_tab(tab_id);
    focus_tab(tab_id);
 
    tab_navlink.classList.add("nav-link-preview");
}

// View and dock tab
function activate_tab(tab_id) {
    const tab_navlink = document.getElementById(tab_id + "-link");

    // if tab is already active, do nothing
    if (tab_navlink.classList.contains("nav-link-active") && !tab_navlink.classList.contains("nav-link-preview")) {
        return;
    }

    dock_tab(tab_id);
    focus_tab(tab_id);
    tab_navlink.classList.remove("nav-link-preview");

    // controlling the "Active tabs" section in the explorer
    document.getElementById("placeholder-open-tabs").style.display = "none";
    document.getElementById("open-tabs-inner").appendChild(project_link(tab_id));
}

const toggle_close_tab_button = (elem)  => {
    elem.children[0].classList.toggle("visible");
}

// --- END OF TABS SECTION ---

window.onload = () => {

    // collapse all explorer folders
    toggle_folder(document.getElementById("explorer-open-editors"));
    toggle_folder(document.getElementById("explorer-files"));
    toggle_folder(document.getElementById("about"));
    toggle_folder(document.getElementById("projects"));


    // navbar link functionality
    for (const navlink of document.getElementsByClassName("nav-link")) {
        navlink.addEventListener("mouseenter", () => {
            toggle_close_tab_button(navlink);
        })
        navlink.addEventListener("mouseleave", () => {
            toggle_close_tab_button(navlink);
        })
        navlink.addEventListener("click", () => {
            if (navlink.classList.contains("nav-in-focus")) return;
            focus_tab(navlink.id.slice(0,-5));
        })

        navlink.children[0].addEventListener("click", () => {
            close_tab(navlink.id.slice(0, -5));
        })
    }

    // explorer link functionality
    for (const tab_projectlink of document.getElementsByClassName("project-link")) {
        
        tab_projectlink.addEventListener("click", () => {
            preview_tab(tab_projectlink.textContent);
        })
        tab_projectlink.addEventListener("dblclick", () => {
            activate_tab(tab_projectlink.textContent);
        })
    }
}