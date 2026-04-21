            if (adminPage === "submissions") {
                content.innerHTML = `
                    <h2 style="margin:0 0 16px;color:var(--primary)">Submissions</h2>
                    <div class="card">
                        ${allowedSubs.length === 0 ? `<p class="muted">No submissions available.</p>` : `
                            <table style="width:100%;border-collapse:collapse;font-size:14px;">
                                <thead><tr style="border-bottom:2px solid var(--gray-light)">
                                    <th style="text-align:left;padding:8px">ID</th>
                                    <th style="text-align:left;padding:8px">Form</th>
                                    <th style="text-align:left;padding:8px">Employee</th>
                                    <th style="text-align:left;padding:8px">Date</th>
                                    <th style="text-align:left;padding:8px">Status</th>
                                </tr></thead>
                                <tbody>
                                    ${allowedSubs.map(s => `
                                        <tr style="border-bottom:1px solid var(--gray-light)">
                                            <td style="padding:8px">${s.id}</td>
                                            <td style="padding:8px">${s.templateName}</td>
                                            <td style="padding:8px">${s.employeeName}</td>
                                            <td style="padding:8px">${new Date(s.submittedAt).toLocaleDateString()}</td>
                                            <td style="padding:8px"><span class="badge ${badgeClass(s.status)}">${statusLabel(s.status)}</span></td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        `}
                    </div>
                `;
                return;
            }


