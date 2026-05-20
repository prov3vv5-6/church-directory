import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllMembers } from "../services/members";

export default function DirectoryPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllMembers()
      .then(setMembers)
      .catch(() => setError("Could not load members."))
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="page">
      <header className="directory-header">
        <h1>Church Directory</h1>
        <div className="header-actions">
          <Link to={`/profile/edit`} className="btn-secondary">
            Edit My Profile
          </Link>
          <button onClick={handleLogout} className="btn-outline">
            Sign Out
          </button>
        </div>
      </header>

      <p className="welcome-text">Welcome, {user?.name}</p>

      {loading && <p className="status-text">Loading members…</p>}
      {error && <p className="server-error">{error}</p>}

      <div className="member-grid">
        {members.map((member) => (
          <Link
            to={`/profile/${member.id}`}
            key={member.id}
            className="member-card"
          >
            <div className="member-avatar">
              {member.profile_picture_url ? (
                <img src={member.profile_picture_url} alt={member.name} />
              ) : (
                <div className="avatar-placeholder">
                  {member.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <p className="member-name">{member.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
