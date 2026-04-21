        function showView(name) {
            Object.values(views).forEach(v => v.classList.add("hidden"));
            views[name].classList.remove("hidden");
        }

        function showToast(message, type = "success") {
            toastEl.textContent = message;
            toastEl.className = `toast ${type}`;
            setTimeout(() => toastEl.className = "toast hidden", 2500);
        }

        function safeCalc(expr) {
            try {
                const s = String(expr).replace(/[^0-9+\-*/().,%\s]/g, "");
                return Function(`"use strict"; return (${s})`)();
            } catch {
                return 0;
            }
        }

        function badgeClass(status) {
            if (status === "approved") return "status-approved";
            if (status === "rejected") return "status-rejected";
            if (status === "in_review") return "status-in-review";
            return "status-pending";
        }

        function statusLabel(status) {
            if (status === "approved") return "Approved";
            if (status === "rejected") return "Rejected";
            if (status === "in_review") return "In Review";
            return "Pending";
        }

        function genSubId() {
            return `SUB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        }

        function genTplId() {
            return `TPL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
        }

        function genFldId() {
            return `FLD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
        }

        function createField(type) {
            const field = {
                id: genFldId(),
                type,
                label: "",
                required: false,
                options: ["dropdown", "radio", "checkbox"].includes(type) ? ["Option 1"] : undefined,
                formula: type === "calculation" ? "" : undefined,
            };
            if (type === "table") {
                field.tableColumns = [
                    { id: genFldId(), name: "Item", type: "text", formula: "", options: [] },
                    { id: genFldId(), name: "Qty", type: "number", formula: "", options: [] },
                    { id: genFldId(), name: "Price", type: "number", formula: "", options: [] },
                    { id: genFldId(), name: "Total", type: "calc", formula: "{Qty} * {Price}", options: [] },
                ];
            }
            return field;
        }


