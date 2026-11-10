import { Dashboard } from "./views/dashboard";

export function SaveState(dashboard: Dashboard) {
  localStorage.setItem("state-dashboard-id", `${dashboard.id()}`);
  localStorage.setItem("state-dashboard-columns", `${dashboard.columns()}`);
  dashboard.saveState();
}

export function LoadState(): Dashboard | null {
  const dashboard_id = localStorage.getItem("state-dashboard-id");
  const dashboard_colunms = localStorage.getItem("state-dashboard-columns");
  if (dashboard_id == null) {
    return null;
  }
  if (dashboard_colunms == null) {
    return null;
  }
  console.log(
    "Found dashboard root id: " +
      dashboard_id +
      " with colunms: " +
      dashboard_colunms,
  );

  const dashboard = new Dashboard(
    Number(dashboard_id),
    Number(dashboard_colunms),
  );
  dashboard.loadState();
  return dashboard;
}
