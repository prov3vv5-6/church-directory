import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/auth";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values) {
    setServerError("");
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Buhl Bible Church Directory</h1>
          <h2>Check your email</h2>
          <p style={{ marginBottom: "1.25rem", lineHeight: "1.6" }}>
            If an account with that email exists, we've sent a reset link. Check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="btn-outline" style={{ display: "block", textAlign: "center" }}>
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Buhl Bible Church Directory</h1>
        <h2>Forgot Password</h2>

        <p style={{ marginBottom: "1.25rem", fontSize: "0.9rem" }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Sending…" : "Send Reset Link"}
          </button>
        </form>

        <p className="auth-link">
          <Link to="/login">← Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
