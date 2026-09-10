/* =====================================================================
   19-modal-task.js — Modal xem/sửa chi tiết 1 công việc
   
   ===================================================================== */

/* ===================== TASK DETAIL MODAL ===================== */
function renderTaskModal() {
  const currentTask = taskById(taskModalId);
  if (!currentTask) return "";
  const dept = departmentById(currentTask.departmentId);
  const emps = deptEmployees(currentTask.departmentId);
  const machs = deptMachines(currentTask.departmentId);
  return `
    <div class="modal-overlay" onclick="if(event.target===this) closeTaskModal()">
      <div class="modal">
        <div class="modal-head">
          <h3>${t("modal_task_detail")}</h3>
          <button class="modal-close" onclick="closeTaskModal()">${ic("x")}</button>
        </div>
        <div class="modal-grid full modal-field">
          <div><label class="field-label">${t("form_task_name")}</label><input id="m-title" value="${escapeAttr(currentTask.title)}" /></div>
        </div>
        <div class="modal-grid">
          <div class="modal-field"><label class="field-label">${t("form_pic")}</label>
            <select id="m-assignee">${emps.map((e) => `<option value="${e.id}" ${e.id === currentTask.assigneeId ? "selected" : ""}>${escapeHtml(e.name)}</option>`).join("")}</select>
          </div>
          <div class="modal-field"><label class="field-label">${t("form_machine_attach")}</label>
            <select id="m-machine"><option value="">${t("form_no_machine")}</option>${machs.map((m) => `<option value="${m.id}" ${m.id === currentTask.machineId ? "selected" : ""}>${escapeHtml(m.name)}</option>`).join("")}</select>
          </div>
          <div class="modal-field"><label class="field-label">${t("form_priority")}</label>
            <select id="m-priority">
              <option value="high" ${currentTask.priority === "high" ? "selected" : ""}>${t("pri_high")}</option>
              <option value="medium" ${currentTask.priority === "medium" ? "selected" : ""}>${t("pri_medium")}</option>
              <option value="low" ${currentTask.priority === "low" ? "selected" : ""}>${t("pri_low")}</option>
            </select>
          </div>
          <div class="modal-field"><label class="field-label">${t("modal_status")}</label>
            <select id="m-status">${STATUS_OPTS.map((s) => `<option value="${s.key}" ${s.key === currentTask.status ? "selected" : ""}>${s.label}</option>`).join("")}</select>
          </div>
          <div class="modal-field"><label class="field-label">${t("form_start_date")}</label><input id="m-start" type="date" value="${currentTask.startDate || ""}" /></div>
          <div class="modal-field"><label class="field-label">${t("form_end_date")}</label><input id="m-end" type="date" value="${currentTask.endDate || ""}" /></div>
          <div class="modal-field"><label class="field-label">${t("form_deadline")}</label><input id="m-deadline" type="date" value="${currentTask.deadline || ""}" /></div>
          <div class="modal-field"><label class="field-label">Bộ phận</label><input value="${escapeAttr(dept ? dept.name : "")}" disabled /></div>
        </div>
        <div class="modal-grid full modal-field">
          <div><label class="field-label">${t("form_notes")}</label><textarea id="m-notes" rows="3">${escapeHtml(currentTask.notes || "")}</textarea></div>
        </div>
        <div class="modal-actions">
          <button class="icon-btn danger" onclick="deleteTask('${currentTask.id}')" aria-label="Xoá công việc">${ic("trash")}</button>
          <div class="modal-actions-right">
            <button onclick="closeTaskModal()">${t("btn_cancel")}</button>
            <button class="btn-primary" onclick="saveTaskModal('${currentTask.id}')">${t("btn_save")}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
  