/* =====================================================================
   05-storage.js — Đồng bộ dữ liệu với Firebase Firestore (hoặc chế độ xem thử)
   initStorage() nạp dữ liệu lúc khởi động, saveData() lưu mỗi khi có thay đổi.
   ===================================================================== */

/* ===================== STORAGE (Firebase Firestore) ===================== */
function initStorage() {
  if (!IS_CONFIGURED) {
    departments = seedDepartments.slice();
    employees = seedEmployees.slice();
    tasks = seedTasks.slice();
    leaveRequests = seedLeaves.slice();
    machines = seedMachines.slice();
    loaded = true;
    render();
    return;
  }
  const docRef = db.collection("tcc").doc("data");
  docRef.onSnapshot(
    (snap) => {
      if (snap.exists) {
        const data = snap.data();
        departments = (data.departments || seedDepartments.slice()).map((d) => ({
          ...d,
          type: d.type || ((d.name || "").toLowerCase().includes("kế toán") ? "office" : "tech"),
          hasMachine: d.hasMachine !== undefined ? d.hasMachine : !((d.name || "").toLowerCase().includes("kế toán"))
        }));
        employees = (data.employees || []).map((e) => ({
          ...e,
          accessLevel: e.accessLevel || (e.role && e.role.toLowerCase().includes("quản lý") ? "manager" : "employee")
        }));
        // Đảm bảo luôn có ít nhất 1 tài khoản quản lý (e5 / 1111) để không bị khóa hệ thống
        // if (!employees.some((e) => e.accessLevel === "manager" || e.code === "1111")) {
        //   const defaultManager = seedEmployees.find((e) => e.code === "1111") || {
        //     id: "e5", code: "1111", name: "Hoài Nam", role: "Quản lý", password: "111111", departmentId: "d1", color: "amber", accessLevel: "manager"
        //   };
        //   employees.unshift(defaultManager);
        //   docRef.set({ departments, employees, tasks, leaveRequests, machines }).catch(() => {});
        // }
        tasks = data.tasks || [];
        leaveRequests = data.leaveRequests || [];
        machines = data.machines || [];
      } else {
        departments = seedDepartments.slice();
        employees = seedEmployees.slice();
        tasks = seedTasks.slice();
        leaveRequests = seedLeaves.slice();
        machines = seedMachines.slice();
        docRef.set({ departments, employees, tasks, leaveRequests, machines }).catch(() => {});
      }
      loaded = true; syncing = false; syncError = ""; lastSync = new Date();
      render();
    },
    (err) => {
      syncError = err.code === "permission-denied"
        ? "Không có quyền truy cập Firestore - kiểm tra lại Security Rules."
        : "Mất kết nối tới Firestore.";
      loaded = true; syncing = false; render();
    }
  );
}
async function saveData() {
  if (!IS_CONFIGURED) return;
  syncing = true; syncError = "";
  renderSyncBar();
  try {
    await db.collection("tcc").doc("data").set({ departments, employees, tasks, leaveRequests, machines });
    lastSync = new Date();
  } catch (e) {
    syncError = e.code === "permission-denied"
      ? "Không có quyền ghi dữ liệu - kiểm tra lại Security Rules."
      : "Lưu dữ liệu thất bại, vui lòng thử lại.";
  }
  syncing = false;
  renderSyncBar();
}
