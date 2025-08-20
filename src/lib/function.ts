export function checkLogin() {
  const user = localStorage.getItem("user");
  if (user) return true;
  return false;
}
