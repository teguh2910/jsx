                document.getElementById("btn-editor-back").addEventListener("click", () => {
                    editorDraft = null;
                    adminPage = "forms";
                    renderAdmin();
                });
                document.getElementById("btn-editor-cancel").addEventListener("click", () => {
                    editorDraft = null;
                    adminPage = "forms";
                    renderAdmin();
                });
                document.getElementById("btn-editor-save").addEventListener("click", () => {
                    editorDraft.name = document.getElementById("ed-name").value.trim();
                    editorDraft.description = document.getElementById("ed-description").value.trim();
                    if (currentUser.role === "superadmin") editorDraft.department = document.getElementById("ed-department").value;
                    const prereq = document.getElementById("ed-prereq");
                    if (prereq) editorDraft.prerequisiteFormId = prereq.value || null;
                    saveTemplateEditor();
                });
                content.querySelectorAll(".btn-editor-tab").forEach(btn => {
                    btn.addEventListener("click", () => {
                        editorTab = btn.dataset.tab;
                        renderAdmin();
                    });
                });

