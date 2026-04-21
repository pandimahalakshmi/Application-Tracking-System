import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

import { Box, Typography, TextField, Button, InputAdornment, IconButton } from "@mui/material";

import { Eye, EyeOff, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";

const C = {
  bg: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  primary: '#6366F1',
  secondary:'#8B5CF6',
  text: '#F1F5F9',
  muted: '#94A3B8',
  danger: '#F87171',
};

export default function Login() {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPw,setShowPw] = useState(false);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);

  const login = async () => {

    if(!email || !password){
      setError("Please enter email and password");
      return;
    }

    try{

      setLoading(true);
      setError("");

      const result = await authService.login(email,password);

      if(result.success){

        localStorage.setItem("user",JSON.stringify(result.user));
        localStorage.setItem("role",result.user.role);

        if(result.user.role === "admin"){
          navigate("/dashboard");
        }else{
          navigate("/userdashboard");
        }

      }else{
        setError(result.error || "Login failed");
      }

    }catch(err){
      setError("Connection error. Backend not running.");
    }finally{
      setLoading(false);
    }

  };

  return (

    <Box sx={{ display:'flex',minHeight:'100vh',background:C.bg }}>

      {/* Left Side */}
      <Box sx={{
        flex:1,
        display:{xs:'none',md:'flex'},
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        borderRight:`1px solid ${C.border}`,
        p:6
      }}>

        <Box sx={{
          width:80,
          height:80,
          borderRadius:20,
          background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          mb:3
        }}>
          <Briefcase size={40} color="#fff"/>
        </Box>

        <Typography variant="h3" sx={{color:C.text,fontWeight:800}}>
          ATS System
        </Typography>

        <Typography sx={{color:C.muted,mt:2,textAlign:'center',maxWidth:300}}>
          Streamline your hiring process with our modern Applicant Tracking System
        </Typography>

      </Box>


      {/* Right Side */}
      <Box sx={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',p:4 }}>

        <Box sx={{ width:'100%',maxWidth:420 }}>

          <Typography variant="h4" sx={{color:C.text,fontWeight:800,mb:1}}>
            Welcome back
          </Typography>

          <Typography sx={{color:C.muted,mb:3}}>
            Sign in to your account
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            sx={{mb:2}}
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <Mail size={18}/>
                </InputAdornment>
              )
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            sx={{mb:2}}
            InputProps={{
              startAdornment:(
                <InputAdornment position="start">
                  <Lock size={18}/>
                </InputAdornment>
              ),
              endAdornment:(
                <InputAdornment position="end">
                  <IconButton onClick={()=>setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {error && (
            <Typography sx={{color:C.danger,mb:2}}>
              {error}
            </Typography>
          )}

          <Button
            fullWidth
            onClick={login}
            disabled={loading}
            endIcon={<ArrowRight size={18}/>}
            sx={{
              py:1.5,
              background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              color:"#fff",
              fontWeight:700
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <Typography sx={{textAlign:'center',mt:3,color:C.muted}}>

            Don't have an account?{" "}

            <Box
              component="span"
              onClick={()=>navigate("/signup")}
              sx={{color:C.primary,cursor:'pointer',fontWeight:700}}
            >
              Sign Up
            </Box>

          </Typography>

        </Box>

      </Box>

    </Box>

  );
}