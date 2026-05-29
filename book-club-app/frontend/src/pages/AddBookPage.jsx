import { useState } from "react";
import { Alert, Button, Card, FormField } from "../components/common/index.js";

function AddBookPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("Add book form data", Object.fromEntries(formData.entries()));
    setShowSuccess(true);
    event.currentTarget.reset();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Contribute</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Add Book</h1>
        <p className="mt-2 text-sm text-slate-500">Create a mock listing now. Backend integration will replace the local submit later.</p>
      </div>

      {showSuccess ? <Alert type="success">Book added successfully.</Alert> : null}

      <Card>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Book title" name="title" type="text" placeholder="Book title" required />
          <FormField label="Author" name="author" type="text" placeholder="Author name" required />
          <FormField label="Category" name="category" type="text" placeholder="Fiction, Design, Business" required />
          <FormField label="Publisher" name="publisher" type="text" placeholder="Publisher" />
          <FormField label="Publication year" name="publicationYear" type="number" placeholder="2024" min="1000" max="2100" />
          <FormField label="ISBN" name="isbn" type="text" placeholder="978-0-000000-0-0" />
          <FormField label="Condition" name="condition" as="select" defaultValue="Good" required>
            <option>Like new</option>
            <option>Very good</option>
            <option>Good</option>
            <option>Acceptable</option>
          </FormField>
          <FormField label="Exchange type" name="exchangeType" as="select" defaultValue="Lending" required>
            <option>Lending</option>
            <option>Permanent exchange</option>
          </FormField>
          <FormField label="Note" name="note" as="textarea" className="md:col-span-2" placeholder="Add pickup details or book notes" />
          <div className="md:col-span-2">
            <Button type="submit">Add Book</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddBookPage;
