                const addApproverBtn = document.getElementById("btn-add-approver");
                if (addApproverBtn) {
                    addApproverBtn.addEventListener("click", () => {
                        editorDraft.approvalFlow.push({
                            id: `APR-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
                            name: "",
                            email: "",
                            title: "",
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
                content.querySelectorAll(".ed-approver-name").forEach(input => {
                    input.addEventListener("input", () => {
                        const a = editorDraft.approvalFlow.find(x => x.id === input.dataset.id);
                        if (a) a.name = input.value;
                    });
                });
                content.querySelectorAll(".ed-approver-email").forEach(input => {
                    input.addEventListener("input", () => {
                        const a = editorDraft.approvalFlow.find(x => x.id === input.dataset.id);
                        if (a) a.email = input.value;
                    });
                });
                content.querySelectorAll(".ed-approver-title").forEach(input => {
                    input.addEventListener("input", () => {
                        const a = editorDraft.approvalFlow.find(x => x.id === input.dataset.id);
                        if (a) a.title = input.value;
                    });
                });

