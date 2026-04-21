        const users = [
            { username: "superadmin", password: "admin123", name: "Super Administrator", role: "superadmin", department: null },
            { username: "hr.admin", password: "hr123", name: "HR Administrator", role: "admin_department", department: "dep-1" },
            { username: "fin.admin", password: "fin123", name: "Finance Administrator", role: "admin_department", department: "dep-2" },
        ];
        const depts = [
            { id: "dep-1", name: "Human Resources", code: "HR" },
            { id: "dep-2", name: "Finance", code: "FIN" },
            { id: "dep-3", name: "IT & Technology", code: "IT" },
            { id: "dep-4", name: "Operations", code: "OPS" },
        ];
        const fieldTypes = [
            { value: "text", label: "Text Input", icon: "Aa" },
            { value: "textarea", label: "Text Area", icon: "Txt" },
            { value: "number", label: "Number", icon: "#" },
            { value: "email", label: "Email", icon: "@" },
            { value: "date", label: "Date", icon: "Dt" },
            { value: "dropdown", label: "Dropdown", icon: "v" },
            { value: "radio", label: "Radio", icon: "o" },
            { value: "checkbox", label: "Checkbox", icon: "[x]" },
            { value: "file", label: "File Upload", icon: "Fl" },
            { value: "calculation", label: "Calculation", icon: "Sum" },
            { value: "table", label: "Table", icon: "Tbl" },
        ];

        const templates = [
            {
                id: "TPL-LEAVE",
                name: "Leave Request",
                description: "Employee leave request form",
                department: "dep-1",
                published: true,
                approvalFlow: [],
                fields: [
                    { id: "f1", type: "date", label: "Start Date", required: true },
                    { id: "f2", type: "date", label: "End Date", required: true },
                    { id: "f3", type: "dropdown", label: "Leave Type", required: true, options: ["Annual", "Sick", "Emergency"] },
                    { id: "f4", type: "textarea", label: "Reason", required: true },
                ],
            },
            {
                id: "TPL-REIMB",
                name: "Expense Reimbursement",
                description: "Claim expense reimbursement",
                department: "dep-2",
                published: true,
                approvalFlow: [],
                fields: [
                    { id: "f5", type: "text", label: "Expense Title", required: true },
                    { id: "f6", type: "number", label: "Amount", required: true },
                    { id: "f7", type: "number", label: "Tax", required: false },
                    { id: "f8", type: "calculation", label: "Total", formula: "{Amount}+{Tax}" },
                    { id: "f9", type: "file", label: "Receipt", required: true },
                ],
            },
        ];

        const submissions = [];

        const views = {
            landing: document.getElementById("view-landing"),
            login: document.getElementById("view-login"),
            fillList: document.getElementById("view-fill-list"),
            fillForm: document.getElementById("view-fill-form"),
            track: document.getElementById("view-track"),
            admin: document.getElementById("view-admin"),
        };

        const toastEl = document.getElementById("toast");
        let selectedTemplate = null;
        let formData = {};
        let currentUser = null;
        let adminPage = "dashboard";
        let editorDraft = null;
        let editorTab = "fields";


