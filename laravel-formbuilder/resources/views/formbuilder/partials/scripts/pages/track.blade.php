        function searchTrack() {
            const id = document.getElementById("track-id").value.trim().toLowerCase();
            const resultEl = document.getElementById("track-result");
            const found = submissions.find(s => s.id.toLowerCase() === id);
            if (!found) {
                resultEl.innerHTML = `<div style="padding:12px;background:#FEE2E2;color:var(--danger);border-radius:8px;">Submission not found.</div>`;
                return;
            }

            resultEl.innerHTML = `
                <div class="card" style="padding:16px;background:var(--light);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
                        <div>
                            <div style="font-size:12px;color:var(--gray)">Submission ID</div>
                            <div style="font-weight:700;color:var(--primary)">${found.id}</div>
                        </div>
                        <span class="badge ${badgeClass(found.status)}">${statusLabel(found.status)}</span>
                    </div>
                    <hr style="border:none;border-top:1px solid var(--gray-light);margin:12px 0;">
                    <div class="muted">Form: ${found.templateName}</div>
                    <div class="muted">Employee: ${found.employeeName} - ${found.employeeEmail}</div>
                    <div class="muted">Submitted: ${new Date(found.submittedAt).toLocaleString()}</div>
                </div>
            `;
        }

