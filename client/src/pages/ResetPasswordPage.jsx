import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [serverError, setServerError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>Buhl Bible Church Directory</h1>
          <h2>Invalid Link</h2>
          <p style={{ marginBottom: "1.25rem" }}>
            This reset link is missing or invalid. Please request a new one.
          </p>
          <Link to="/forgot-password" className="btn-primary" style={{ display: "block", textAlign: "center" }}>
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(values) {
    setServerError("");
    try {
      await resetPassword(token, values.newPassword);
      navigate("/login?reset=success");
    } catch (err) {
      const errData = err.response?.data;
      setServerError(
        typeof errData?.error === "string" ? errData.error : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Buhl Bible Church Directory</h1>
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-wrapper">
              <input
                id="newPassword"
                type={showNew ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Must be at least 6 characters" },
                })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowNew((v) => !v)}>
                {showNew ? "🙈" : "👁"}
              </button>
            </div>
            {errors.newPassword && <span className="field-error">{errors.newPassword.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === watch("newPassword") || "Passwords do not match",
                })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving…" : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
