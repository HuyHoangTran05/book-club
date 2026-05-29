import { Link } from "react-router-dom";
import { Button, Card, FormField } from "../components/common/index.js";

function LoginPage() {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("Login form data", Object.fromEntries(formData.entries()));
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Welcome back</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-500">Access your book exchanges, transactions, and point history.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField label="Email" name="email" type="email" placeholder="alex@example.com" required />
          <FormField label="Password" name="password" type="password" placeholder="Enter your password" required />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link to="/register" className="font-bold text-teal-700 hover:text-teal-800">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default LoginPage;
