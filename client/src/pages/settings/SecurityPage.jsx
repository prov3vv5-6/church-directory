import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { deleteMember, changePassword } from "../../services/members";

export default function SecurityPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  async function onPasswordSubmit(values) {
    setPwError("");
    setPwSuccess("");
    try {
      await changePassword(values.currentPassword, values.newPassword);
      setPwSuccess("Password updated successfully.");
      reset();
    } catch (err) {
      const errData = err.response?.data;
      setPwError(
        typeof errData?.error === "string" ? errData.error : "Failed to update password."
      );
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmed) return;
    try {
      await deleteMember(user.id);
      logout();
      navigate("/login");
    } catch {
      setDeleteError("Failed to delete account. Try again.");
    }
  }

  return (
    <>
      <div className="settings-section">
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit(onPasswordSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-wrapper">
              <input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                {...register("currentPassword", { required: "Current password is required" })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowCurrent((v) => !v)}>
                {showCurrent ? "🙈" : "👁"}
              </button>
            </div>
            {errors.currentPassword && <span className="field-error">{errors.currentPassword.message}</span>}
          </div>

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
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (val) => val === watch("newPassword") || "Passwords do not match",
                })}
              />
              <button type="button" className="password-toggle" onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}
          </div>

          {pwError && <p className="server-error">{pwError}</p>}
          {pwSuccess && <p className="success-msg">{pwSuccess}</p>}

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      <div className="settings-section settings-danger-zone">
        <h2>Danger Zone</h2>
        <p className="settings-danger-desc">
          Permanently delete your account and all data associated with it.
        </p>
        {deleteError && <p className="server-error">{deleteError}</p>}
        <button type="button" onClick={handleDeleteAccount} className="btn-danger">
          Delete Account
        </button>
      </div>
    </>
  );
}
