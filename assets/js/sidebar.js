document.addEventListener("DOMContentLoaded", function () {
    let sidebarPath = window.location.pathname.includes("/blog/") ? "../sidebar.html" : "sidebar.html";

    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("sidebar-container").innerHTML = data;

            const sidebar = document.getElementById("sidebar");
            let toggleButton = document.querySelector(".toggle");

            // If no toggle button exists, create one dynamically
            if (!toggleButton) {
                toggleButton = document.createElement("a");
                toggleButton.href = "#sidebar";
                toggleButton.classList.add("toggle");
                toggleButton.innerText = "☰"; // Hamburger menu icon
                document.body.appendChild(toggleButton); // Append to body (outside sidebar)
            }

            // Ensure toggle button works
            toggleButton.addEventListener("click", function (event) {
                event.preventDefault();
                sidebar.classList.toggle("inactive");
            });

            // Close sidebar when clicking outside (BUT keep toggle button visible)
            document.addEventListener("click", function (event) {
                const isClickInsideSidebar = sidebar.contains(event.target);
                const isClickOnToggleButton = toggleButton.contains(event.target);
                // Add media screen max 1680 px as condition for sidebar to close
                const isSmallScreen = window.matchMedia("(max-width: 1680px)").matches;


                if (!isClickInsideSidebar && !isClickOnToggleButton && isSmallScreen) {
                    sidebar.classList.add("inactive");
                }
            });

            // Close sidebar when pressing ESC
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    sidebar.classList.add("inactive");
                }
            });

            // Enable expandable menu
            document.querySelectorAll(".opener").forEach(function (opener) {
                opener.addEventListener("click", function () {
                    this.classList.toggle("active");
                    const submenu = this.nextElementSibling;
                    if (submenu && submenu.tagName === "UL") {
                        submenu.style.display = submenu.style.display === "block" ? "none" : "block";
                    }
                });
            });

            // Enable swipe-to-close on mobile
            let touchStartX = null;

            sidebar.addEventListener("touchstart", function (event) {
                touchStartX = event.touches[0].clientX;
            });

            sidebar.addEventListener("touchmove", function (event) {
                if (!touchStartX) return;
                let diffX = touchStartX - event.touches[0].clientX;
                if (diffX > 50) {
                    sidebar.classList.add("inactive");
                }
                touchStartX = null;
            });

        })
        .catch(error => console.error("Error loading sidebar:", error.message));
});
