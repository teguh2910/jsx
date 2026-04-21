                    ${editorTab === "approval" ? `
                    <div class="card editor-section">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                            <div>
                                <h3 style="margin:0 0 4px;color:var(--primary);font-size:17px;">Approval Flow</h3>
                                <p style="margin:0;color:var(--gray);font-size:13px;">Add approvers in order. Each receives an email notification.</p>
                            </div>
                            <button id="btn-add-approver" class="btn btn-primary" style="padding:8px 12px;">Add Approver</button>
                        </div>
                        <div id="ed-approvers-wrap">
                            ${editorDraft.approvalFlow.length === 0 ? `<p class="muted">No approver (auto-approved).</p>` : editorDraft.approvalFlow.map((a, i) => `
                                <div class="field-row">
                                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                        <span class="chip">Step ${i + 1}</span>
                                        <button class="btn btn-ghost btn-remove-approver" data-id="${a.id}" style="padding:4px 8px;color:var(--danger);">Remove</button>
                                    </div>
                                    <div class="editor-grid">
                                        <div><label class="label">Name</label><input class="input ed-approver-name" data-id="${a.id}" value="${a.name || ""}"></div>
                                        <div><label class="label">Email</label><input class="input ed-approver-email" data-id="${a.id}" value="${a.email || ""}"></div>
                                        <div><label class="label">Title</label><input class="input ed-approver-title" data-id="${a.id}" value="${a.title || ""}"></div>
                                    </div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                    ` : ""}

