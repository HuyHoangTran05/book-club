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
    <div className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Point wallet</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Point History</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Mock point events follow the Day 1 business rules for starting points, lending, permanent exchange, and delivery rewards.
          </p>
        </div>
        <Card className="bg-slate-950 text-white">
          <p className="text-sm font-semibold text-slate-300">Current mock points</p>
          <p className="mt-2 text-4xl font-black">{mockCurrentUser.points} points</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="hidden grid-cols-[170px_1fr_130px_1.4fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-wide text-slate-500 md:grid">
          <span>Time</span>
          <span>Transaction</span>
          <span>Point change</span>
          <span>Reason</span>
        </div>
        <div className="divide-y divide-slate-100">
          {mockPointHistory.map((item) => (
            <div key={item.id} className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[170px_1fr_130px_1.4fr] md:items-center md:gap-4">
              <div>
                <p className="font-semibold text-slate-500 md:hidden">Time</p>
                <p className="font-bold text-slate-900">{item.time}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-500 md:hidden">Transaction</p>
                <p className="font-bold text-slate-900">{item.transaction}</p>
              </div>
              <div>
                <p className="mb-1 font-semibold text-slate-500 md:hidden">Point change</p>
                <Badge status={getPointBadgeStatus(item.pointChange)}>{formatPointChange(item.pointChange)} points</Badge>
              </div>
              <div>
                <p className="font-semibold text-slate-500 md:hidden">Reason</p>
                <p className="text-slate-600">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default PointHistoryPage;
