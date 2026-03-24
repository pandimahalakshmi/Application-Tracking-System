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

const JobDescriptionPage = () => {
  // Example job data
  const job = {
    title: "Software Engineer",
    company: "InnovateTech Solutions",
    location: "Chennai, India",
    type: "Full-time",
    description:
      "We are seeking a passionate Software Engineer to join our growing team. You will work on building scalable applications and contribute to product innovation.",
    responsibilities: [
      "Design, develop, and maintain web applications",
      "Collaborate with cross-functional teams",
      "Write clean, efficient, and testable code",
      "Participate in code reviews and agile ceremonies",
    ],
    requirements: [
      "Proficiency in JavaScript, React, and Node.js",
      "Experience with REST APIs and databases",
      "Strong problem-solving and debugging skills",
      "Good communication and teamwork abilities",
    ],
  };

  // Skills state
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {job.title}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {job.company} — {job.location}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {job.type}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {job.description}
        </Typography>

        <Typography variant="h5" gutterBottom>
          Responsibilities
        </Typography>
        <ul>
          {job.responsibilities.map((item, index) => (
            <li key={index}>
              <Typography variant="body1">{item}</Typography>
            </li>
          ))}
        </ul>

        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Requirements
        </Typography>
        <ul>
          {job.requirements.map((item, index) => (
            <li key={index}>
              <Typography variant="body1">{item}</Typography>
            </li>
          ))}
        </ul>

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

           <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Apply Now
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
          <Button variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Save Job Description
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDescriptionPage;