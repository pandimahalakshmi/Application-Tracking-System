import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const StatCard = ({ icon: Icon, title, value, bgColor = "#2196F3", trend, description }) => {
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${bgColor}20 0%, ${bgColor}10 100%)`,
        border: `1px solid ${bgColor}30`,
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
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
            {trend && (
              <Typography variant="caption" sx={{ color: bgColor, mt: 1, display: "block" }}>
                {trend}
              </Typography>
            )}
            {description && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          {Icon && (
            <Box
              sx={{
                p: 1,
                backgroundColor: `${bgColor}20`,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={28} style={{ color: bgColor }} />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;