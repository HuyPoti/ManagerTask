/* =====================================================================
   21-app.js — Điểm khởi động app (render root + gọi initStorage())
   File này PHẢI được nạp SAU CÙNG vì nó gọi initStorage() để khởi động toàn bộ app.
   ===================================================================== */

/* ===================== RENDER ROOT ===================== */
function renderSyncBar() {
  const el = document.getElementById("sync-bar");
  if (!el) return;
  if (!IS_CONFIGURED) {
    el.innerHTML = `<div class="demo-banner">${ic("alert")} ${t("view_mode_demo")}</div>`;
    return;
  }
  const timeStr = lastSync ? fmtTime(lastSync) : "";
  const statusNote = syncing ? t("sync_saving") : lastSync ? t("sync_updated_at", { time: timeStr }) : "";
  el.innerHTML = `<span class="shared-note">${ic("users")} ${t("sync_shared_note")} ${statusNote}${syncError
    ? `<span class="sync-error"> · ${syncError}</span>`
    : ""}</span>`;
}

function render() {
  if (!loaded) return;
  const app = document.getElementById("app");
  let html = "";
  if (!currentUser) {
    view = "login";
    html = renderLoginPage();
  } else if (view === "department" && activeDeptId) {
    html = renderDepartment();
  } else {
    view = "overview";
    html = renderOverviewPage();
  }
  if (taskModalId) html += renderTaskModal();
  app.innerHTML = html;
  renderSyncBar();
}

/* ===================== INIT ===================== */
initStorage();
