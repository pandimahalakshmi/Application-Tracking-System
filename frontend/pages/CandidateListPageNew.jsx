import React, { useState } from "react";

import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
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
  InputAdornment,
  TablePagination,
  Checkbox,
  Tooltip,
} from "@mui/material";
import {
  Download,
  Edit,
  Delete,
  Visibility,
  Search,
  FileDownload,
  Phone,
  Email,
} from "@mui/icons-material";

const CandidateListPageNew = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pageNum, setPageNum] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (234) 567-8900",
      position: "Frontend Developer",
      appliedDate: "Mar 1, 2024",
      status: "Interview",
      experience: "3 years",
      salary: "$80K - $95K",
      location: "New York, NY",
      avatar: "JD",
      resume: "john_doe_resume.pdf",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1 (234) 567-8901",
      position: "Backend Developer",
      appliedDate: "Mar 2, 2024",
      status: "Shortlisted",
      experience: "5 years",
      salary: "$95K - $120K",
      location: "San Francisco, CA",
      avatar: "SS",
      resume: "sarah_smith_resume.pdf",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (234) 567-8902",
      position: "UI/UX Designer",
      appliedDate: "Mar 3, 2024",
      status: "Pending",
      experience: "2 years",
      salary: "$65K - $80K",
      location: "Los Angeles, CA",
      avatar: "MJ",
      resume: "mike_johnson_resume.pdf",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1 (234) 567-8903",
      position: "DevOps Engineer",
      appliedDate: "Mar 4, 2024",
      status: "Rejected",
      experience: "4 years",
      salary: "$100K - $130K",
      location: "Remote",
      avatar: "ED",
      resume: "emily_davis_resume.pdf",
    },
    {
      id: 5,
      name: "Alex Brown",
      email: "alex@example.com",
      phone: "+1 (234) 567-8904",
      position: "Frontend Developer",
      appliedDate: "Mar 5, 2024",
      status: "Selected",
      experience: "6 years",
      salary: "$110K - $140K",
      location: "Austin, TX",
      avatar: "AB",
      resume: "alex_brown_resume.pdf",
    },
    {
      id: 6,
      name: "Jessica Lee",
      email: "jessica@example.com",
      phone: "+1 (234) 567-8905",
      position: "Dev Manager",
      appliedDate: "Mar 6, 2024",
      status: "Interview",
      experience: "7 years",
      salary: "$120K - $150K",
      location: "Chicago, IL",
      avatar: "JL",
      resume: "jessica_lee_resume.pdf",
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

  const handleChangePage = (event, newPage) => {
    setPageNum(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPageNum(0);
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = new Set(filteredCandidates.map((c) => c.id));
      setSelectedRows(newSelected);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setOpenDialog(true);
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

  const handleDeleteCandidate = (id) => {
    setCandidates(candidates.filter((candidate) => candidate.id !== id));
  };

  const handleDeleteSelected = () => {
    setCandidates(
      candidates.filter((candidate) => !selectedRows.has(candidate.id))
    );
    setSelectedRows(new Set());
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Email", "Phone", "Position", "Status", "Applied Date", "Experience", "Salary", "Location"],
      ...filteredCandidates.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.position,
        c.status,
        c.appliedDate,
        c.experience,
        c.salary,
        c.location,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.csv";
    a.click();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
  };

  const paginatedCandidates = filteredCandidates.slice(
    pageNum * rowsPerPage,
    pageNum * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Candidates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredCandidates.length} candidates
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownload />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            placeholder="Search by name, email, position..."
            variant="outlined"
            size="small"
            fullWidth
            sx={{ flex: 1, minWidth: 250 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
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
          {selectedRows.size > 0 && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDeleteSelected}
            >
              Delete Selected ({selectedRows.size})
            </Button>
          )}
        </Box>
      </Paper>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows.size > 0 && selectedRows.size < filteredCandidates.length
                  }
                  checked={
                    filteredCandidates.length > 0 &&
                    selectedRows.size === filteredCandidates.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "20%" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Experience</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Salary</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCandidates.length > 0 ? (
              paginatedCandidates.map((candidate) => (
                <TableRow
                  key={candidate.id}
                  hover
                  selected={selectedRows.has(candidate.id)}
                  sx={{
                    backgroundColor: selectedRows.has(candidate.id) ? "#f0f0f0" : "white",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.has(candidate.id)}
                      onChange={() => handleSelectRow(candidate.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        sx={{
                          backgroundColor: getAvatarColor(candidate.status),
                          fontWeight: "bold",
                        }}
                      >
                        {candidate.avatar}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {candidate.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Applied: {candidate.appliedDate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{candidate.email}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {candidate.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>{candidate.experience}</TableCell>
                  <TableCell>{candidate.salary}</TableCell>
                  <TableCell>
                    <Chip
                      label={candidate.status}
                      color={getStatusColor(candidate.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewCandidate(candidate)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Update Status">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleUpdateStatus(candidate)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Resume">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => alert(`Downloading ${candidate.resume}`)}
                      >
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    No candidates found matching your criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredCandidates.length}
          rowsPerPage={rowsPerPage}
          page={pageNum}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Details Dialog */}
      {selectedCandidate && !openUpdateDialog && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Candidate Details
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    backgroundColor: getAvatarColor(selectedCandidate.status),
                    fontWeight: "bold",
                    fontSize: 28,
                    margin: "0 auto",
                  }}
                >
                  {selectedCandidate.avatar}
                </Avatar>
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  {selectedCandidate.name}
                </Typography>
                <Typography color="text.secondary">{selectedCandidate.position}</Typography>
              </Box>

              <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                  <Email fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2">{selectedCandidate.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                  <Phone fontSize="small" color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body2">{selectedCandidate.phone}</Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Experience
                </Typography>
                <Typography variant="body2">{selectedCandidate.experience}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Expected Salary
                </Typography>
                <Typography variant="body2">{selectedCandidate.salary}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Location
                </Typography>
                <Typography variant="body2">{selectedCandidate.location}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Status
                </Typography>
                <Chip
                  label={selectedCandidate.status}
                  color={getStatusColor(selectedCandidate.status)}
                  sx={{ mt: 1 }}
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
            Update Status - {selectedCandidate.name}
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
            <Button
              onClick={() => setOpenUpdateDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} variant="contained" color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default CandidateListPageNew;
