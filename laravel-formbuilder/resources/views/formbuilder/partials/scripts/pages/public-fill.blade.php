        function renderTemplateList() {
            const listEl = document.getElementById("template-list");
            const published = templates.filter(t => t.published);
            listEl.innerHTML = published.map(t => `
                <div class="card" style="padding:16px;cursor:pointer" data-id="${t.id}">
                    <h4 style="margin:0 0 6px;color:var(--primary)">${t.name}</h4>
                    <p class="muted" style="margin:0 0 12px">${t.description || "-"}</p>
                    <span class="muted">${t.fields.length} fields</span>
                </div>
            `).join("");

            listEl.querySelectorAll("[data-id]").forEach(el => {
                el.addEventListener("click", () => {
                    selectedTemplate = templates.find(t => t.id === el.dataset.id);
                    formData = {};
                    renderDynamicFields();
                    document.getElementById("selected-form-title").textContent = selectedTemplate.name;
                    showView("fillForm");
                });
            });
        }

        function getCalcValue(field) {
            if (!field.formula) return 0;
            let expr = field.formula;
            selectedTemplate.fields.forEach(f => {
                const k = `{${f.label}}`;
                const v = parseFloat(formData[f.id] || 0) || 0;
                expr = expr.split(k).join(v);
            });
            const n = safeCalc(expr);
            return Number.isFinite(n) ? n : 0;
        }

        function renderDynamicFields() {
            const wrap = document.getElementById("dynamic-fields");
            wrap.innerHTML = "";
            selectedTemplate.fields.forEach((field) => {
                const box = document.createElement("div");
                box.className = "field-box";
                const req = field.required ? "*" : "";

                let html = `<label class="label">${field.label} ${req}</label>`;
                if (field.type === "text" || field.type === "email" || field.type === "date" || field.type === "number") {
                    const t = field.type === "text" ? "text" : field.type;
                    html += `<input data-fid="${field.id}" data-ftype="${field.type}" type="${t}" class="input">`;
                } else if (field.type === "textarea") {
                    html += `<textarea data-fid="${field.id}" data-ftype="textarea" class="input" style="min-height:90px"></textarea>`;
                } else if (field.type === "dropdown") {
                    html += `<select data-fid="${field.id}" data-ftype="dropdown" class="input"><option value="">Select...</option>${(field.options || []).map(o => `<option value="${o}">${o}</option>`).join("")}</select>`;
                } else if (field.type === "radio") {
                    html += `<div>${(field.options || []).map(o => `<label style="margin-right:12px"><input data-fid="${field.id}" data-ftype="radio" type="radio" name="${field.id}" value="${o}"> ${o}</label>`).join("")}</div>`;
                } else if (field.type === "checkbox") {
                    html += `<div>${(field.options || []).map(o => `<label style="margin-right:12px"><input data-fid="${field.id}" data-ftype="checkbox" type="checkbox" value="${o}"> ${o}</label>`).join("")}</div>`;
                } else if (field.type === "file") {
                    html += `<input data-fid="${field.id}" data-ftype="file" type="file" class="input">`;
                } else if (field.type === "calculation") {
                    html += `<div style="padding:12px;border-radius:8px;background:#EDF3FF;color:var(--primary);font-weight:700" data-calc="${field.id}">${getCalcValue(field)}</div>`;
                }

                box.innerHTML = html;
                wrap.appendChild(box);
            });

            wrap.querySelectorAll("[data-fid]").forEach(el => {
                const updateValue = () => {
                    const fid = el.dataset.fid;
                    const ftype = el.dataset.ftype;
                    if (ftype === "checkbox") {
                        const checks = [...wrap.querySelectorAll(`input[data-fid="${fid}"]:checked`)];
                        formData[fid] = checks.map(c => c.value);
                    } else if (ftype === "radio") {
                        formData[fid] = el.value;
                    } else if (ftype === "file") {
                        formData[fid] = el.files[0] ? el.files[0].name : "";
                    } else {
                        formData[fid] = el.value;
                    }

                    selectedTemplate.fields.filter(f => f.type === "calculation").forEach(f => {
                        const calcEl = wrap.querySelector(`[data-calc="${f.id}"]`);
                        if (calcEl) calcEl.textContent = getCalcValue(f);
                    });
                };
                el.addEventListener("change", updateValue);
                el.addEventListener("input", updateValue);
            });
        }

        function submitForm() {
            if (!selectedTemplate) return;
            const name = document.getElementById("emp-name").value.trim();
            const email = document.getElementById("emp-email").value.trim();

            if (!name || !email) {
                showToast("Please fill name and email", "error");
                return;
            }

            for (const f of selectedTemplate.fields) {
                if (!f.required) continue;
                const val = formData[f.id];
                const empty = val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0);
                if (empty) {
                    showToast(`Field required: ${f.label}`, "error");
                    return;
                }
            }

            const id = genSubId();
            submissions.push({
                id,
                templateId: selectedTemplate.id,
                templateName: selectedTemplate.name,
                department: selectedTemplate.department || null,
                employeeName: name,
                employeeEmail: email,
                data: { ...formData },
                approvalSteps: (selectedTemplate.approvalFlow || []).map((a, i) => ({
                    ...a,
                    order: i,
                    status: i === 0 ? "in_review" : "pending",
                })),
                status: (selectedTemplate.approvalFlow || []).length > 0 ? "in_review" : "approved",
                submittedAt: new Date().toISOString(),
            });

            document.getElementById("emp-name").value = "";
            document.getElementById("emp-email").value = "";
            selectedTemplate = null;
            formData = {};
            renderTemplateList();
            showView("fillList");
            showToast(`Form submitted. Tracking ID: ${id}`);
        }


