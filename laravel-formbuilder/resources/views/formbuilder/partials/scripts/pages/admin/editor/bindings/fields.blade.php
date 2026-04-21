                content.querySelectorAll(".btn-add-type").forEach(btn => {
                    btn.addEventListener("click", () => {
                        editorDraft.fields.push(createField(btn.dataset.type));
                        editorTab = "fields";
                        renderAdmin();
                    });
                });

                content.querySelectorAll(".btn-remove-field").forEach(btn => {
                    btn.addEventListener("click", () => {
                        editorDraft.fields = editorDraft.fields.filter(f => f.id !== btn.dataset.id);
                        renderAdmin();
                    });
                });
                content.querySelectorAll(".btn-move-field").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const i = Number(btn.dataset.index);
                        const d = Number(btn.dataset.dir);
                        const ni = i + d;
                        if (ni < 0 || ni >= editorDraft.fields.length) return;
                        const arr = [...editorDraft.fields];
                        [arr[i], arr[ni]] = [arr[ni], arr[i]];
                        editorDraft.fields = arr;
                        renderAdmin();
                    });
                });
                content.querySelectorAll(".ed-field-label").forEach(input => {
                    input.addEventListener("input", () => {
                        const f = editorDraft.fields.find(x => x.id === input.dataset.id);
                        if (f) f.label = input.value;
                    });
                });
                content.querySelectorAll(".ed-field-required").forEach(input => {
                    input.addEventListener("change", () => {
                        const f = editorDraft.fields.find(x => x.id === input.dataset.id);
                        if (f) f.required = input.checked;
                    });
                });
                content.querySelectorAll(".ed-field-options").forEach(input => {
                    input.addEventListener("input", () => {
                        const f = editorDraft.fields.find(x => x.id === input.dataset.id);
                        if (f) f.options = input.value.split(",").map(v => v.trim()).filter(Boolean);
                    });
                });
                content.querySelectorAll(".ed-field-formula").forEach(input => {
                    input.addEventListener("input", () => {
                        const f = editorDraft.fields.find(x => x.id === input.dataset.id);
                        if (f) f.formula = input.value;
                    });
                });

