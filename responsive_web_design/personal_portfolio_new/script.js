"use strict";
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

// \projects\blender3d.mb page related
function apply_corner_dots() {
    const elements = document.getElementsByClassName("blender-content");
    const dot_array = ["bd-top bd-left", "bd-top bd-right", "bd-bottom bd-left", "bd-bottom bd-right"];

    elements.forEach(elem => {
        for (let i = 0; i < dot_array.length; i++) {
            const dot = document.createElement("div");
            dot.classList.add("blender-dot");
            dot.className += " " + dot_array[i];
            elem.append(dot);
        }
    })
}

class Slideshow {
    constructor(name, image_links, text_inputs, urls = []) {
        this.image_src = image_links;
        this.text = text_inputs;
        this.urls = urls;
        this.state = {
            index: 0,
            image: null,
            link: null,
            render_obj: null,
        };

        this.internal_id = name;

        this.generate = this.generate.bind(this);
        this.render = this.render.bind(this);
        this.load_next = this.load_next.bind(this);
    }

    load_next = () => {

        this.state.index < this.image_src.length -1 ? this.state.index++ : this.state.index = 0;
    }

    load_previous = () => this.state.index > 0 ? this.state.index-- : this.state.index = this.image_src.length - 1;

    generate() {
        const link_ext = document.createElement("a");
        const img_ext = document.createElement("div");
        const img = document.createElement("img");

        link_ext.innerHTML = this.text[this.state.index];

        if (this.urls.length > 0) {
            link_ext.setAttribute("target", "_blank");
            link_ext.setAttribute("href", this.urls[this.state.index]);
            link_ext.classList.add("slideshow-link");
        }
        link_ext.classList.add("slideshow-text");

        img.setAttribute("src", "image_files\\blender3d\\" + this.image_src[this.state.index]);
        img.classList.add("slideshow-image");
        
        img_ext.append(img);
        img_ext.style.display = "flex";
        img_ext.style.justifyContent = "center";
        img_ext.style.flexDirection = "column";

        this.state.image = img_ext;
        this.state.link = link_ext;
    }

    #button(left = true) {
        const button = document.createElement("a");
        button.classList.add("slideshow-controls");

        button.innerHTML = left ? "&lt;" : "&gt;";
        if (left) {
            button.style.left = "0";
        } else {
            button.style.right = "0";
        }

        return button;
    }

    re_render() {
        const render_elem = this.state.render_obj;
        const img = render_elem.children[0].children[0];
        const text = render_elem.children[1];

        img.setAttribute("src", "image_files\\blender3d\\" + this.image_src[this.state.index]);
        text.innerHTML = this.text[this.state.index];
    }

    render(target) {
        this.generate();

        const button_left = this.#button(true);
        const button_right = this.#button(false);
        button_left.addEventListener("click", ()=>{
            this.load_previous();
            this.re_render();
        })
        button_right.addEventListener("click", ()=>{
            this.load_next();
            this.re_render();
        })

        if (target.getAttribute("data-slideshow-id") == this.internal_id) {
            target.style.height = target.offsetHeight + "px";
            target.innerHTML = "";
        } else {
            target.setAttribute("data-slideshow-id", this.internal_id);
        }
        this.state.image.append(button_left);
        this.state.image.append(button_right);

        target.append(this.state.image);
        target.append(this.state.link);

        target.style.height = "";

        this.state.render_obj = target;
    }
}

const unturned_img = ["unturned_rwp.jpg", "unturned_freedom.jpg", "uturned_bacon.jpg"]
const unturned_text = [
    "The first released pack. Initially 35 and later 39 weapons were included.",
    "Second time around I shifted my focus more towards making fewer higher quality guns",
    "The last one I released, now with even fewer guns, but with added custom accessories like optics and night vision"
];
const unturned_links= [
    "https://steamcommunity.com/sharedfiles/filedetails/?id=491742834",
    "https://steamcommunity.com/sharedfiles/filedetails/?id=529767203",
    "https://steamcommunity.com/sharedfiles/filedetails/?id=650720137"
];

const today_img = ["today_rack_1.png", "today_rack_2.png", "today_receiver.png", "today_magazine.png", "today_rifle.png"];
const today_text = [
    "CAD drawing of the squat rack, with connecting plugs. Orthographic view",
    "Simple render of final design, including 110kg of weights.",
    "Stripped lower receiver model.",
    "Magazine model, includes realistic follower and bottom plate.",
    "Dissassembled fictitious rifle. Includes realistic components."
];

// TAB SYSTEM
/* 
 * .nav-link-active - the tab is present on the navbar
 * .nav-link-focus - the tab is currently the open tab / tab in view
 * .nav-link-preview - the tab is temporarily open
 */ 

// Get a link corresponding to a tab
const project_link = (innerHTML) => {
    const link = document.createElement("a");
    link.classList.add("project-link");
    link.classList.add("open-link");
    link.innerHTML = '<img class="file-img" src="image_files/mb_logo.svg"></img>' + innerHTML;
    link.addEventListener("click", () => {focus_tab(innerHTML);});

    return link;
}


const get_tab_id = navlink_id => navlink_id.slice(0,-5);
const tab_navlink = tab_id => document.getElementById(tab_id + "-link");

class tab_interface {
    static active_tabs = [];
    static tab_in_preview = "";
    static tab_in_focus = "";
    
    static is_active = tab_id => this.active_tabs.indexOf(tab_id) > -1;
    static is_in_focus = tab_id => this.tab_in_focus == tab_id;
    static is_in_preview = tab_id => this.tab_in_preview == tab_id;
    static dock_previewed() {
        document.getElementById(this.tab_in_preview + "-link").classList.remove("nav-link-preview");
        this.tab_in_preview = "";
    }
    static un_focus() {
        document.getElementById(this.tab_in_focus).classList.remove("tab-view");
        tab_navlink(this.tab_in_focus).classList.remove("nav-in-focus");
        this.tab_in_focus = "";
    }
    static refresh_tab_order() {
        this.active_tabs.forEach(elem => {
            tab_navlink(elem).style.order = this.active_tabs.indexOf(elem);
        })
    }
}

const TI = tab_interface;

function dock_tab(tab_id) {
    const navbar_link = tab_navlink(tab_id);

    if (TI.active_tabs.length == 0) 
        document.getElementById("welcome-inner").style.display = "none";

    TI.active_tabs.push(tab_id);

    navbar_link.style.order = TI.active_tabs.indexOf(tab_id);
    navbar_link.classList.add("nav-link-active");
}

function preview_tab(tab_id) {
    dock_tab(tab_id);
    TI.tab_in_preview = tab_id;
    
    tab_navlink(tab_id).classList.add("nav-link-preview");

    focus_tab(tab_id);
}

function close_tab(tab_id) {
    if (TI.is_in_preview(tab_id)) {
        TI.dock_previewed();
        return close_tab(tab_id);
    }

    if (TI.is_in_focus(tab_id)) TI.un_focus();

    const current_index = TI.active_tabs.indexOf(tab_id);

    tab_navlink(tab_id).classList.remove("nav-link-active");
    TI.active_tabs.splice(current_index,1);
    TI.refresh_tab_order();

    link_manager: {
        const active_links = document.getElementsByClassName("open-link");
        for (const active_link of active_links) {
            if (active_link.textContent == tab_id)
                active_link.remove();
        }
        if (active_links.length == 0)
            document.querySelector("#open-tabs-inner").children[0].style.display = "unset";
    }

    // Focus on left tab until there are no more tab
    if (current_index > 0) {
        focus_tab(TI.active_tabs[current_index - 1]);
    } else if (current_index == 0) {
        TI.active_tabs.length ? focus_tab(TI.active_tabs[0]) : document.getElementById("welcome-inner").style.display = "flex";
        focus_tab(TI.active_tabs[0]);
    }
}

function focus_tab(tab_id) {

    // Prevent focus call when closing the tab as close button click also entails navlink click
    if (!TI.is_active(tab_id)) return;

    if (TI.tab_in_focus.length > 0) 
        if (TI.tab_in_focus == tab_id) {
            return;
        } else { TI.un_focus(); }

    tab_navlink(tab_id).classList.add("nav-in-focus");
    document.getElementById(tab_id).classList.add("tab-view");
    TI.tab_in_focus = tab_id;
}

function select_tab_action(tab_id, preview_request) {
    if (preview_request) {
        if (TI.is_active(tab_id)) {
            TI.is_in_focus(tab_id) ? null : focus_tab(tab_id);
        } else {
            if (TI.tab_in_preview.length)
                close_tab(TI.tab_in_preview);
            preview_tab(tab_id);
        }
    } else {
        if (TI.is_in_preview(tab_id)) {
            const open_tabs_inner = document.querySelector("#open-tabs-inner");

            TI.dock_previewed();
            if (TI.active_tabs.length == 1 && !TI.tab_in_preview.length) open_tabs_inner.children[0].style.display = "none";
            open_tabs_inner.append(project_link(tab_id));
        }
        TI.is_in_preview(tab_id) ? TI.dock_previewed() : null ;
    }
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
            focus_tab(get_tab_id(navlink.id));
        })

        navlink.children[0].addEventListener("click", () => {
            close_tab(get_tab_id(navlink.id));
        })
    }

    // explorer link functionality
    for (const tab_projectlink of document.getElementsByClassName("project-link")) {
        
        tab_projectlink.addEventListener("click", () => {
            select_tab_action(tab_projectlink.textContent, true);
        })
        tab_projectlink.addEventListener("dblclick", () => {
             select_tab_action(tab_projectlink.textContent, false);
        })
    }

    // apply corner dots on blender page'
    apply_corner_dots();
    const unturned_slideshow = new Slideshow("unturned", unturned_img, unturned_text, unturned_links);
    unturned_slideshow.render(document.querySelector("#blender-unturned-slideshow"));

    const today_slideshow = new Slideshow("today", today_img, today_text);
    today_slideshow.render(document.querySelector("#blender-today-slideshow"));
}