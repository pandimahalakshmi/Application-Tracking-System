import Sidebar from "../components/Sidebar";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, Search } from "lucide-react";
import { candidateService } from "../services/api";

const Candidates = () => {
  const role = localStorage.getItem("role");
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDetail, setOpenDetail] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch candidates from backend
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await candidateService.getAllCandidates("All", "");
      
      if (result.success) {
        setCandidates(result.candidates);
      } else {
        setError(result.error || "Failed to load candidates");
      }
    } catch (err) {
      setError("Connection error: Backend not running on port 5000");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      const result = await candidateService.deleteCandidate(id);
      if (result.success) {
        setCandidates(candidates.filter(c => c.id !== id));
      }
    } catch (err) {
      setError("Failed to delete candidate");
    }
  };

  const handleStatusUpdate = async (candidate) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status);
    setOpenStatus(true);
  };

  const confirmStatusUpdate = async () => {
    try {
      const result = await candidateService.updateCandidateStatus(
        selectedCandidate.id,
        newStatus
      );

      if (result.success) {
        setCandidates(
          candidates.map(c =>
            c.id === selectedCandidate.id ? { ...c, status: newStatus } : c
          )
        );
        setOpenStatus(false);
      }
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleViewDetail = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDetail(true);
  };

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
          <Typography>Only admins can view candidates</Typography>
        </Card>
      </Box>
    );
  }

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
          <Typography variant="h6">Loading candidates...</Typography>
        </Box>
      </Box>
    );
  }

  const filteredCandidates = candidates.filter((candidate) => {
    const matchSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || candidate.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Applied: "#667eea",
      Shortlisted: "#f59e0b",
      Interview: "#06b6d4",
      Selected: "#10b981",
      Rejected: "#ef4444",
    };
    return colors[status] || "#667eea";
  };

  const getStatusBg = (status) => {
    const bgs = {
      Applied: "#f0f4ff",
      Shortlisted: "#fffbf0",
      Interview: "#f0fffe",
      Selected: "#f0fff4",
      Rejected: "#fef2f2",
    };
    return bgs[status] || "#f0f4ff";
  };

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
            Candidates Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Total: {filteredCandidates.length} candidates
          </Typography>
        </Box>

        {error && (
          <Card
            sx={{
              mb: 3,
              p: 2,
              background: "#fee",
              border: "1px solid #fcc",
              color: "#c33",
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Card>
        )}

        {/* Filters */}
        <Card sx={{ p: 2, mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search size={18} style={{ marginRight: "10px" }} />,
            }}
            variant="outlined"
            size="small"
            sx={{ minWidth: "250px" }}
          />

          <FormControl sx={{ minWidth: "150px" }} size="small">
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Shortlisted">Shortlisted</MenuItem>
              <MenuItem value="Interview">Interview</MenuItem>
              <MenuItem value="Selected">Selected</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{
              background: "#667eea",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Download CSV
          </Button>
        </Card>

        {/* Candidates Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: "#f8f9fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Candidate</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Experience</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id} sx={{ "&:hover": { background: "#f9f9f9" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ background: "#667eea" }}>
                          {candidate.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                            {candidate.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {candidate.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>
                      <Chip
                        label={candidate.status}
                        size="small"
                        sx={{
                          background: getStatusBg(candidate.status),
                          color: getStatusColor(candidate.status),
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                    <TableCell>{candidate.experience}</TableCell>
                    <TableCell>⭐ {candidate.rating}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetail(candidate)}
                        title="View"
                      >
                        <Eye size={18} color="#667eea" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleStatusUpdate(candidate)}
                        title="Update Status"
                      >
                        <Edit size={18} color="#f59e0b" />
                      </IconButton>
                      <IconButton size="small" title="Download Resume">
                        <Download size={18} color="#10b981" />
                      </IconButton>
                      <IconButton size="small" title="Delete">
                        <Trash2 size={18} color="#ef4444" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* View Detail Dialog */}
        <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>Candidate Details</DialogTitle>
          <DialogContent>
            {selectedCandidate && (
              <Box sx={{ pt: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                    Name
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>{selectedCandidate.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>{selectedCandidate.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                    Position Applied
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {selectedCandidate.position}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "#666", mb: 0.5 }}>
                    Status
                  </Typography>
                  <Chip
                    label={selectedCandidate.status}
                    sx={{
                      background: getStatusBg(selectedCandidate.status),
                      color: getStatusColor(selectedCandidate.status),
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetail(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={openStatus} onClose={() => setOpenStatus(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>Update Candidate Status</DialogTitle>
          <DialogContent>
            {selectedCandidate && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {selectedCandidate.name}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <MenuItem value="Applied">Applied</MenuItem>
                    <MenuItem value="Shortlisted">Shortlisted</MenuItem>
                    <MenuItem value="Interview">Interview</MenuItem>
                    <MenuItem value="Selected">Selected</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStatus(false)}>Cancel</Button>
            <Button
              onClick={confirmStatusUpdate}
              variant="contained"
              sx={{ background: "#667eea" }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Candidates;
