import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import { Briefcase } from "lucide-react";
import { authService } from "../services/api";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !qualification ||
      !gender
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password must match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.signup({
        name,
        email,
        password,
        confirmPassword,
        phoneNumber,
        qualification,
        gender,
      });

      if (result.success) {
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);

        navigate(result.user.role === "admin" ? "/dashboard" : "/userdashboard");
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      setError("Connection error. Make sure backend is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: "0 10px 45px rgba(0,0,0,0.2)", borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", padding: "40px 20px", textAlign: "center" }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Briefcase size={40} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              ATS Signup
            </Typography>
          </Box>

          <Box sx={{ padding: "30px 30px" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
              Create your account
            </Typography>

            <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} margin="normal" variant="outlined" />
            <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" variant="outlined" />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" variant="outlined" />
            <TextField fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} margin="normal" variant="outlined" />
            <TextField fullWidth label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} margin="normal" variant="outlined" />
            <TextField fullWidth label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} margin="normal" variant="outlined" />
            <TextField select fullWidth label="Gender" value={gender} onChange={(e) => setGender(e.target.value)} margin="normal" variant="outlined">
              {genderOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {error && (
              <Box sx={{ mb: 2, p: 2, background: "#fee", border: "1px solid #fcc", borderRadius: 2, color: "#c33" }}>
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}

            <Button fullWidth variant="contained" sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "12px", fontSize: "16px", fontWeight: "bold", textTransform: "none", borderRadius: 2 }} onClick={signup} disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Box component="span" sx={{ color: "#667eea", fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/")}>Sign In</Box>
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </div>
  );
};

export default Signup;
