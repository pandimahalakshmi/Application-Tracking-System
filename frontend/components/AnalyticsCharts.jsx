import { Box, Card, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4', warning:'#F59E0B', success:'#10B981', text:'#F1F5F9', muted:'#94A3B8' };

const COLORS = [C.primary, C.accent, C.warning, C.success, '#F87171'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:2, p:1.5 }}>
      <Typography sx={{ color: C.text, fontSize:13, fontWeight:600 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} sx={{ color: p.color, fontSize:12 }}>{p.name}: {p.value}</Typography>
      ))}
    </Box>
  );
};

export default function AnalyticsCharts({ stats, jobs, applications }) {
  const statusData = [
    { name: 'Pending',    value: applications.filter(a => a.status === 'Pending').length },
    { name: 'Shortlisted',value: applications.filter(a => a.status === 'Shortlisted').length },
    { name: 'Interview',  value: applications.filter(a => a.status === 'Interview Scheduled').length },
    { name: 'Selected',   value: applications.filter(a => a.status === 'Selected').length },
    { name: 'Rejected',   value: applications.filter(a => a.status === 'Rejected').length },
  ].filter(d => d.value > 0);

  const jobData = jobs.slice(0, 6).map(j => ({
    name: j.title.length > 12 ? j.title.slice(0, 12) + '…' : j.title,
    applications: j.applications || 0,
  }));

  const overviewData = [
    { name: 'Jobs',         value: stats.totalJobs },
    { name: 'Users',        value: stats.totalUsers },
    { name: 'Applications', value: stats.totalApplications },
    { name: 'Active Jobs',  value: stats.activeJobs },
  ];

  const chartCard = (title, children) => (
    <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
      <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:3 }}>{title}</Typography>
      {children}
    </Card>
  );

  return (
    <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1fr 1fr', lg:'2fr 1fr' }, gap:3, mt:3 }}>
      {chartCard('Applications per Job',
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={jobData} margin={{ top:0, right:0, left:-20, bottom:0 }}>
            <XAxis dataKey="name" tick={{ fill: C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="applications" fill={C.primary} radius={[4,4,0,0]} name="Applications"/>
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartCard('Application Status',
        statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip content={<CustomTooltip/>}/>
              <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ color: C.muted, fontSize:12 }}>{v}</span>}/>
            </PieChart>
          </ResponsiveContainer>
        ) : <Typography sx={{ color: C.muted, textAlign:'center', py:4 }}>No application data yet</Typography>
      )}

      {chartCard('Platform Overview',
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={overviewData} layout="vertical" margin={{ top:0, right:16, left:0, bottom:0 }}>
            <XAxis type="number" tick={{ fill: C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="name" tick={{ fill: C.muted, fontSize:12 }} axisLine={false} tickLine={false} width={90}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Bar dataKey="value" radius={[0,4,4,0]} name="Count">
              {overviewData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
