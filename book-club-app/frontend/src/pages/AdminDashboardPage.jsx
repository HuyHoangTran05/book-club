import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Loading } from "../components/common/index.js";
import { downloadReport, getAdminErrorMessage, getAdminStats } from "../services/adminService.js";

const numberFormat = (value) => new Intl.NumberFormat("vi-VN").format(Number(value || 0));

function StatCard({ label, value, hint }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-[#64736d]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#082d24]">{numberFormat(value)}</p>
      {hint ? <p className="mt-1 text-xs text-[#64736d]">{hint}</p> : null}
    </Card>
  );
}

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function handleDownload(format) {
    setDownloading(format);
    setError("");
    try {
      await downloadReport(format);
    } catch (err) {
      setError(getAdminErrorMessage(err, "Không tải được báo cáo."));
    } finally {
      setDownloading("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#082d24]">Bảng điều khiển quản trị</h1>
          <p className="text-sm text-[#64736d]">Tổng quan hoạt động hệ thống câu lạc bộ đọc sách.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleDownload("xlsx")} disabled={Boolean(downloading)}>
            {downloading === "xlsx" ? "Đang xuất..." : "Xuất Excel"}
          </Button>
          <Button variant="secondary" onClick={() => handleDownload("pdf")} disabled={Boolean(downloading)}>
            {downloading === "pdf" ? "Đang xuất..." : "Xuất PDF"}
          </Button>
          <Button variant="ghost" onClick={fetchStats}>
            Làm mới
          </Button>
        </div>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}
      {loading ? <Loading label="Đang tải thống kê..." /> : null}

      {stats && !loading ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Thành viên"
              value={stats.totals.members}
              hint={`${numberFormat(stats.totals.deliverers)} người giao sách`}
            />
            <StatCard
              label="Bản sách"
              value={stats.totals.bookCopies}
              hint={`${numberFormat(stats.totals.availableCopies)} sẵn sàng · ${numberFormat(stats.totals.bookTitles)} đầu sách`}
            />
            <StatCard
              label="Giao dịch"
              value={stats.totals.transactions}
              hint={`${numberFormat(stats.transactionsByStatus.pending)} đang chờ`}
            />
            <StatCard
              label="Điểm lưu hành"
              value={stats.pointsInCirculation}
              hint={`${numberFormat(stats.totals.lockedMembers)} tài khoản bị khoá`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-black text-[#082d24]">Giao dịch theo trạng thái</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge status="pending">Chờ: {numberFormat(stats.transactionsByStatus.pending)}</Badge>
                <Badge status="completed">Hoàn tất: {numberFormat(stats.transactionsByStatus.completed)}</Badge>
                <Badge status="cancelled">Đã huỷ: {numberFormat(stats.transactionsByStatus.cancelled)}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <Badge status="neutral">Vĩnh viễn: {numberFormat(stats.transactionsByType.permanent)}</Badge>
                <Badge status="neutral">Cho mượn: {numberFormat(stats.transactionsByType.lending)}</Badge>
              </div>
              <p className="mt-4 text-sm text-[#64736d]">
                Hôm nay: {numberFormat(stats.transactionsOverTime.today)} · 7 ngày:{" "}
                {numberFormat(stats.transactionsOverTime.last7Days)} · 30 ngày:{" "}
                {numberFormat(stats.transactionsOverTime.last30Days)}
              </p>
            </Card>

            <Card>
              <h2 className="text-lg font-black text-[#082d24]">Top thành viên theo điểm</h2>
              <ol className="mt-3 space-y-2">
                {stats.topMembers.map((member, index) => (
                  <li
                    key={member.member_id}
                    className="flex items-center justify-between rounded-xl bg-[#fbfaf3] px-3 py-2 text-sm"
                  >
                    <span className="font-bold text-[#082d24]">
                      {index + 1}. {member.full_name}
                    </span>
                    <span className="font-black text-[#064834]">{numberFormat(member.point_balance)} điểm</span>
                  </li>
                ))}
                {stats.topMembers.length === 0 ? (
                  <li className="text-sm text-[#64736d]">Chưa có dữ liệu.</li>
                ) : null}
              </ol>
            </Card>
          </div>

          <Card>
            <h2 className="text-lg font-black text-[#082d24]">
              Cảnh báo: giao dịch treo quá 7 ngày ({stats.pendingOver7Days.length})
            </h2>
            {stats.pendingOver7Days.length === 0 ? (
              <p className="mt-3 text-sm text-[#64736d]">Không có giao dịch nào treo quá 7 ngày.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase text-[#64736d]">
                      <th className="px-2 py-2">Sách</th>
                      <th className="px-2 py-2">Người cho</th>
                      <th className="px-2 py-2">Người nhận</th>
                      <th className="px-2 py-2">Loại</th>
                      <th className="px-2 py-2">Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.pendingOver7Days.map((item) => (
                      <tr key={item.transaction_id} className="border-t border-[#ede9da]">
                        <td className="px-2 py-2 font-bold text-[#082d24]">{item.book?.title ?? "—"}</td>
                        <td className="px-2 py-2">{item.giver?.full_name ?? "—"}</td>
                        <td className="px-2 py-2">{item.receiver?.full_name ?? "—"}</td>
                        <td className="px-2 py-2">
                          {item.transaction_type === "permanent" ? "Vĩnh viễn" : "Cho mượn"}
                        </td>
                        <td className="px-2 py-2">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      ) : null}
    </div>
  );
}

export default AdminDashboardPage;
