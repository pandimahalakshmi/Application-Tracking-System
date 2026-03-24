import React from "react";
import { Card, CardContent, Typography, Box, List, ListItem, Avatar, Chip } from "@mui/material";
import { Calendar } from "lucide-react";

const Interviews = () => {
  const interviews = [
    { name: "Sarah Johnson", position: "Full Stack Developer", time: "Today 2:00 PM" },
    { name: "Lisa Anderson", position: "Python Developer", time: "Tomorrow 10:00 AM" },
    { name: "Michael Chen", position: "Backend Developer", time: "Friday 3:30 PM" },
    { name: "Jessica White", position: "Frontend Developer", time: "Next Week" },
  ];

  return (
    <Card sx={{ flex: 1, boxShadow: 2, minWidth: 350 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Calendar size={24} style={{ color: "#FF9800" }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Upcoming Interviews
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {interviews.map((interview, index) => (
            <ListItem
              key={index}
              sx={{
                py: 2,
                px: 0,
                borderBottom: index !== interviews.length - 1 ? "1px solid #eee" : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Avatar sx={{ width: 40, height: 40, backgroundColor: "#FF9800" }}>
                {interview.name.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                  {interview.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {interview.position}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={interview.time}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default Interviews;
