import { useEffect } from "react";
import { Outlet, NavLink, Link, useMatch, useNavigate } from "react-router-dom";

const sections = [
  { to: "/profile/settings/profile", label: "Profile" },
  { to: "/profile/settings/security", label: "Security" },
];

export default function SettingsLayout() {
  const navigate = useNavigate();
  const isIndex = useMatch({ path: "/profile/settings", end: true });

  // On desktop, skip the menu page and go straight to Profile
  useEffect(() => {
    if (isIndex && window.innerWidth >= 768) {
      navigate("/profile/settings/profile", { replace: true });
    }
  }, [isIndex, navigate]);

  return (
    <div className="page settings-page">
      <Link to="/directory" className="btn-outline back-btn">← Directory</Link>

      <div className="settings-layout">
        <nav className={`settings-sidebar${isIndex ? "" : " settings-sidebar--child"}`}>
          <p className="settings-sidebar-title">Settings</p>
          {sections.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) =>
                `settings-nav-link${isActive ? " settings-nav-link--active" : ""}`
              }
            >
              <span>{s.label}</span>
              <span className="settings-nav-arrow">›</span>
            </NavLink>
          ))}
        </nav>

        <main className={`settings-content${isIndex ? " settings-content--hidden-mobile" : ""}`}>
          {!isIndex && (
            <Link to="/profile/settings" className="settings-back-mobile">← Settings</Link>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
