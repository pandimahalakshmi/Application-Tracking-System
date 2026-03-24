import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { Briefcase } from "lucide-react";
import { authService } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        // Save user info to localStorage
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userName", result.user.name);
        localStorage.setItem("userEmail", result.user.email);

        // Navigate based on role
        if (result.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/userdashboard");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("Connection error. Make sure backend is running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
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
        <Card
          sx={{
            boxShadow: "0 10px 45px rgba(0,0,0,0.2)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "40px 20px",
              textAlign: "center",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Briefcase size={40} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              ATS System
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
              Applicant Tracking System
            </Typography>
          </Box>

          <Box sx={{ padding: "40px 30px" }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
            >
              Login to Your Account
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="admin@gmail.com or user@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            {error && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  background: "#fee",
                  border: "1px solid #fcc",
                  borderRadius: 2,
                  color: "#c33",
                }}
              >
                <Typography variant="body2">{error}</Typography>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
              }}
              onClick={login}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Don’t have an account?{' '}
                <Box component="span" sx={{ color: "#667eea", fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/signup")}>Sign Up</Box>
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                background: "#f5f5f5",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                Test Credentials:
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Admin:</strong> admin@gmail.com
              </Typography>
              <Typography variant="caption" display="block">
                <strong>User:</strong> user@gmail.com
              </Typography>
            </Box>
          </Box>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
