import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMember, deleteMember } from "../services/members";

export default function EditProfilePage() {
  const { user, login, token, logout } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [preview, setPreview] = useState(user?.profile_picture_url || null);

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
          {deleteError && <p className="server-error">{deleteError}</p>}
          <button type="button" onClick={handleDeleteAccount} className="btn-danger">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
