import { Badge, Button, Card } from "../common/index.js";

function BookCard({ book, actions = null }) {
  return (
    <Card className="flex min-h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <Badge status="neutral">{book.category}</Badge>
        <Badge status={book.status}>{book.statusLabel}</Badge>
      </div>

      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={`Bìa sách ${book.title}`}
          className="h-44 w-full rounded-2xl object-cover"
          loading="lazy"
        />
      ) : null}

      <div>
        <h2 className="text-2xl font-extrabold leading-snug text-[#033b2a]">{book.title}</h2>
        <p className="mt-1 text-sm font-semibold text-[#64736d]">{book.author}</p>
      </div>

      {book.note ? <p className="text-sm leading-6 text-[#64736d]">{book.note}</p> : null}

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-[#fbfaf3] p-3">
          <dt className="font-semibold text-[#64736d]">Tình trạng</dt>
          <dd className="mt-1 font-extrabold text-[#082d24]">{book.conditionLabel}</dd>
        </div>
        <div className="rounded-2xl bg-[#fbfaf3] p-3">
          <dt className="font-semibold text-[#64736d]">Hình thức</dt>
          <dd className="mt-1 font-extrabold text-[#082d24]">{book.exchangeTypeLabel}</dd>
        </div>
      </dl>

      {book.ownerName ? (
        <div className="mt-auto border-t border-[#d9e2d8] pt-4">
          <p className="text-sm font-semibold text-[#64736d]">Chủ sách</p>
          <p className="mt-1 font-bold text-[#082d24]">{book.ownerName}</p>
        </div>
      ) : null}

      {actions ? <div className="mt-auto flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
    </Card>
  );
}

export function CommunityBookActions() {
  return (
    <>
      <Button type="button" className="sm:flex-1">
        Tạo giao dịch
      </Button>
      <Button type="button" variant="secondary" className="sm:flex-1">
        Liên hệ chủ sách
      </Button>
    </>
  );
}

export default BookCard;
