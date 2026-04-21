        function getAdminData() {
            const allowedTemplates = currentUser && currentUser.role === "superadmin"
                ? templates
                : templates.filter(t => t.department === currentUser.department || !t.department);
            const allowedSubs = currentUser && currentUser.role === "superadmin"
                ? submissions
                : submissions.filter(s => s.department === currentUser.department || !s.department);
            return { allowedTemplates, allowedSubs };
        }

        function openTemplateEditor(templateId = null) {
            if (templateId) {
                const found = templates.find(t => t.id === templateId);
                if (!found) return;
                editorDraft = JSON.parse(JSON.stringify(found));
            } else {
                editorDraft = {
                    id: genTplId(),
                    name: "",
                    description: "",
                    department: currentUser.role === "superadmin" ? "" : currentUser.department,
                    published: false,
                    approvalFlow: [],
                    fields: [],
                };
            }
            editorTab = "fields";
            adminPage = "formEditor";
            renderAdmin();
        }

        function saveTemplateEditor() {
            if (!editorDraft.name.trim()) {
                showToast("Form name is required", "error");
                return;
            }
            if (!editorDraft.department) {
                showToast("Department is required", "error");
                return;
            }

            const idx = templates.findIndex(t => t.id === editorDraft.id);
            if (idx >= 0) templates[idx] = JSON.parse(JSON.stringify(editorDraft));
            else templates.push(JSON.parse(JSON.stringify(editorDraft)));

            adminPage = "forms";
            editorDraft = null;
            showToast("Form saved");
            renderAdmin();
        }

        function renderAdmin() {
            if (!currentUser) return;
            const roleLabel = currentUser.role === "superadmin" ? "Super Administrator" : "Dept. Admin";
            document.getElementById("admin-user-name").textContent = currentUser.name;
            document.getElementById("admin-user-role").textContent = roleLabel;
            if (currentUser.role !== "superadmin" && (adminPage === "departments" || adminPage === "users")) {
                adminPage = "dashboard";
            }

            const navBtns = [...document.querySelectorAll("[data-admin-page]")];
            navBtns.forEach(btn => {
                const page = btn.dataset.adminPage;
                btn.classList.toggle("active", page === adminPage);
                const isRestricted = (page === "departments" || page === "users") && currentUser.role !== "superadmin";
                btn.classList.toggle("hidden", isRestricted);
            });

            const { allowedTemplates, allowedSubs } = getAdminData();
            const content = document.getElementById("admin-content");


