import { Link } from "react-router-dom";
import { Alert, Button, Card, FormField } from "../components/common/index.js";

function RegisterPage() {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("Register form data", Object.fromEntries(formData.entries()));
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Join the club</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Create Account</h1>
          <p className="mt-2 text-sm text-slate-500">Start trading books with members in your reading community.</p>
        </div>

        <Alert type="info" className="mb-5">
          New accounts receive 20 starting points.
        </Alert>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField label="Full name" name="fullName" type="text" placeholder="Alex Morgan" required />
          <FormField label="Email" name="email" type="email" placeholder="alex@example.com" required />
          <FormField label="Password" name="password" type="password" placeholder="Create a password" required />
          <FormField label="Phone number" name="phoneNumber" type="tel" placeholder="+1 555 0123" required />
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-teal-700 hover:text-teal-800">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;
