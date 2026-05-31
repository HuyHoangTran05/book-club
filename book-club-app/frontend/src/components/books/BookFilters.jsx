import { Button, Card, FormField, Input } from "../common/index.js";
import { categoryOptions } from "./bookOptions.js";

function BookFilters({ category, onCategoryChange, onSearchChange, searchTerm }) {
  return (
    <Card>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_120px] lg:items-end">
        <label>
          <span className="mb-2 block text-sm font-bold text-[#082d24]">
            Tìm theo tên sách, tác giả hoặc thể loại
          </span>
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tên sách, tác giả hoặc thể loại"
          />
        </label>
        <FormField label="Thể loại" as="select" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">Tất cả thể loại</option>
          {categoryOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FormField>
        <Button type="button" className="h-12">
          Tìm kiếm
        </Button>
      </div>
    </Card>
  );
}

export default BookFilters;
