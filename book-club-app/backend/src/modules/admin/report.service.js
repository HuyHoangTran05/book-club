import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import adminService from "./admin.service.js";

// pdfkit's built-in fonts do not contain Vietnamese diacritics, so strip tones
// for the PDF export to avoid missing-glyph boxes. The XLSX export keeps full
// Vietnamese text because spreadsheet rendering is Unicode-safe.
const COMBINING_MARKS = /[̀-ͯ]/g;

const removeTones = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export const buildSummaryWorkbook = async () => {
  const stats = await adminService.getStats();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Cộng Đồng Sách";
  workbook.created = new Date();

  const overview = workbook.addWorksheet("Tổng quan");
  overview.columns = [
    { header: "Chỉ số", key: "label", width: 34 },
    { header: "Giá trị", key: "value", width: 18 },
  ];
  overview.addRows([
    { label: "Tổng thành viên", value: stats.totals.members },
    { label: "Quản trị viên", value: stats.totals.admins },
    { label: "Người giao sách", value: stats.totals.deliverers },
    { label: "Tài khoản bị khoá", value: stats.totals.lockedMembers },
    { label: "Tổng đầu sách", value: stats.totals.bookTitles },
    { label: "Tổng bản sách", value: stats.totals.bookCopies },
    { label: "Sách sẵn sàng trao đổi", value: stats.totals.availableCopies },
    { label: "Tổng giao dịch", value: stats.totals.transactions },
    { label: "Giao dịch chờ xử lý", value: stats.transactionsByStatus.pending },
    { label: "Giao dịch hoàn tất", value: stats.transactionsByStatus.completed },
    { label: "Giao dịch đã huỷ", value: stats.transactionsByStatus.cancelled },
    { label: "Trao đổi vĩnh viễn", value: stats.transactionsByType.permanent },
    { label: "Cho mượn", value: stats.transactionsByType.lending },
    { label: "Giao dịch hôm nay", value: stats.transactionsOverTime.today },
    { label: "Giao dịch 7 ngày qua", value: stats.transactionsOverTime.last7Days },
    { label: "Giao dịch 30 ngày qua", value: stats.transactionsOverTime.last30Days },
    { label: "Tổng điểm lưu hành", value: stats.pointsInCirculation },
  ]);
  overview.getRow(1).font = { bold: true };

  const top = workbook.addWorksheet("Top thành viên");
  top.columns = [
    { header: "Hạng", key: "rank", width: 8 },
    { header: "Họ tên", key: "name", width: 28 },
    { header: "Email", key: "email", width: 32 },
    { header: "Điểm", key: "points", width: 12 },
    { header: "Vai trò", key: "role", width: 14 },
  ];
  stats.topMembers.forEach((member, index) => {
    top.addRow({
      rank: index + 1,
      name: member.full_name,
      email: member.email,
      points: member.point_balance,
      role: member.role,
    });
  });
  top.getRow(1).font = { bold: true };

  const pending = workbook.addWorksheet("Giao dịch treo trên 7 ngày");
  pending.columns = [
    { header: "Mã giao dịch", key: "id", width: 38 },
    { header: "Sách", key: "book", width: 30 },
    { header: "Người cho", key: "giver", width: 24 },
    { header: "Người nhận", key: "receiver", width: 24 },
    { header: "Loại", key: "type", width: 14 },
    { header: "Ngày tạo", key: "created", width: 22 },
  ];
  stats.pendingOver7Days.forEach((item) => {
    pending.addRow({
      id: item.transaction_id,
      book: item.book?.title ?? "",
      giver: item.giver?.full_name ?? "",
      receiver: item.receiver?.full_name ?? "",
      type: item.transaction_type,
      created: item.created_at ? new Date(item.created_at).toLocaleString("vi-VN") : "",
    });
  });
  pending.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

export const buildSummaryPdf = async () => {
  const stats = await adminService.getStats();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(20).text("Book Club - Admin Summary Report", { align: "center" });
    doc.moveDown(0.3);
    doc
      .fontSize(10)
      .fillColor("#555555")
      .text(`Generated: ${new Date().toLocaleString("en-GB")}`, { align: "center" });
    doc.moveDown(1).fillColor("#000000");

    const line = (label, value) => {
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${label}: `, { continued: true })
        .font("Helvetica-Bold")
        .text(String(value))
        .font("Helvetica");
    };

    doc.fontSize(14).text("Overview", { underline: true });
    doc.moveDown(0.4);
    line("Total members", stats.totals.members);
    line("Admins", stats.totals.admins);
    line("Deliverers", stats.totals.deliverers);
    line("Locked accounts", stats.totals.lockedMembers);
    line("Book titles", stats.totals.bookTitles);
    line("Book copies", stats.totals.bookCopies);
    line("Available copies", stats.totals.availableCopies);
    line("Total transactions", stats.totals.transactions);
    line(
      "Pending / Completed / Cancelled",
      `${stats.transactionsByStatus.pending} / ${stats.transactionsByStatus.completed} / ${stats.transactionsByStatus.cancelled}`,
    );
    line(
      "Permanent / Lending",
      `${stats.transactionsByType.permanent} / ${stats.transactionsByType.lending}`,
    );
    line(
      "Transactions today / 7d / 30d",
      `${stats.transactionsOverTime.today} / ${stats.transactionsOverTime.last7Days} / ${stats.transactionsOverTime.last30Days}`,
    );
    line("Points in circulation", stats.pointsInCirculation);

    doc.moveDown(1);
    doc.fontSize(14).text("Top 10 members by points", { underline: true });
    doc.moveDown(0.4);
    stats.topMembers.forEach((member, index) => {
      doc
        .font("Helvetica")
        .fontSize(11)
        .text(`${index + 1}. ${removeTones(member.full_name)} (${member.email}) - ${member.point_balance} pts`);
    });

    doc.moveDown(1);
    doc
      .fontSize(14)
      .text(`Transactions pending over 7 days: ${stats.pendingOver7Days.length}`, { underline: true });
    doc.moveDown(0.4);
    stats.pendingOver7Days.slice(0, 30).forEach((item) => {
      const created = item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB") : "";
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          `- ${removeTones(item.book?.title ?? "Unknown")} | ${removeTones(item.giver?.full_name ?? "")} -> ${removeTones(item.receiver?.full_name ?? "")} | ${item.transaction_type} | ${created}`,
        );
    });

    doc.end();
  });
};
