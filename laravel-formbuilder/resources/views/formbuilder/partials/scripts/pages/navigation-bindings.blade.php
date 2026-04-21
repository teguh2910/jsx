        document.getElementById("btn-open-login").addEventListener("click", () => showView("login"));
        document.getElementById("btn-back-home").addEventListener("click", () => showView("landing"));
        document.getElementById("btn-open-fill").addEventListener("click", () => { renderTemplateList(); showView("fillList"); });
        document.getElementById("btn-open-track").addEventListener("click", () => showView("track"));
        document.getElementById("btn-fill-list-back").addEventListener("click", () => showView("landing"));
        document.getElementById("btn-fill-form-back").addEventListener("click", () => showView("fillList"));
        document.getElementById("btn-track-back").addEventListener("click", () => showView("landing"));
        document.getElementById("btn-submit-form").addEventListener("click", submitForm);
        document.getElementById("btn-track-search").addEventListener("click", searchTrack);
        document.getElementById("btn-admin-logout").addEventListener("click", () => {
            currentUser = null;
            adminPage = "dashboard";
            showView("landing");
            showToast("Logged out");
        });
        document.querySelectorAll("[data-admin-page]").forEach(btn => {
            btn.addEventListener("click", () => {
                adminPage = btn.dataset.adminPage;
                renderAdmin();
            });
        });


