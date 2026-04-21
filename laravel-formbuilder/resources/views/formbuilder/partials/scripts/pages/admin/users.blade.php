            if (adminPage === "users") {
                content.innerHTML = `
                    <h2 style="margin:0 0 16px;color:var(--primary)">Users</h2>
                    <div class="card">
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <thead><tr style="border-bottom:2px solid var(--gray-light)">
                                <th style="text-align:left;padding:8px">Name</th>
                                <th style="text-align:left;padding:8px">Username</th>
                                <th style="text-align:left;padding:8px">Role</th>
                                <th style="text-align:left;padding:8px">Department</th>
                            </tr></thead>
                            <tbody>
                                ${users.map(u => {
                                    const dep = depts.find(d => d.id === u.department)?.name || "-";
                                    return `
                                        <tr style="border-bottom:1px solid var(--gray-light)">
                                            <td style="padding:8px">${u.name}</td>
                                            <td style="padding:8px">${u.username}</td>
                                            <td style="padding:8px">${u.role}</td>
                                            <td style="padding:8px">${dep}</td>
                                        </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>
                `;
            }
        }

