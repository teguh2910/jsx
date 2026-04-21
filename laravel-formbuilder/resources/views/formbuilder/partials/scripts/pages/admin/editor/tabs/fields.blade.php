                    ${editorTab === "fields" ? `
                    <div style="display:grid;grid-template-columns:220px 1fr;gap:20px;">
                        <div class="card">
                            <h4 style="margin:0 0 12px;font-size:14px;color:var(--primary)">Add Field</h4>
                            <div style="display:flex;flex-direction:column;gap:6px;">
                                ${fieldTypes.map(ft => `
                                    <button class="btn-add-type" data-type="${ft.value}" style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:8px;border:1px solid var(--gray-light);background:var(--white);cursor:pointer;font-size:13px;color:var(--gray-dark);text-align:left;">
                                        <span style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;background:${ft.value === "calculation" ? "#FEF3C7" : ft.value === "table" ? "#DBEAFE" : "var(--light)"};border-radius:6px;font-size:12px;">${ft.icon}</span>
                                        ${ft.label}
                                    </button>
                                `).join("")}
                            </div>
                        </div>
                        <div>
                            ${editorDraft.fields.length === 0 ? `
                                <div class="card" style="text-align:center;padding:48px 20px;">
                                    <h3 style="margin:0 0 8px;color:var(--primary);font-size:18px;">No Fields</h3>
                                    <p class="muted" style="margin:0;">Click field types to add.</p>
                                </div>
                            ` : `
                                <div style="display:flex;flex-direction:column;gap:12px;">
                                    ${editorDraft.fields.map((f, i) => `
                                    <div class="card" style="border:1px solid var(--gray-light);">
                                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                                            <div style="display:flex;align-items:center;gap:8px;">
                                                <span style="background:${f.type === "calculation" ? "#FEF3C7" : f.type === "table" ? "#DBEAFE" : "var(--light)"};padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;color:var(--primary)">${fieldTypes.find(t => t.value === f.type)?.label || f.type}</span>
                                                <span style="font-size:12px;color:var(--gray)">#${i + 1}</span>
                                            </div>
                                            <div style="display:flex;gap:4px;">
                                                <button class="btn-move-field" data-index="${i}" data-dir="-1" ${i===0 ? "disabled" : ""} style="padding:4px 8px;border:none;border-radius:6px;background:var(--light);cursor:pointer;opacity:${i===0 ? ".3":"1"}">Up</button>
                                                <button class="btn-move-field" data-index="${i}" data-dir="1" ${i===editorDraft.fields.length-1 ? "disabled" : ""} style="padding:4px 8px;border:none;border-radius:6px;background:var(--light);cursor:pointer;opacity:${i===editorDraft.fields.length-1 ? ".3":"1"}">Down</button>
                                                <button class="btn-remove-field" data-id="${f.id}" style="padding:4px 8px;border:none;border-radius:6px;background:var(--light);cursor:pointer;color:var(--danger)">Delete</button>
                                            </div>
                                        </div>
                                        <div style="display:grid;grid-template-columns:1fr auto;gap:12px;align-items:end;">
                                            <div>
                                                <label class="label">Field Label</label>
                                                <input class="input ed-field-label" data-id="${f.id}" value="${f.label || ""}" placeholder="Enter label...">
                                            </div>
                                            <label style="display:flex;align-items:center;gap:6px;font-size:13px;padding:10px 0;">
                                                <input type="checkbox" class="ed-field-required" data-id="${f.id}" ${f.required ? "checked" : ""}> Required
                                            </label>
                                        </div>
                                        ${["dropdown","radio","checkbox"].includes(f.type) ? `
                                            <div style="margin-top:12px;">
                                                <label class="label">Options (comma separated)</label>
                                                <input class="input ed-field-options" data-id="${f.id}" value="${(f.options || []).join(", ")}">
                                            </div>
                                        ` : ""}
                                        ${f.type === "calculation" ? `
                                            <div style="margin-top:12px;">
                                                <label class="label">Formula</label>
                                                <input class="input ed-field-formula" data-id="${f.id}" value="${f.formula || ""}" placeholder="e.g. {Quantity} * {Unit Price}">
                                            </div>
                                        ` : ""}
                                        ${f.type === "table" ? `
                                            <div style="margin-top:12px;padding:12px;background:#DBEAFE;border-radius:8px;font-size:12px;color:var(--primary)">
                                                Table field uses default editable columns (Item, Qty, Price, Total).
                                            </div>
                                        ` : ""}
                                    </div>
                                    `).join("")}
                                </div>
                            `}
                        </div>
                    </div>
                    ` : ""}

