import Sidebar from "../components/Sidebar";
import { Box, Container, Grid, Card, Typography, Button, Chip } from "@mui/material";
import {
  Briefcase,
  Clock,
  CheckCircle,
  Star,
  MapPin,
  DollarSign,
} from "lucide-react";

const UserDashboard = () => {
  const applications = [
    {
      title: "Frontend Developer",
      company: "Tech Startup Co.",
      status: "Interview Scheduled",
      statusColor: "#06b6d4",
      date: "2 days ago",
    },
    {
      title: "UI/UX Designer",
      company: "Creative Agency",
      status: "Under Review",
      statusColor: "#f59e0b",
      date: "1 week ago",
    },
    {
      title: "Backend Engineer",
      company: "Enterprise Solutions",
      status: "Applied",
      statusColor: "#667eea",
      date: "3 days ago",
    },
  ];

  const savedJobs = [
    {
      title: "React Developer",
      company: "Startup Hub",
      location: "Remote",
      salary: "$80k - $120k",
      type: "Full-time",
    },
    {
      title: "Senior Designer",
      company: "Design Studio",
      location: "New York",
      salary: "$70k - $100k",
      type: "Full-time",
    },
    {
      title: "QA Engineer",
      company: "Tech Corp",
      location: "Remote",
      salary: "$60k - $90k",
      type: "Contract",
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
            My Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Manage your job applications and saved jobs
          </Typography>
        </Box>

        {/* Summary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: "center", background: "#f0f4ff" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                  color: "#667eea",
                }}
              >
                <Briefcase size={28} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                3
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                Applications
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: "center", background: "#faf0ff" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                  color: "#764ba2",
                }}
              >
                <Star size={28} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                3
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                Saved Jobs
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: "center", background: "#f0fffe" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                  color: "#06b6d4",
                }}
              >
                <Clock size={28} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                1
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                In Progress
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 3, textAlign: "center", background: "#f0fff4" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                  color: "#10b981",
                }}
              >
                <CheckCircle size={28} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                0
              </Typography>
              <Typography variant="caption" sx={{ color: "#666" }}>
                Offers
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Applications */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                My Applications
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {applications.map((app, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: "1px solid #eee",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                          {app.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {app.company}
                        </Typography>
                      </Box>
                      <Chip
                        label={app.status}
                        size="small"
                        sx={{
                          background: app.statusColor,
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      Applied {app.date}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Saved Jobs */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Saved Jobs
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {savedJobs.map((job, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      border: "1px solid #eee",
                      borderRadius: 2,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {job.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {job.company}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        fontSize: "12px",
                        color: "#666",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <MapPin size={14} />
                        {job.location}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <DollarSign size={14} />
                        {job.salary}
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          background: "#667eea",
                          textTransform: "none",
                          borderRadius: 1,
                        }}
                      >
                        Apply Now
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 1,
                          textTransform: "none",
                        }}
                      >
                        Details
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserDashboard;
