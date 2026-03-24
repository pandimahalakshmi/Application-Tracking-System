import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Grid,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
} from "@mui/material";
import {
  Search,
  Phone,
  Email,
  CalendarToday,
  Download,
  Edit,
  Delete,
  Call,
  MoreVert,
} from "@mui/icons-material";

const CandidateListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      position: "Frontend Developer",
      appliedDate: "Mar 1, 2024",
      status: "Interview",
      experience: "3 years",
      rating: 4.5,
      resume: "john_doe_resume.pdf",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1 234-567-8901",
      position: "Backend Developer",
      appliedDate: "Mar 2, 2024",
      status: "Shortlisted",
      experience: "5 years",
      rating: 4.8,
      resume: "sarah_smith_resume.pdf",
      avatar: "SS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 234-567-8902",
      position: "UI/UX Designer",
      appliedDate: "Mar 3, 2024",
      status: "Pending",
      experience: "2 years",
      rating: 4.2,
      resume: "mike_johnson_resume.pdf",
      avatar: "MJ",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 234-567-8903",
      position: "DevOps Engineer",
      appliedDate: "Mar 4, 2024",
      status: "Rejected",
      experience: "4 years",
      rating: 3.5,
      resume: "emily_davis_resume.pdf",
      avatar: "ED",
    },
    {
      id: 5,
      name: "Alex Brown",
      email: "alex@example.com",
      phone: "+1 234-567-8904",
      position: "Frontend Developer",
      appliedDate: "Mar 5, 2024",
      status: "Selected",
      experience: "6 years",
      rating: 5,
      resume: "alex_brown_resume.pdf",
      avatar: "AB",
    },
  ]);

  const getStatusColor = (status) => {
    const statusMap = {
      Pending: "default",
      Shortlisted: "info",
      Interview: "warning",
      Selected: "success",
      Rejected: "error",
    };
    return statusMap[status] || "default";
  };

  const getAvatarColor = (status) => {
    const colorMap = {
      Pending: "#FFC107",
      Shortlisted: "#2196F3",
      Interview: "#FF9800",
      Selected: "#4CAF50",
      Rejected: "#F44336",
    };
    return colorMap[status] || "#808080";
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || candidate.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
  };

  const handleDeleteCandidate = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
  };

  const handleUpdateStatus = (candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status);
    setOpenUpdateDialog(true);
  };

  const handleSaveStatus = () => {
    setCandidates(
      candidates.map((c) =>
        c.id === selectedCandidate.id ? { ...c, status: newStatus } : c
      )
    );
    setOpenUpdateDialog(false);
    setSelectedCandidate(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Candidates
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage and track your job applicants • Total: {candidates.length} candidates
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              placeholder="Search candidates by name, email, or position..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                <MenuItem value="Interview">Interview</MenuItem>
                <MenuItem value="Selected">Selected</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Candidates Grid */}
      {filteredCandidates.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCandidates.map((candidate) => (
            <Grid item xs={12} sm={6} md={4} key={candidate.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                    transform: "translateY(-4px)",
                  },
                  transition: "all 0.3s ease",
                  borderTop: `4px solid ${getAvatarColor(candidate.status)}`,
                }}
              >
                {/* Card Header */}
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 50,
                        height: 50,
                        backgroundColor: getAvatarColor(candidate.status),
                        fontWeight: "bold",
                      }}
                    >
                      {candidate.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {candidate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {candidate.position}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status Badge */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={candidate.status}
                      color={getStatusColor(candidate.status)}
                      size="small"
                    />
                  </Box>

                  {/* Candidate Info */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Email fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2">{candidate.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2">{candidate.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2">{candidate.appliedDate}</Typography>
                    </Box>
                  </Box>

                  {/* Experience and Rating */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {candidate.experience}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Rating
                      </Typography>
                      <Rating value={candidate.rating} readOnly size="small" />
                    </Box>
                  </Box>
                </CardContent>

                {/* Card Actions */}
                <CardActions sx={{ pt: 0, justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    color="primary"
                    startIcon={<Download />}
                    onClick={() => alert(`Download ${candidate.resume}`)}
                  >
                    Resume
                  </Button>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewCandidate(candidate)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateStatus(candidate)}
                    >
                      Update
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteCandidate(candidate.id)}
                    >
                      <Delete fontSize="small" />
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No candidates found matching your criteria.
          </Typography>
        </Paper>
      )}

      {/* View Candidate Details Dialog */}
      {selectedCandidate && !openUpdateDialog && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
            {selectedCandidate.name}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: getAvatarColor(selectedCandidate.status),
                    fontWeight: "bold",
                    fontSize: 24,
                    margin: "0 auto",
                  }}
                >
                  {selectedCandidate.avatar}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  {selectedCandidate.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedCandidate.position}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Email
                </Typography>
                <Typography variant="body2">{selectedCandidate.email}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Phone
                </Typography>
                <Typography variant="body2">{selectedCandidate.phone}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Experience
                </Typography>
                <Typography variant="body2">{selectedCandidate.experience}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Applied Date
                </Typography>
                <Typography variant="body2">{selectedCandidate.appliedDate}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Rating
                </Typography>
                <Rating value={selectedCandidate.rating} readOnly />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Status
                </Typography>
                <Chip
                  label={selectedCandidate.status}
                  color={getStatusColor(selectedCandidate.status)}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdateStatus(selectedCandidate)}
            >
              Update Status
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Update Status Dialog */}
      {selectedCandidate && openUpdateDialog && (
        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Update Status for {selectedCandidate.name}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>New Status</InputLabel>
              <Select
                value={newStatus}
                label="New Status"
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                <MenuItem value="Interview">Interview</MenuItem>
                <MenuItem value="Selected">Selected</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenUpdateDialog(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default CandidateListPage;
