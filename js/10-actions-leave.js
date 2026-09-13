/* =====================================================================
   10-actions-leave.js — Thao tác đơn nghỉ phép
   
   ===================================================================== */

/* ===================== LEAVE REQUEST ACTIONS ===================== */
async function addLeave() {
  let employeeId = document.getElementById("f-lemp").value;

  if (!hasPermission('leave:approve')){
    employeeId = currentUser.id;
  }

  const fromDate = document.getElementById("f-lfrom").value;
  const toDate = document.getElementById("f-lto").value;
  const reason = document.getElementById("f-lreason").value.trim();
  const errEl = document.getElementById("f-leave-error");
  if (!employeeId || !fromDate || !toDate) { if (errEl) errEl.textContent = "Vui lòng chọn nhân viên và khoảng ngày nghỉ."; return; }
  leaveRequests.push({ id: uid("l"), employeeId, departmentId: activeDeptId, fromDate, toDate, reason, status: "pending" });
  showLeaveForm = false;
  render();
  await saveData();
}
async function setLeaveStatus(id, status) {
  if (!hasPermission('leave:approve')) {
    alert(t("err_perm_approve_leave"));
    return;
  }
  
  const l = leaveRequests.find((x) => x.id === id);
  if (!l) return;
  l.status = status;
  render();
  await saveData();
}
async function deleteLeave(id) {
  const l = leaveRequests.find((x) => x.id === id);
  if (!l) return;
  if (!hasPermission('leave:approve')) {
    if (l.employeeId !== currentUser.id || l.status !== "pending") {
      alert(t("err_perm_del_leave"));
      return;
    }
  }
  
  leaveRequests = leaveRequests.filter((l) => l.id !== id);
  render();
  await saveData();
}
