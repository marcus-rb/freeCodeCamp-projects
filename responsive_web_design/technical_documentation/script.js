const toggle_navbar = () => {
    const navbar = document.getElementById("navbar");
    const navbar_toggle = document.getElementById("nav-bar-toggle");

    if (navbar.classList.length) { // Remove "visible modifier"
        navbar.classList = "";
        navbar_toggle.classList = ""
        navbar_toggle.innerHTML = "&gt;"
    } else {
        navbar.classList = "nav-small-reveal";
        navbar_toggle.classList = "nav-small-toggle-reveal";
        navbar_toggle.innerHTML = "&lt";
    }
}