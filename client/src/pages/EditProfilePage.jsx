import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMember, deleteMember, changePassword } from "../services/members";

export default function EditProfilePage() {
  const { user, login, token, logout } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [preview, setPreview] = useState(user?.profile_picture_url || null);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      address: user?.address || "",
    },
  });

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    formState: { errors: pwErrors, isSubmitting: pwSubmitting },
    reset: resetPw,
    watch: watchPw,
  } = useForm();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values) {
    setServerError("");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.address) formData.append("address", values.address);
      if (values.profilePicture?.[0]) {
        formData.append("profile_picture", values.profilePicture[0]);
      }

      const updatedUser = await updateMember(user.id, formData);

      // Keep AuthContext in sync so the rest of the app sees the new name/photo
      login(token, updatedUser);
      navigate("/directory");
    } catch (err) {
      const errData = err.response?.data;
      setServerError(typeof errData?.error === 'string' ? errData.error : errData?.message || "Update failed. Try again.");
    }
  }

  async function onPasswordSubmit(values) {
    setPwError("");
    setPwSuccess("");
    try {
      await changePassword(values.currentPassword, values.newPassword);
      setPwSuccess("Password updated successfully.");
      resetPw();
    } catch (err) {
      const errData = err.response?.data;
      setPwError(typeof errData?.error === "string" ? errData.error : "Failed to update password.");
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
    } catch (err) {
      setDeleteError("Failed to delete account. Try again.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" {...register("address")} />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">Profile Photo</label>
            {preview && (
              <img src={preview} alt="Preview" className="photo-preview" />
            )}
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              {...register("profilePicture")}
              onChange={(e) => {
                register("profilePicture").onChange(e);
                handleFileChange(e);
              }}
            />
          </div>

          {serverError && <p className="server-error">{serverError}</p>}

          <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/directory")}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="danger-zone">
          <h2>Change Password</h2>
          <form onSubmit={handleSubmitPw(onPasswordSubmit)} noValidate>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <div className="password-wrapper">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  {...registerPw("currentPassword", { required: "Current password is required" })}
                />
                <button type="button" className="password-toggle" onClick={() => setShowCurrent((v) => !v)}>
                  {showCurrent ? "🙈" : "👁"}
                </button>
              </div>
              {pwErrors.currentPassword && <span className="field-error">{pwErrors.currentPassword.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-wrapper">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  {...registerPw("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Must be at least 6 characters" },
                  })}
                />
                <button type="button" className="password-toggle" onClick={() => setShowNew((v) => !v)}>
                  {showNew ? "🙈" : "👁"}
                </button>
              </div>
              {pwErrors.newPassword && <span className="field-error">{pwErrors.newPassword.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  {...registerPw("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (val) => val === watchPw("newPassword") || "Passwords do not match",
                  })}
                />
                <button type="button" className="password-toggle" onClick={() => setShowConfirm((v) => !v)}>
                  {showConfirm ? "🙈" : "👁"}
                </button>
              </div>
              {pwErrors.confirmPassword && <span className="field-error">{pwErrors.confirmPassword.message}</span>}
            </div>

            {pwError && <p className="server-error">{pwError}</p>}
            {pwSuccess && <p className="success-msg">{pwSuccess}</p>}

            <button type="submit" disabled={pwSubmitting} className="btn-primary">
              {pwSubmitting ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        <div className="danger-zone">
          {deleteError && <p className="server-error">{deleteError}</p>}
          <button type="button" onClick={handleDeleteAccount} className="btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
