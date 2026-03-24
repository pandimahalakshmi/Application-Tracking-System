import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  TextField,
} from "@mui/material";

const ResumeUploadPage = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = () => {
    if (file) {
      alert(`Resume "${file.name}" uploaded successfully!`);
      // TODO: send file to backend API
    } else {
      alert("Please upload a resume before saving.");
    }
  };

  const handleCancel = () => {
    setFile(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resume Upload
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            Please upload your resume (PDF or DOCX format).
          </Typography>
          <TextField
            type="file"
            inputProps={{ accept: ".pdf,.doc,.docx" }}
            onChange={handleFileChange}
            fullWidth
          />
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {file.name}
            </Typography>
          )}
        </Box>

        {/* Footer buttons */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Resume
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResumeUploadPage;