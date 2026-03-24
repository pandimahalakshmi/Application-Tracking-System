import Sidebar from "../components/Sidebar";
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { Plus } from "lucide-react";
import { jobService } from "../services/api";

const JobForm = () => {
  const role = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: "",
  });

  // tags and skills are separate lists the user can add
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (role !== "admin") {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ color: "red", fontWeight: "bold" }}>
            Access Denied
          </Typography>
          <Typography>Only admins can create job postings</Typography>
        </Card>
      </Box>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // skills helpers
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.company || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await jobService.createJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements,
        tags: tags,
        skills: skills,
      });

      if (result.success) {
        setSubmitted(true);
        // Reset form
        setFormData({
          title: "",
          company: "",
          location: "",
          type: "Full-time",
          salary: "",
          description: "",
          requirements: "",
        });
        setTags([]);
        
        setTimeout(() => {
          setSubmitted(false);
        }, 2000);
      } else {
        setError(result.error || "Failed to create job");
      }
    } catch (err) {
      setError("Connection error: Backend not running on port 5000");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          marginLeft: "260px",
          padding: "30px",
          width: "100%",
          background: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Create New Job Posting
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Fill in the details to post a new job position
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                {submitted && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      background: "#dcfce7",
                      border: "1px solid #bbf7d0",
                      borderRadius: 2,
                      color: "#16a34a",
                    }}
                  >
                    ✓ Job posted successfully!
                  </Box>
                )}

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Job Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Job Type</InputLabel>
                      <Select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Full-time">Full-time</MenuItem>
                        <MenuItem value="Part-time">Part-time</MenuItem>
                        <MenuItem value="Contract">Contract</MenuItem>
                        <MenuItem value="Internship">Internship</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Salary Range (e.g., $50k - $80k)"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Job Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={5}
                    required
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Box>

                {/* Skills Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                    Required Skills
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      placeholder="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      size="small"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={addSkill}
                      sx={{
                        background: "#667eea",
                        borderRadius: 1,
                      }}
                    >
                      <Plus size={20} />
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        onDelete={() => removeSkill(idx)}
                        sx={{
                          background: "#f0f4ff",
                          color: "#667eea",
                          fontWeight: "bold",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      padding: "10px 30px",
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "16px",
                    }}
                  >
                    Post Job
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "#ccc",
                      color: "#666",
                      padding: "10px 30px",
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, background: "#f0f4ff", border: "1px solid #d6e4ff" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Tips for Job Posts
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#667eea" }}>
                    📝 Clear Job Title
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Be specific and descriptive
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#667eea" }}>
                    💼 Detailed Description
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Include key responsibilities
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#667eea" }}>
                    🎯 List Requirements
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Specify must-have and nice-to-have skills
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#667eea" }}>
                    💰 Competitive Salary
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Higher salary attracts better candidates
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default JobForm;
