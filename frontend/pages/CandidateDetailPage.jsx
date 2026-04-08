import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Box, Card, Typography, Button, Grid, Avatar, Chip } from '@mui/material';
import { ArrowLeft, Mail, Phone, Briefcase, Star } from 'lucide-react';
import { C, cardSx } from '../theme';

export default function CandidateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const candidate = useMemo(() => ({
    id, name:'John Doe', email:'john.doe@example.com', phone:'+1 234 567 8900',
    position:'Software Engineer', experience:'5 years',
    skills:['JavaScript','React','Node.js','Python'],
    status:'Applied', appliedDate:'2024-01-15',
  }), [id]);

  const statusColors = { Applied:`${C.primary}`, Shortlisted:`${C.warning}`, Interview:`${C.accent}`, Selected:`${C.success}`, Rejected:`${C.danger}` };

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, p:{ xs:'16px', sm:'24px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' } }}>
        <Button startIcon={<ArrowLeft size={16}/>} onClick={() => navigate('/candidates')}
          sx={{ color: C.muted, textTransform:'none', mb:3, '&:hover':{ color: C.text } }}>
          Back to Candidates
        </Button>

        <Typography variant="h4" sx={{ fontWeight:700, color: C.text, mb:4 }}>Candidate Details</Typography>

        <Grid container spacing={3}>
          {/* Profile card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ ...cardSx, p:3, textAlign:'center' }}>
              <Avatar sx={{ width:80, height:80, mx:'auto', mb:2, fontSize:32, fontWeight:700,
                background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                {candidate.name.charAt(0)}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>{candidate.name}</Typography>
              <Typography sx={{ color: C.muted, fontSize:14, mb:2 }}>{candidate.position}</Typography>
              <Chip label={candidate.status} sx={{ background:`${statusColors[candidate.status]}22`, color: statusColors[candidate.status], fontWeight:600 }} />
              <Box sx={{ mt:3, display:'flex', flexDirection:'column', gap:1.5 }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5, p:1.5, borderRadius:2, background: C.surface2 }}>
                  <Mail size={16} color={C.accent}/><Typography sx={{ color: C.muted, fontSize:13 }}>{candidate.email}</Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5, p:1.5, borderRadius:2, background: C.surface2 }}>
                  <Phone size={16} color={C.accent}/><Typography sx={{ color: C.muted, fontSize:13 }}>{candidate.phone}</Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5, p:1.5, borderRadius:2, background: C.surface2 }}>
                  <Briefcase size={16} color={C.accent}/><Typography sx={{ color: C.muted, fontSize:13 }}>{candidate.experience} experience</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ ...cardSx, p:3, mb:3 }}>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:3 }}>Skills</Typography>
              <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
                {candidate.skills.map(skill => (
                  <Chip key={skill} label={skill} sx={{ background:`${C.primary}22`, color: C.primary, fontWeight:600 }} />
                ))}
              </Box>
            </Card>

            <Card sx={{ ...cardSx, p:3 }}>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:3 }}>Application Info</Typography>
              <Box sx={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                <Box sx={{ p:2, borderRadius:2, background: C.surface2, flex:1, minWidth:140 }}>
                  <Typography sx={{ color: C.muted, fontSize:12, mb:0.5 }}>Applied Date</Typography>
                  <Typography sx={{ color: C.text, fontWeight:600 }}>{candidate.appliedDate}</Typography>
                </Box>
                <Box sx={{ p:2, borderRadius:2, background: C.surface2, flex:1, minWidth:140 }}>
                  <Typography sx={{ color: C.muted, fontSize:12, mb:0.5 }}>Position</Typography>
                  <Typography sx={{ color: C.text, fontWeight:600 }}>{candidate.position}</Typography>
                </Box>
                <Box sx={{ p:2, borderRadius:2, background: C.surface2, flex:1, minWidth:140 }}>
                  <Typography sx={{ color: C.muted, fontSize:12, mb:0.5 }}>Status</Typography>
                  <Chip label={candidate.status} size="small" sx={{ background:`${statusColors[candidate.status]}22`, color: statusColors[candidate.status], fontWeight:600 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt:3, display:'flex', gap:2 }}>
          <Button variant="contained" onClick={() => navigate('/jobform')}
            sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, borderRadius:2, textTransform:'none', fontWeight:600, boxShadow:'none' }}>
            Create Job
          </Button>
          <Button variant="outlined" onClick={() => navigate('/candidates')}
            sx={{ borderColor: C.border, color: C.muted, borderRadius:2, textTransform:'none', '&:hover':{ borderColor: C.primary, color: C.primary } }}>
            Back to Candidates
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

