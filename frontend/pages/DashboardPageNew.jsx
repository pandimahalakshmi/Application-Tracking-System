import React, { useState } from "react";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  People,
  Business,
  CheckCircle,
  Hourglass,
  TrendingUp,
  Download,
  ArrowForward,
  NewspaperIcon,
  PersonAdd,
} from "@mui/icons-material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const DashboardPageNew = () => {
  const chartData = [
    { month: "Jan", applications: 45, hired: 5 },
    { month: "Feb", applications: 52, hired: 8 },
    { month: "Mar", applications: 48, hired: 6 },
    { month: "Apr", applications: 61, hired: 10 },
    { month: "May", applications: 55, hired: 7 },
    { month: "Jun", applications: 67, hired: 12 },
  ];

  const statusDistribution = [
    { name: "Pending", value: 25, color: "#FFC107" },
    { name: "Shortlisted", value: 30, color: "#2196F3" },
    { name: "Interview", value: 20, color: "#FF9800" },
    { name: "Selected", value: 15, color: "#4CAF50" },
    { name: "Rejected", value: 10, color: "#F44336" },
  ];

  const recentApplicants = [
    {
      id: 1,
      name: "John Doe",
      position: "Frontend Developer",
      appliedDate: "Today",
      status: "Pending",
      avatar: "JD",
    },
    {
      id: 2,
      name: "Sarah Smith",
      position: "Backend Developer",
      appliedDate: "2 days ago",
      status: "Shortlisted",
      avatar: "SS",
    },
    {
      id: 3,
      name: "Mike Johnson",
      position: "UI/UX Designer",
      appliedDate: "3 days ago",
      status: "Interview",
      avatar: "MJ",
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "DevOps Engineer",
      appliedDate: "5 days ago",
      status: "Selected",
      avatar: "ED",
    },
  ];

  const openJobs = [
    { id: 1, title: "Frontend Developer", applicants: 45, status: "Active" },
    { id: 2, title: "Backend Developer", applicants: 32, status: "Active" },
    { id: 3, title: "UI/UX Designer", applicants: 28, status: "Active" },
    { id: 4, title: "Project Manager", applicants: 18, status: "Closed" },
  ];

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

  const StatCard = ({ icon: Icon, title, value, subtitle, bgColor }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${bgColor}20 0%, ${bgColor}10 100%)`,
        border: `1px solid ${bgColor}30`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        transition: "all 0.3s ease",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              backgroundColor: `${bgColor}20`,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: bgColor, fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Welcome back! 👋
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Here's what's happening with your recruitment today
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={People}
            title="Total Candidates"
            value="245"
            subtitle="↑ 12% from last month"
            bgColor="#2196F3"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Business}
            title="Open Positions"
            value="8"
            subtitle="3 critical, 5 regular"
            bgColor="#FF9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckCircle}
            title="Hired This Month"
            value="12"
            subtitle="↑ 8% from previous"
            bgColor="#4CAF50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Hourglass}
            title="Pending Review"
            value="34"
            subtitle="Needs action"
            bgColor="#F44336"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Applications Over Time */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              Applications Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#2196F3"
                  strokeWidth={2}
                  dot={{ fill: "#2196F3", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="hired"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={{ fill: "#4CAF50", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Candidate Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
              Candidate Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Applicants and Open Jobs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Recent Applicants */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ boxShadow: 2 }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Recent Applicants
                </Typography>
                <Button
                  variant="text"
                  endIcon={<ArrowForward />}
                  href="/candidates"
                  sx={{ textTransform: "none" }}
                >
                  View All
                </Button>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Applicant</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Applied</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentApplicants.map((applicant) => (
                    <TableRow key={applicant.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ backgroundColor: "#2196F3" }}>
                            {applicant.avatar}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {applicant.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{applicant.position}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {applicant.appliedDate}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={applicant.status}
                          color={getStatusColor(applicant.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="small" variant="outlined">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Open Positions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ boxShadow: 2 }}>
            <Box sx={{ p: 3, borderBottom: "1px solid #eee" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Open Positions
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {openJobs.map((job, index) => (
                <Box key={job.id}>
                  <ListItem sx={{ py: 2.5, px: 3, "&:hover": { backgroundColor: "#f5f5f5" } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#2196F3",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {job.applicants}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={job.title}
                      secondary={`${job.applicants} applicants`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                    <Chip
                      label={job.status}
                      color={job.status === "Active" ? "success" : "default"}
                      size="small"
                    />
                  </ListItem>
                  {index < openJobs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                href="/job-posting"
              >
                Post New Job
              </Button>
              <Button
                variant="contained"
                color="info"
                startIcon={<Download />}
              >
                Download Reports
              </Button>
              <Button
                variant="contained"
                color="success"
                href="/resume-upload"
              >
                Upload Resume
              </Button>
              <Button variant="outlined" href="/candidates">
                Manage Candidates
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPageNew;
