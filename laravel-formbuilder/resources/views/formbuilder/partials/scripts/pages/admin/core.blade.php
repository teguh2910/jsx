        function getAdminData() {
            const isSuperadmin = currentUser && currentUser.role === "superadmin";
            const allowedTemplates = isSuperadmin
                ? templates
                : templates.filter(t => t.department === currentUser.department || !t.department);
            const allowedSubs = isSuperadmin
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

        async function saveTemplateEditor() {
            if (!editorDraft.name.trim()) {
                showToast("Form name is required", "error");
                return;
            }
            if (!editorDraft.department) {
                showToast("Department is required", "error");
                return;
            }

            try {
                await apiRequest("/templates", {
                    method: "POST",
                    body: editorDraft,
                });
                await loadAppData();
            } catch (e) {
                showToast(e.message || "Failed to save form", "error");
                return;
            }

            adminPage = "forms";
            editorDraft = null;
            showToast("Form saved");
            renderAdmin();
        }

        function renderAdmin() {
            if (!currentUser) return;
            const roleLabel = currentUser.role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
            document.getElementById("admin-user-name").textContent = currentUser.name;
            document.getElementById("admin-user-role").textContent = roleLabel;

            const navBtns = [...document.querySelectorAll("[data-admin-page]")];
            navBtns.forEach(btn => {
                const page = btn.dataset.adminPage;
                btn.classList.toggle("active", page === adminPage);
                const isRestricted = (page === "departments" || page === "users") && currentUser.role !== "superadmin";
                btn.classList.toggle("hidden", isRestricted);
            });

            const { allowedTemplates, allowedSubs } = getAdminData();
            const content = document.getElementById("admin-content");


