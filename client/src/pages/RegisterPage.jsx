import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/auth";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values) {
    setServerError("");
    try {
      // Build FormData so the profile picture file is sent as multipart
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (values.address) formData.append("address", values.address);
      if (values.profilePicture?.[0]) {
        formData.append("profile_picture", values.profilePicture[0]);
      }

      const data = await registerUser(formData);
      login(data.token, data.user);
      navigate("/directory");
    } catch (err) {
      const errData = err.response?.data;
      setServerError(
        typeof errData?.error === "string"
          ? errData.error
          : errData?.message || "Registration failed. Try again.",
      );
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Church Directory</h1>
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>
            <input id="address" type="text" {...register("address")} />
          </div>

          <div className="form-group">
            <label htmlFor="profilePicture">Profile Photo (optional)</label>
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

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
