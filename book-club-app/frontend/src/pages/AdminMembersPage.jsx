import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Loading } from "../components/common/index.js";
import {
  deleteMember,
  getAdminErrorMessage,
  getAdminMembers,
  updateMemberStatus,
} from "../services/adminService.js";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang hoạt động" },
  { value: "locked", label: "Đã khoá" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

function statusBadge(status) {
  if (status === "active") return "completed";
  if (status === "locked") return "cancelled";
  return "neutral";
}

function statusLabel(status) {
  if (status === "active") return "Hoạt động";
  if (status === "locked") return "Đã khoá";
  return "Ngừng";
}

function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminMembers({ q: keyword, status });
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [keyword, status]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  async function handleToggleLock(member) {
    const next = member.account_status === "locked" ? "active" : "locked";
    setBusyId(member.member_id);
    setError("");
    setNotice("");
    try {
      await updateMemberStatus(member.member_id, next);
      setNotice(next === "locked" ? `Đã khoá ${member.full_name}.` : `Đã mở khoá ${member.full_name}.`);
      await fetchMembers();
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  async function handleDelete(member) {
    const confirmed = window.confirm(
      `Xoá vĩnh viễn thành viên "${member.full_name}"? Hành động này không thể hoàn tác.`,
    );
    if (!confirmed) {
      return;
    }

    setBusyId(member.member_id);
    setError("");
    setNotice("");
    try {
      await deleteMember(member.member_id);
      setNotice(`Đã xoá ${member.full_name}.`);
      await fetchMembers();
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#082d24]">Quản lý thành viên</h1>
        <p className="text-sm text-[#64736d]">Khoá, mở khoá hoặc xoá tài khoản thành viên.</p>
      </div>

      <Card>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            fetchMembers();
          }}
        >
          <label className="min-w-[200px] flex-1">
            <span className="mb-1 block text-xs font-bold text-[#082d24]">Tìm theo tên / email</span>
            <input
              className="min-h-11 w-full rounded-2xl border border-[#d9e2d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#064834]"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Nhập tên hoặc email..."
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-bold text-[#082d24]">Trạng thái</span>
            <select
              className="min-h-11 rounded-2xl border border-[#d9e2d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#064834]"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="secondary">
            Lọc
          </Button>
        </form>
      </Card>

      {error ? <Alert type="error">{error}</Alert> : null}
      {notice ? <Alert type="success">{notice}</Alert> : null}
      {loading ? <Loading label="Đang tải thành viên..." /> : null}

      {!loading ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-[#64736d]">
                  <th className="px-2 py-2">Họ tên</th>
                  <th className="px-2 py-2">Email</th>
                  <th className="px-2 py-2">Vai trò</th>
                  <th className="px-2 py-2">Điểm</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="px-2 py-2 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => {
                  const isAdmin = member.role === "admin";
                  return (
                    <tr key={member.member_id} className="border-t border-[#ede9da]">
                      <td className="px-2 py-2 font-bold text-[#082d24]">{member.full_name}</td>
                      <td className="px-2 py-2 text-[#64736d]">{member.email}</td>
                      <td className="px-2 py-2">
                        <Badge status={isAdmin ? "reserved" : "neutral"}>
                          {isAdmin ? "Quản trị" : "Thành viên"}
                        </Badge>
                      </td>
                      <td className="px-2 py-2">{member.point_balance}</td>
                      <td className="px-2 py-2">
                        <Badge status={statusBadge(member.account_status)}>
                          {statusLabel(member.account_status)}
                        </Badge>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            className="px-3 py-1.5"
                            disabled={isAdmin || busyId === member.member_id}
                            onClick={() => handleToggleLock(member)}
                          >
                            {member.account_status === "locked" ? "Mở khoá" : "Khoá"}
                          </Button>
                          <Button
                            variant="danger"
                            className="px-3 py-1.5"
                            disabled={isAdmin || busyId === member.member_id}
                            onClick={() => handleDelete(member)}
                          >
                            Xoá
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {members.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-6 text-center text-[#64736d]">
                      Không có thành viên nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export default AdminMembersPage;
