import React from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import Interviews from "./Interviews";
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: 256, position: "fixed", height: "100vh", overflowY: "auto" }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box sx={{ marginLeft: "256px", flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ backgroundColor: "white", borderBottom: "1px solid #eee" }}>
          <Header />
        </Box>

        <Box sx={{ flex: 1, backgroundColor: "#f5f7fb", overflowY: "auto", p: 4 }}>
          <Container maxWidth="lg" disableGutters>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                Recruitment Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome back! Here's what's happening with your recruitment today.
              </Typography>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={Users}
                  title="Total Candidates"
                  value="248"
                  bgColor="#2196F3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={Briefcase}
                  title="Active Jobs"
                  value="12"
                  bgColor="#FF9800"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={CheckCircle}
                  title="Applications Today"
                  value="24"
                  bgColor="#4CAF50"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  icon={Clock}
                  title="Shortlisted"
                  value="56"
                  bgColor="#9C27B0"
                />
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Quick Actions
              </Typography>
              <QuickActions />
            </Box>

            {/* Bottom Section - Recent Activity & Interviews */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
              <RecentActivity />
              <Interviews />
            </Box>

            {/* Outlet for nested routes */}
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
