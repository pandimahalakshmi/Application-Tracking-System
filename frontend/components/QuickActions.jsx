import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Users, Briefcase, FileText, Upload, Calendar } from "lucide-react";

const QuickActions = () => {
  const actions = [
    { title: "View Candidates", icon: Users },
    { title: "Create Job", icon: Briefcase },
    { title: "Post Job", icon: FileText },
    { title: "Upload Resume", icon: Upload },
    { title: "Schedule Interview", icon: Calendar },
  ];

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 3 }}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card
            key={index}
            sx={{
              flex: "1 1 180px",
              minWidth: 180,
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
              transition: "all 0.3s ease",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 3 }}>
              <Icon size={32} style={{ color: "#2196F3", margin: "0 auto 10px" }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                {action.title}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default QuickActions;
