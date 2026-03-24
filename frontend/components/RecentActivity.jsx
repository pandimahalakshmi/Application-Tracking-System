import React from "react";
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import { Activity } from "lucide-react";

const RecentActivity = () => {
  const activities = [
    "Jennifer Lee Applied for Data Analyst",
    "Emily Davis Applied for ML Engineer",
    "Sarah Johnson Shortlisted",
    "David Martinez Reviewed Resume",
    "Michael Chen Scheduled Interview",
  ];

  return (
    <Card sx={{ flex: 1, boxShadow: 2, minWidth: 350 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Activity size={24} style={{ color: "#2196F3" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Recent Activity
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1.5,
                px: 0,
                borderBottom: index !== activities.length - 1 ? "1px solid #eee" : "none",
              }}
            >
              <ListItemText
                primary={activity}
                primaryTypographyProps={{ variant: "body2", sx: { fontWeight: 500 } }}
                secondary={`${Math.floor(Math.random() * 24)} hours ago`}
                secondaryTypographyProps={{ variant: "caption" }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
