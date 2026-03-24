import { Box, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Bell, Settings } from "lucide-react";

export function Header() {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        backgroundColor: "white",
        borderBottom: "1px solid #eee",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Recruitment Dashboard
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Management System
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Bell size={20} style={{ cursor: "pointer", color: "#666" }} />
        <Settings size={20} style={{ cursor: "pointer", color: "#666" }} />
        <Avatar sx={{ width: 40, height: 40, backgroundColor: "#2196F3" }}>
          AD
        </Avatar>
      </Box>
    </Box>
  );
}