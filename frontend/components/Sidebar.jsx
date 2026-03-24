import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#111827",
        color: "white",
        padding: "20px",
        position: "fixed",
      }}
    >
      <h2>ATS System</h2>

      {/* Admin Menu */}
      {role === "admin" && (
        <>
          <p
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer", padding: "10px 0" }}
          >
            Dashboard
          </p>

          <p
            onClick={() => navigate("/jobs")}
            style={{ cursor: "pointer", padding: "10px 0" }}
          >
            Jobs
          </p>

          <p
            onClick={() => navigate("/jobform")}
            style={{ cursor: "pointer", padding: "10px 0" }}
          >
            Create Job
          </p>

          <p
            onClick={() => navigate("/candidates")}
            style={{ cursor: "pointer", padding: "10px 0" }}
          >
            Candidates
          </p>
        </>
      )}

      {/* User Menu */}
      {role === "user" && (
        <>
          <p
            onClick={() => navigate("/userdashboard")}
            style={{ cursor: "pointer", padding: "10px 0" }}
          >
            Dashboard
          </p>

          <p
            onClick={() => navigate("/jobs")}
            style={{ cursor: "pointer", padding: "10px 0" }}
          >
            View Jobs
          </p>
        </>
      )}
    </div>
  );
};

export default Sidebar;