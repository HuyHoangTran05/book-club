import { useMemo, useState } from "react";
import { Badge, Button, Card, FormField, Input } from "../components/common/index.js";
import { mockBooks } from "../data/mockData.js";

const statusOptions = ["all", "available", "reserved", "borrowed", "exchanged", "unavailable"];

function BookListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      const searchText = `${book.title} ${book.author} ${book.category}`.toLowerCase();
      const matchesSearch = searchText.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || book.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Library</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Book List</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Browse mock books for Day 1 and prepare the UI for backend search and filters.</p>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Search books</span>
            <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title, author, or category" />
          </label>
          <FormField label="Status filter" as="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </FormField>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="flex flex-col justify-between gap-5">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">{book.title}</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">by {book.author}</p>
                </div>
                <Badge status={book.status} />
              </div>

              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-500">Category</dt>
                  <dd className="font-bold text-slate-900">{book.category}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Condition</dt>
                  <dd className="font-bold text-slate-900">{book.condition}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Exchange type</dt>
                  <dd className="font-bold text-slate-900">{book.exchangeType}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Owner</dt>
                  <dd className="font-bold text-slate-900">{book.owner}</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="sm:flex-1">Create Transaction</Button>
              <Button variant="secondary" className="sm:flex-1">
                Contact Owner
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BookListPage;
