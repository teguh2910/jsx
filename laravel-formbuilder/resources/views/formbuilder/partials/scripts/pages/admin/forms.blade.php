            if (adminPage === "forms") {
                content.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <h2 style="margin:0;color:var(--primary)">Forms</h2>
                        <button id="btn-new-template" class="btn btn-primary">New Form</button>
                    </div>
                    <div class="grid">
                        ${allowedTemplates.map(t => `
                            <div class="card" style="padding:16px">
                                <h4 style="margin:0 0 6px;color:var(--primary)">${t.name}</h4>
                                <div class="muted" style="margin-bottom:6px">${t.description || "-"}</div>
                                <div class="muted" style="margin-bottom:10px">${t.fields.length} fields</div>
                                <div style="display:flex;gap:6px;flex-wrap:wrap">
                                    <button class="btn btn-outline btn-edit-template" data-id="${t.id}" style="padding:6px 10px;font-size:12px;">Edit</button>
                                    <button class="btn btn-ghost btn-toggle-template" data-id="${t.id}" style="padding:6px 10px;font-size:12px;background:var(--light);">${t.published ? "Unpublish" : "Publish"}</button>
                                    <button class="btn btn-ghost btn-delete-template" data-id="${t.id}" style="padding:6px 10px;font-size:12px;color:var(--danger);">Delete</button>
                                </div>
                            </div>
                        `).join("") || `<div class="card"><p class="muted">No forms available.</p></div>`}
                    </div>
                `;
                const btnNew = document.getElementById("btn-new-template");
                if (btnNew) btnNew.addEventListener("click", () => openTemplateEditor());
                content.querySelectorAll(".btn-edit-template").forEach(btn => {
                    btn.addEventListener("click", () => openTemplateEditor(btn.dataset.id));
                });
                content.querySelectorAll(".btn-toggle-template").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        try {
                            await apiRequest(`/templates/${btn.dataset.id}/toggle-publish`, {
                                method: "POST",
                            });
                            await loadAppData();
                            showToast("Form status updated");
                            renderAdmin();
                        } catch (e) {
                            showToast(e.message || "Failed to update publish status", "error");
                        }
                    });
                });
                content.querySelectorAll(".btn-delete-template").forEach(btn => {
                    btn.addEventListener("click", async () => {
                        try {
                            await apiRequest(`/templates/${btn.dataset.id}`, {
                                method: "DELETE",
                            });
                            await loadAppData();
                            showToast("Form deleted");
                            renderAdmin();
                        } catch (e) {
                            showToast(e.message || "Failed to delete form", "error");
                        }
                    });
                });
                return;
            }


