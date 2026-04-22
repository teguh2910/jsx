                const addApproverBtn = document.getElementById("btn-add-approver");
                if (addApproverBtn) {
                    addApproverBtn.addEventListener("click", () => {
                        const roleOptions = [...new Set((users || [])
                            .map(u => (u.role || "").trim())
                            .filter(Boolean))];
                        const defaultRole = roleOptions[0] || "spv";
                        editorDraft.approvalFlow.push({
                            id: `APR-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
                            role: defaultRole,
                        });
                        renderAdmin();
                    });
                }
                content.querySelectorAll(".btn-remove-approver").forEach(btn => {
                    btn.addEventListener("click", () => {
                        editorDraft.approvalFlow = editorDraft.approvalFlow.filter(a => a.id !== btn.dataset.id);
                        renderAdmin();
                    });
                });
                content.querySelectorAll(".ed-approver-role").forEach(input => {
                    input.addEventListener("change", () => {
                        const a = editorDraft.approvalFlow.find(x => x.id === input.dataset.id);
                        if (a) a.role = input.value;
                    });
                });
