import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMember } from "../services/members";

export default function MemberProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMember(id)
      .then(setMember)
      .catch(() => setError("Member not found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="status-text">Loading…</p>;
  if (error) return <p className="server-error">{error}</p>;

  const isOwnProfile = user?.id === member?.id;

  return (
    <div className="page profile-page">
      <button onClick={() => navigate(-1)} className="btn-outline back-btn">
        ← Back
      </button>

      <div className="profile-card">
        <div className="profile-avatar">
          {member.profile_picture_url ? (
            <img src={member.profile_picture_url} alt={member.name} />
          ) : (
            <div className="avatar-placeholder large">
              {member.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h2>{member.name}</h2>
        <p className="profile-email">{member.email}</p>
        {member.address && <p className="profile-address">{member.address}</p>}

        {isOwnProfile && (
          <Link to="/profile/edit" className="btn-primary" style={{ marginTop: "1rem" }}>
            Edit My Profile
          </Link>
        )}
      </div>
    </div>
  );
}
