/* =====================================================================
   14-data-tools.js — Khôi phục dữ liệu mẫu & Xuất Excel
   
   ===================================================================== */

/* ===================== RESET / EXPORT ===================== */
async function resetData() {
  if (!hasPermission('system:reset')) {
    alert(t("err_perm_reset"));
    return;
  }
  if (!confirm("Xoá toàn bộ dữ liệu hiện tại và khôi phục dữ liệu mẫu? Hành động này ảnh hưởng đến tất cả mọi người đang dùng chung.")) return;
  departments = seedDepartments.slice();
  employees = seedEmployees.slice();
  tasks = seedTasks.slice();
  leaveRequests = seedLeaves.slice();
  machines = seedMachines.slice();
  render();
  await saveData();
}
function exportExcel() {
  if (!hasPermission('data:export')) {
    alert(t("err_perm_export"));
    return;
  }
  const taskRows = tasks.map((tItem) => {
    const emp = employeeById(tItem.assigneeId);
    const dept = departmentById(tItem.departmentId);
    const mach = machineById(tItem.machineId);
    const row = {};
    row[t("excel_col_dept")] = dept ? dept.name : "";
    row[t("excel_col_task_name")] = tItem.title;
    row[t("excel_col_pic")] = emp ? emp.name : t("unassigned");
    row[t("excel_col_machine")] = mach ? mach.name : "";
    row[t("excel_col_priority")] = priorityInfo(tItem.priority).label;
    row[t("excel_col_status")] = statusInfo(tItem.status).label;
    row[t("excel_col_start")] = tItem.startDate ? fmtDate(tItem.startDate) : "";
    row[t("excel_col_end")] = tItem.endDate ? fmtDate(tItem.endDate) : "";
    row[t("excel_col_deadline")] = tItem.deadline ? fmtDate(tItem.deadline) : "";
    row[t("excel_col_overdue")] = isOverdue(tItem) ? t("excel_val_yes") : t("excel_val_no");
    row[t("excel_col_notes")] = tItem.notes || "";
    return row;
  });
  const empRows = employees.map((e) => {
    const row = {};
    row[t("excel_col_emp_code")] = e.code;
    row[t("excel_col_emp_name")] = e.name;
    row[t("excel_col_role")] = e.role;
    row[t("excel_col_dept")] = departmentById(e.departmentId) ? departmentById(e.departmentId).name : "";
    row[t("excel_col_task_count")] = taskCountFor(e.id);
    return row;
  });
  const machineRows = machines.map((m) => {
    const row = {};
    row[t("excel_col_dept")] = departmentById(m.departmentId) ? departmentById(m.departmentId).name : "";
    row[t("excel_col_machine_name")] = m.name;
    row[t("excel_col_delivery_date")] = m.deliveryDate ? fmtDate(m.deliveryDate) : "";
    row[t("excel_col_spec")] = m.spec || "";
    row[t("excel_col_status")] = m.completed ? t("excel_val_completed") : t("excel_val_running");
    return row;
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(taskRows), t("excel_sheet_tasks"));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(empRows), t("excel_sheet_employees"));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(machineRows), t("excel_sheet_machines"));
  XLSX.writeFile(wb, "task-working-tazmo-" + new Date().toISOString().slice(0, 10) + ".xlsx");
}
