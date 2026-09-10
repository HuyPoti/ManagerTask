/* =====================================================================
   20-page-login.js — Trang ĐĂNG NHẬP
   
   ===================================================================== */

/* ===================== LOGIN PAGE ===================== */
function renderLoginPage() {
  return `
    <div class="login-wrap">
      <!-- Đặt Nút đổi ngôn ngữ ở góc trên cùng bên phải -->
      <div style="position: absolute; top: 20px; right: 20px;">
        ${renderLangSwitcher()}
      </div>
      <div class="login-card">
        <div class="title-row" style="justify-content:center;margin-bottom:6px"><span class="led"></span></div>
        <div class="login-title">
          <img src="assets/tazmo-logo.png" alt="${t('app_title')}">
        </div>
        <div class="login-sub">${t('login_sub')}</div>
        <div class="login-field">
          <label>${t('login_emp_code')}</label>
          <input id="f-login-code" placeholder="VD: NV001" onkeydown="loginKeydown(event)" />
        </div>
        <div class="login-field">
          <label>${t('login_password')}</label>
          <input id="f-login-pass" type="password" placeholder="••••••" onkeydown="loginKeydown(event)" />
        </div>
        <button class="login-btn" onclick="doLogin()">${t('login_btn')}</button>
        ${loginError ? `<div class="login-error">${escapeHtml(loginError)}</div>` : ""}
        <div class="login-hint">Tài khoản demo: NV001 / 123456 (Thiết Kế Điện), NV003 / 123456 (Thiết Kế Cơ Khí), NV004 / 123456 (Kế Toán).</div>
      </div>
    </div>
  `;
}
