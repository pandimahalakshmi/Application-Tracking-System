import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4', warning:'#F59E0B', success:'#10B981', danger:'#F87171', text:'#F1F5F9', muted:'#94A3B8' };
const COLORS = [C.primary, C.accent, C.warning, C.success, C.danger, C.secondary, '#EC4899', '#14B8A6', '#F97316', '#A78BFA'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const title = payload[0]?.payload?.fullName || payload[0]?.payload?.name || label;
  return (
    <Box sx={{ background:'#1E293B', border:`1px solid #475569`, borderRadius:2, p:1.5, boxShadow:'0 8px 24px rgba(0,0,0,0.7)' }}>
      {title && <Typography sx={{ color:'#F1F5F9', fontSize:13, fontWeight:700, mb:0.5 }}>{title}</Typography>}
      {payload.map((p, i) => {
        const color = p.fill || p.color || '#6366F1';
        return (
          <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Box sx={{ width:10, height:10, borderRadius:'50%', background: color, flexShrink:0 }}/>
            <Typography sx={{ color:'#F1F5F9', fontSize:12 }}>{p.name}: <strong style={{ color }}>{p.value}</strong></Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <Box sx={{ background:'#1E293B', border:`1px solid #475569`, borderRadius:2, p:1.5,
      boxShadow:'0 8px 24px rgba(0,0,0,0.7)', pointerEvents:'none' }}>
      <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
        <Box sx={{ width:10, height:10, borderRadius:'50%', background: d?.color, flexShrink:0 }}/>
        <Typography sx={{ color:'#F1F5F9', fontSize:13, fontWeight:700 }}>{d?.name}</Typography>
      </Box>
      <Typography sx={{ color: d?.color, fontSize:12, fontWeight:700, mt:0.5 }}>
        {d?.value} application{d?.value !== 1 ? 's' : ''}
      </Typography>
    </Box>
  );
};

// Exported separately so AdminDashboard can place it anywhere
export function ApplicationStatusPie({ applications }) {
  const navigate = useNavigate();

  const statusData = [
    { name:'Pending',     key:'Pending',              color: C.warning  },
    { name:'Shortlisted', key:'Shortlisted',           color: C.accent   },
    { name:'Interview',   key:'Interview Scheduled',   color: C.primary  },
    { name:'Selected',    key:'Selected',              color: C.success  },
    { name:'Rejected',    key:'Rejected',              color: C.danger   },
  ].map(s => ({ ...s, value: applications.filter(a => a.status === s.key).length }))
   .filter(s => s.value > 0);

  const handleClick = (data) => {
    if (data?.key) navigate(`/candidates?status=${encodeURIComponent(data.key)}`);
  };

  if (statusData.length === 0) return (
    <Typography sx={{ color: C.muted, textAlign:'center', py:4 }}>No application data yet</Typography>
  );

  return (
    <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
      {/* Pie chart */}
      <ResponsiveContainer width={130} height={130}>
        <PieChart>
          <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={58}
            paddingAngle={3} dataKey="value"
            cursor="pointer" onClick={handleClick} strokeWidth={0}>
            {statusData.map((s, i) => <Cell key={i} fill={s.color} stroke="none"/>)}
          </Pie>
          <Tooltip content={<PieTooltip/>} wrapperStyle={{ outline:'none' }}/>
        </PieChart>
      </ResponsiveContainer>
      {/* Legend below */}
      <Box sx={{ display:'flex', flexDirection:'column', gap:0.75, width:'100%', mt:1.5 }}>
        {statusData.map((s, i) => (
          <Box key={i} onClick={() => handleClick(s)}
            sx={{ display:'flex', alignItems:'center', justifyContent:'center', gap:1, cursor:'pointer',
              px:1, py:0.5, borderRadius:1.5, transition:'all 0.2s',
              '&:hover':{ background:`${s.color}18` } }}>
            <Box sx={{ width:7, height:7, borderRadius:'50%', background: s.color, flexShrink:0 }}/>
            <Typography sx={{ color: C.text, fontSize:'0.7rem', fontWeight:600 }}>{s.name}</Typography>
            <Box sx={{ px:0.75, py:0.2, borderRadius:8, background:`${s.color}22`, flexShrink:0 }}>
              <Typography sx={{ color: s.color, fontSize:'0.65rem', fontWeight:700 }}>{s.value}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function AnalyticsCharts({ stats, jobs, applications }) {
  const allJobData = [...jobs]
    .sort((a, b) => (b.applications || 0) - (a.applications || 0))
    .map((j, i) => {
      const abbr = j.title.split(' ').filter(w => w.length > 1).slice(0, 3).map(w => w[0].toUpperCase()).join('');
      return { fullName: j.title, name: abbr, applications: j.applications || 0, fill: COLORS[i % COLORS.length] };
    });

  const overviewData = [
    { name:'Jobs',         value: stats.totalJobs },
    { name:'Users',        value: stats.totalUsers },
    { name:'Applications', value: stats.totalApplications },
    { name:'Jobs Applied', value: stats.activeJobs },
  ];

  const chartCard = (title, children) => (
    <Card sx={{ p:{ xs:'14px', sm:3 }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:3 } }}>
      <Typography sx={{ fontWeight:700, color: C.text, mb:{ xs:1.5, sm:2.5 }, fontSize:{ xs:'0.875rem', sm:'1.1rem' } }}>{title}</Typography>
      {children}
    </Card>
  );

  return (
    <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', lg:'2fr 1fr' }, gap:{ xs:1.5, sm:3 }, mt:{ xs:1.5, sm:3 } }}>

      {/* Applications per Job */}
      {chartCard('Applications per Job',
        <Box>
          {allJobData.length === 0 ? (
            <Typography sx={{ color: C.muted, textAlign:'center', py:4 }}>No job data yet</Typography>
          ) : (
            <Box sx={{ overflowX:'auto', pb:1,
              '&::-webkit-scrollbar':{ height:3 },
              '&::-webkit-scrollbar-thumb':{ background: C.border, borderRadius:2 } }}>
              <Box sx={{ minWidth: Math.max(allJobData.length * 60, 280) }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={allJobData} margin={{ top:4, right:4, left:-24, bottom:4 }}>
                    <XAxis dataKey="name" tick={{ fill: C.muted, fontSize:11, fontWeight:600 }} axisLine={false} tickLine={false} interval={0}/>
                    <YAxis tick={{ fill: C.muted, fontSize:10 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="applications" radius={[5,5,0,0]} name="Applications" maxBarSize={40}>
                      {allJobData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
          {allJobData.length > 0 && (
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:{ xs:1, sm:1.5 }, mt:1 }}>
              {allJobData.map((j, i) => (
                <Box key={i} sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                  <Box sx={{ width:7, height:7, borderRadius:'50%', background: j.fill, flexShrink:0 }}/>
                  <Typography sx={{ color: C.muted, fontSize:{ xs:'0.6rem', sm:'0.68rem' } }}>{j.fullName} ({j.applications})</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Platform Overview */}
      {chartCard('Platform Overview',
        <Box>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={overviewData} layout="vertical" margin={{ top:0, right:12, left:0, bottom:0 }}>
              <XAxis type="number" tick={{ fill: C.muted, fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{ fill: C.muted, fontSize:11 }} axisLine={false} tickLine={false} width={80}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="value" radius={[0,4,4,0]} name="Count">
                {overviewData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:{ xs:1, sm:1.5 }, mt:1 }}>
            {overviewData.map((d, i) => (
              <Box key={i} sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                <Box sx={{ width:7, height:7, borderRadius:'50%', background: COLORS[i % COLORS.length], flexShrink:0 }}/>
                <Typography sx={{ color: C.muted, fontSize:{ xs:'0.6rem', sm:'0.68rem' } }}>{d.name} ({d.value})</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
