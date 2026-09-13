/* =====================================================================
   03-state.js — Biến trạng thái toàn cục (state) của app
   view hiện tại, form nào đang mở, độ rộng cột bảng, v.v. Mọi hàm render() đọc từ đây.
   ===================================================================== */

let departments = [], employees = [], tasks = [], leaveRequests = [], machines = [];
let loaded = false;

let currentUser = null;      // employee object đang đăng nhập
let view = "login";          // "login" | "overview" | "department"
let activeDeptId = null;
let deptTab = "dashboard";   // "dashboard" | "employees" | "tasks" | "machines"
let filterId = null;         // lọc theo nhân viên trong bảng task
let showTaskForm = false;
let showEmpForm = false;
let showDeptForm = false;
let showLeaveForm = false;
let showMachineForm = false;
let showCompletedMachines = false;
let taskModalId = null;
let loginError = "";
let calEmpId = null;
let calMonth = new Date(2026, 7, 1); // tháng hiện hành của app (08/2026)

//Sử dụng hàm để luôn lấy nhãn theo ngôn ngữ hiện tại
function getColLabels() {
  return [
    t("col_task"),
    t("col_pic"),
    t("col_priority"),
    t("col_status"),
    t("col_start"),
    t("col_end"),
    t("col_deadline"),
    t("col_notes"),
    ""
  ];
}

let colWidths = [220, 150, 100, 150, 105, 105, 105, 190, 90];
let rowHeights = {};

function startColResize(e, idx) {
  e.preventDefault();
  const table = document.querySelector("table.tasks");
  const startX = e.clientX;
  const startWidth = colWidths[idx];
  const col = table.querySelectorAll("colgroup col")[idx];
  document.body.style.userSelect = "none";
  function onMove(ev) {
    const w = Math.max(50, startWidth + (ev.clientX - startX));
    col.style.width = w + "px";
  }
  function onUp(ev) {
    const w = Math.max(50, startWidth + (ev.clientX - startX));
    colWidths[idx] = w;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}
function startRowResize(e, grip) {
  e.preventDefault();
  e.stopPropagation();
  const tr = grip.closest("tr");
  const taskId = tr.getAttribute("data-task-id");
  const startY = e.clientY;
  const startHeight = tr.offsetHeight;
  document.body.style.userSelect = "none";
  function onMove(ev) {
    const h = Math.max(30, startHeight + (ev.clientY - startY));
    tr.style.height = h + "px";
  }
  function onUp(ev) {
    const h = Math.max(30, startHeight + (ev.clientY - startY));
    if (taskId) rowHeights[taskId] = h;
    document.body.style.userSelect = "";
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  }
  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onUp);
}

let syncing = false;
let syncError = "";
let lastSync = null;
