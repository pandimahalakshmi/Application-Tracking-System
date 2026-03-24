import Sidebar from "../components/Sidebar";
import { Box, Grid, Card, Typography, Button, TextField, Chip } from "@mui/material";
import { MapPin, DollarSign, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService } from "../services/api";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await jobService.getAllJobs("");

      if (result.success) {
        setJobs(result.jobs);
      } else {
        setError(result.error || "Failed to load jobs");
      }
    } catch (err) {
      setError("Connection error: Backend not running on port 5000");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          sx={{
            marginLeft: "260px",
            padding: "30px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Typography variant="h6">Loading jobs...</Typography>
        </Box>
      </Box>
    );
  }

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
            Available Jobs
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Found {filteredJobs.length} positions
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search jobs by title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search size={20} style={{ marginRight: "10px" }} />,
            }}
            variant="outlined"
            sx={{
              background: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Jobs Grid */}
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Card
                sx={{
                  p: 3,
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {job.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {job.company}
                    </Typography>
                  </Box>
                  <Chip
                    label={job.type}
                    size="small"
                    sx={{
                      background: job.type === "Full-time" ? "#dcfce7" : "#fef3c7",
                      color: job.type === "Full-time" ? "#16a34a" : "#b45309",
                      fontWeight: "bold",
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: "#555" }}>
                  {job.description}
                </Typography>

                <Box sx={{ mb: 2, display: "flex", gap: 2, fontSize: "14px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MapPin size={16} color="#667eea" />
                    {job.location}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <DollarSign size={16} color="#667eea" />
                    {job.salary}
                  </Box>
                </Box>

                <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {job.tags.map((tag, idx) => (
                    <Chip
                      key={idx}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#667eea",
                        color: "#667eea",
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    {job.applications} applications
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                  >
                    Apply Now
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Jobs;
