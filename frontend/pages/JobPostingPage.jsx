import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  TextField,
  Chip,
} from "@mui/material";

const JobPostingPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState(["React", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    const jobData = {
      jobTitle,
      company,
      location,
      description,
      skills,
    };
    console.log("Job Posting Saved:", jobData);
    alert("Job Posting Saved!");
  };

  const handleCancel = () => {
    setJobTitle("");
    setCompany("");
    setLocation("");
    setDescription("");
    setSkills([]);
    setNewSkill("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Job Posting
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Job Details Form */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Job Title"
            variant="outlined"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Company"
            variant="outlined"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            fullWidth
          />
          <TextField
            label="Location"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />
          <TextField
            label="Job Description"
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />
        </Box>

        {/* Requested Skills Section */}
        <Divider sx={{ my: 3 }} />
        <Typography variant="h5" gutterBottom>
          Requested Skills
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="Search or Add Skill"
            variant="outlined"
            size="small"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => handleRemoveSkill(skill)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        {/* Save / Cancel Buttons */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Job Posting
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobPostingPage;