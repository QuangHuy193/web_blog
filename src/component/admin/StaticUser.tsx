import { useEffect, useState } from "react";
import UserItem from "./UserItem";
import LoadingToast from "../LoadingToast";

function StaticUser() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState({
    loadingUsers: false,
  });
  const limit = 8;

  const fetchUser = async () => {
    try {
      setAction((prve) => ({ ...prve, loadingUsers: true }));
      const res = await fetch(`/api/users??page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAction((prve) => ({ ...prve, loadingUsers: false }));
    }
  };
  useEffect(() => {
    fetchUser();
  }, [page]);
  return (
    <div>
      {action.loadingUsers && (
        <LoadingToast title="Đang tải danh sách người dùng..." />
      )}
      {users.map((user) => (
        <div key={user.id}>
          <UserItem {...user} />
        </div>
      ))}
    </div>
  );
}

export default StaticUser;
