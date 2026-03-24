import Sidebar from "../components/Sidebar";
import { Box, Container, Grid, Card, Typography, Button } from "@mui/material";
import {
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ color: "red", fontWeight: "bold" }}>
            Access Denied
          </Typography>
          <Typography>You do not have permission to access this page</Typography>
        </Card>
      </Box>
    );
  }

  const stats = [
    {
      title: "Total Candidates",
      value: "248",
      icon: Users,
      color: "#667eea",
      bgColor: "#f0f4ff",
    },
    {
      title: "Active Jobs",
      value: "12",
      icon: Briefcase,
      color: "#764ba2",
      bgColor: "#faf0ff",
    },
    {
      title: "Shortlisted",
      value: "56",
      icon: CheckCircle,
      color: "#06b6d4",
      bgColor: "#f0fffe",
    },
    {
      title: "Pending Review",
      value: "24",
      icon: Clock,
      color: "#f59e0b",
      bgColor: "#fffbf0",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          marginLeft: "260px",
          padding: "30px",
          width: "100%",
          background: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Welcome back, Administrator
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    p: 3,
                    background: stat.bgColor,
                    borderLeft: `4px solid ${stat.color}`,
                    cursor: "pointer",
                    transition: "transform 0.2s, boxShadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        background: stat.color,
                        color: "white",
                        p: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      <Icon size={24} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Recent Activity
              </Typography>
              <Box>
                {[
                  "John applied for Frontend Developer",
                  "Sarah shortlisted for UX Designer",
                  "Mike scheduled interview for Backend Developer",
                  "Emma uploaded resume for QA Engineer",
                  "Alex rejected for Marketing Role",
                ].map((activity, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      py: 2,
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Activity size={18} color="#667eea" />
                    <Typography variant="body2">{activity}</Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  View All Candidates
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: "#667eea",
                    color: "#667eea",
                  }}
                >
                  Create New Job
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: "#667eea",
                    color: "#667eea",
                  }}
                >
                  Schedule Interview
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
