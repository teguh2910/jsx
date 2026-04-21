    <div id="view-fill-form" class="page-wrap hidden">
        <div class="topbar">
            <button id="btn-fill-form-back" class="btn btn-ghost" style="color:#fff;padding:6px 12px;"><- Back</button>
            <strong id="selected-form-title">Fill Form</strong>
        </div>
        <div class="container">
            <div class="card" style="margin-bottom:16px;">
                <h3 style="margin:0 0 14px;color:var(--primary)">Employee Information</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="field-box"><label class="label">Full Name *</label><input id="emp-name" class="input"></div>
                    <div class="field-box"><label class="label">Email *</label><input id="emp-email" type="email" class="input"></div>
                </div>
            </div>
            <div class="card">
                <h3 style="margin:0 0 14px;color:var(--primary)">Form Fields</h3>
                <div id="dynamic-fields"></div>
                <button id="btn-submit-form" class="btn btn-primary">Submit Form</button>
            </div>
        </div>
    </div>

