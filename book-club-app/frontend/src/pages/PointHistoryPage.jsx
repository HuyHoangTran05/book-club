import { Badge, Card } from "../components/common/index.js";
import { mockCurrentUser, mockPointHistory } from "../data/mockData.js";

function getPointBadgeStatus(pointChange) {
  if (pointChange > 0) {
    return "positive";
  }

  if (pointChange < 0) {
    return "negative";
  }

  return "neutral";
}

function formatPointChange(pointChange) {
  return pointChange > 0 ? `+${pointChange}` : String(pointChange);
}

function PointHistoryPage() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-extrabold text-[#c9ad2e]">Ví điểm thưởng</p>
          <h1 className="mt-2 font-serif text-4xl font-extrabold leading-tight text-[#033b2a] md:text-5xl">
            Lịch sử điểm
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#64736d]">
            Theo dõi điểm thưởng của bạn trong quá trình chia sẻ và trao đổi sách.
          </p>
        </div>
        <Card className="bg-[#064834] text-white">
          <p className="text-sm font-semibold text-[#d9f2e4]">Điểm hiện tại</p>
          <p className="mt-2 text-5xl font-black">{mockCurrentUser.points}</p>
          <p className="mt-2 text-sm text-[#d9f2e4]">điểm có thể dùng cho giao dịch mới</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="hidden grid-cols-[170px_1fr_130px_1.4fr] gap-4 border-b border-[#d9e2d8] bg-[#fbfaf3] px-6 py-4 text-xs font-black text-[#64736d] md:grid">
          <span>Thời gian</span>
          <span>Giao dịch</span>
          <span>Thay đổi</span>
          <span>Lý do</span>
        </div>
        <div className="divide-y divide-[#d9e2d8]">
          {mockPointHistory.map((item) => (
            <div key={item.id} className="grid gap-3 px-6 py-5 text-sm md:grid-cols-[170px_1fr_130px_1.4fr] md:items-center md:gap-4">
              <div>
                <p className="font-semibold text-[#64736d] md:hidden">Thời gian</p>
                <p className="font-bold text-[#082d24]">{item.time}</p>
              </div>
              <div>
                <p className="font-semibold text-[#64736d] md:hidden">Giao dịch</p>
                <p className="font-bold text-[#082d24]">{item.transaction}</p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-[#64736d] md:hidden">Thay đổi</p>
                <Badge status={getPointBadgeStatus(item.pointChange)}>{formatPointChange(item.pointChange)} điểm</Badge>
              </div>
              <div>
                <p className="font-semibold text-[#64736d] md:hidden">Lý do</p>
                <p className="leading-6 text-[#64736d]">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default PointHistoryPage;
