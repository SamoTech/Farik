import { useState, useEffect, useRef } from "react";

// ============================================================
// NEXUS HR — Open Source Human Resource Intelligence Platform
// Free Tier + Paid Pro Features
// ============================================================

const COLORS = {
  bg: "#0a0c10",
  surface: "#111318",
  surfaceAlt: "#161a22",
  border: "#1e2430",
  accent: "#00e5a0",
  accentDim: "#00e5a022",
  accentMid: "#00e5a044",
  gold: "#f5c842",
  goldDim: "#f5c84222",
  red: "#ff4d6d",
  redDim: "#ff4d6d22",
  blue: "#4d9fff",
  blueDim: "#4d9fff22",
  purple: "#b57bee",
  purpleDim: "#b57bee22",
  text: "#e8eaf0",
  textMuted: "#6b7280",
  textDim: "#3a4050",
};

const FONT = "'Space Mono', 'Courier New', monospace";
const FONT_DISPLAY = "'Syne', 'Arial Black', sans-serif";

// ── Sample Data ──────────────────────────────────────────────

const EMPLOYEES = [
  { id: 1, name: "Amara Osei", role: "Senior Engineer", dept: "Engineering", salary: 120000, status: "active", joined: "2021-03-15", performance: 92, avatar: "AO", mood: "😊", leaves: 8, skills: ["React", "Node", "AWS"], risk: "low" },
  { id: 2, name: "Lena Kovač", role: "Product Designer", dept: "Design", salary: 98000, status: "active", joined: "2022-01-10", performance: 88, avatar: "LK", mood: "😐", leaves: 5, skills: ["Figma", "UX", "Prototyping"], risk: "medium" },
  { id: 3, name: "Marcus Yuen", role: "Data Analyst", dept: "Analytics", salary: 87000, status: "remote", joined: "2020-07-22", performance: 79, avatar: "MY", mood: "😊", leaves: 12, skills: ["Python", "SQL", "Tableau"], risk: "low" },
  { id: 4, name: "Sofia Reyes", role: "HR Manager", dept: "HR", salary: 95000, status: "active", joined: "2019-11-01", performance: 95, avatar: "SR", mood: "🤩", leaves: 3, skills: ["Recruiting", "Policy", "Compliance"], risk: "low" },
  { id: 5, name: "Kiran Patel", role: "DevOps Lead", dept: "Engineering", salary: 130000, status: "active", joined: "2021-06-30", performance: 91, avatar: "KP", mood: "😊", leaves: 6, skills: ["K8s", "CI/CD", "Terraform"], risk: "low" },
  { id: 6, name: "Zara Ahmed", role: "Marketing Lead", dept: "Marketing", salary: 90000, status: "leave", joined: "2022-09-14", performance: 73, avatar: "ZA", mood: "😔", leaves: 18, skills: ["SEO", "Content", "Analytics"], risk: "high" },
  { id: 7, name: "Theo Bernard", role: "Backend Engineer", dept: "Engineering", salary: 105000, status: "active", joined: "2023-02-01", performance: 85, avatar: "TB", mood: "😊", leaves: 4, skills: ["Go", "PostgreSQL", "Redis"], risk: "low" },
  { id: 8, name: "Nadia Russo", role: "Finance Analyst", dept: "Finance", salary: 92000, status: "active", joined: "2020-04-18", performance: 88, avatar: "NR", mood: "😐", leaves: 7, skills: ["Excel", "SAP", "FP&A"], risk: "medium" },
];

const JOBS = [
  { id: 1, title: "Senior React Developer", dept: "Engineering", status: "active", applicants: 34, stage: "Interview", posted: "2025-02-01", priority: "high" },
  { id: 2, title: "UX Researcher", dept: "Design", status: "active", applicants: 18, stage: "Screening", posted: "2025-02-10", priority: "medium" },
  { id: 3, title: "Data Scientist", dept: "Analytics", status: "active", applicants: 52, stage: "Assessment", posted: "2025-01-28", priority: "high" },
  { id: 4, title: "Content Strategist", dept: "Marketing", status: "closed", applicants: 29, stage: "Closed", posted: "2025-01-15", priority: "low" },
];

const TICKETS = [
  { id: "TK-001", title: "Update direct deposit info", employee: "Marcus Yuen", type: "Payroll", status: "open", priority: "high", created: "2h ago" },
  { id: "TK-002", title: "Work-from-home equipment request", employee: "Lena Kovač", type: "IT", status: "in-progress", priority: "medium", created: "1d ago" },
  { id: "TK-003", title: "PTO balance discrepancy", employee: "Zara Ahmed", type: "Leave", status: "resolved", priority: "low", created: "3d ago" },
  { id: "TK-004", title: "Performance review reschedule", employee: "Kiran Patel", type: "Performance", status: "open", priority: "medium", created: "5h ago" },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "Q1 Performance Reviews Begin March 1", type: "performance", urgent: true },
  { id: 2, title: "New Remote Work Policy Effective Feb 28", type: "policy", urgent: false },
  { id: 3, title: "Company Offsite: April 12-14 — Register Now", type: "event", urgent: false },
];

// ── Reusable Components ──────────────────────────────────────

const Badge = ({ children, color = "accent", size = "sm" }) => {
  const colorMap = {
    accent: { bg: COLORS.accentDim, text: COLORS.accent, border: COLORS.accent + "44" },
    gold: { bg: COLORS.goldDim, text: COLORS.gold, border: COLORS.gold + "44" },
    red: { bg: COLORS.redDim, text: COLORS.red, border: COLORS.red + "44" },
    blue: { bg: COLORS.blueDim, text: COLORS.blue, border: COLORS.blue + "44" },
    purple: { bg: COLORS.purpleDim, text: COLORS.purple, border: COLORS.purple + "44" },
    muted: { bg: COLORS.surfaceAlt, text: COLORS.textMuted, border: COLORS.border },
  };
  const c = colorMap[color] || colorMap.accent;
  return (
    <span style={{
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: "4px", fontSize: size === "sm" ? "11px" : "12px",
      fontFamily: FONT, fontWeight: "700", letterSpacing: "0.05em",
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>{children}</span>
  );
};

const Avatar = ({ initials, size = 36, color = COLORS.accent }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: `linear-gradient(135deg, ${color}33, ${color}11)`,
    border: `2px solid ${color}44`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: FONT, fontSize: size * 0.35, fontWeight: "700", color,
    flexShrink: 0, letterSpacing: "0.05em",
  }}>{initials}</div>
);

const ProgressBar = ({ value, max = 100, color = COLORS.accent, height = 4 }) => (
  <div style={{ background: COLORS.border, borderRadius: "999px", height, overflow: "hidden", width: "100%" }}>
    <div style={{
      width: `${Math.min((value / max) * 100, 100)}%`, height: "100%",
      background: `linear-gradient(90deg, ${color}88, ${color})`,
      borderRadius: "999px", transition: "width 0.6s ease",
    }} />
  </div>
);

const MetricCard = ({ label, value, change, color = COLORS.accent, icon, locked = false }) => (
  <div style={{
    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
    borderRadius: "12px", padding: "20px", position: "relative",
    overflow: "hidden", flex: 1, minWidth: 0,
    transition: "border-color 0.2s",
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = color + "66"}
    onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
  >
    <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px",
      background: `radial-gradient(circle at top right, ${color}15, transparent)`,
    }} />
    {locked && (
      <div style={{
        position: "absolute", inset: 0, backdropFilter: "blur(4px)",
        background: "rgba(10,12,16,0.7)", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        borderRadius: "12px", gap: "6px",
      }}>
        <span style={{ fontSize: "20px" }}>🔒</span>
        <span style={{ color: COLORS.gold, fontFamily: FONT, fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em" }}>PRO FEATURE</span>
      </div>
    )}
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
      <span style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: "18px" }}>{icon}</span>
    </div>
    <div style={{ fontFamily: FONT_DISPLAY, fontSize: "32px", fontWeight: "900", color, lineHeight: 1, marginBottom: "8px" }}>{value}</div>
    {change && <div style={{ fontFamily: FONT, fontSize: "12px", color: change.startsWith("+") ? COLORS.accent : COLORS.red }}>{change} vs last month</div>}
  </div>
);

const ProBanner = ({ feature }) => (
  <div style={{
    background: `linear-gradient(135deg, ${COLORS.goldDim}, ${COLORS.gold}11)`,
    border: `1px solid ${COLORS.gold}44`, borderRadius: "10px",
    padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px",
    margin: "16px 0",
  }}>
    <span style={{ fontSize: "22px" }}>⭐</span>
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, color: COLORS.gold, fontWeight: "700", fontSize: "14px" }}>Unlock {feature}</div>
      <div style={{ fontFamily: FONT, color: COLORS.textMuted, fontSize: "12px", marginTop: "2px" }}>Available in Nexus HR Pro — upgrade to access AI-powered insights, unlimited workflows, and more.</div>
    </div>
    <button style={{
      marginLeft: "auto", background: COLORS.gold, color: "#000",
      border: "none", borderRadius: "6px", padding: "8px 16px",
      fontFamily: FONT, fontWeight: "700", fontSize: "12px", cursor: "pointer",
      letterSpacing: "0.05em", flexShrink: 0,
    }}>Upgrade →</button>
  </div>
);

// ── Sidebar ──────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", icon: "◉", label: "Dashboard", free: true },
  { id: "employees", icon: "◈", label: "Employees", free: true },
  { id: "recruitment", icon: "◎", label: "Recruitment", free: true },
  { id: "payroll", icon: "◆", label: "Payroll", free: false },
  { id: "performance", icon: "◇", label: "Performance", free: false },
  { id: "attendance", icon: "◐", label: "Attendance", free: true },
  { id: "tickets", icon: "◑", label: "Helpdesk", free: true },
  { id: "analytics", icon: "◒", label: "AI Analytics", free: false },
  { id: "settings", icon: "◓", label: "Settings", free: true },
];

const Sidebar = ({ active, setActive, isPro }) => (
  <div style={{
    width: "220px", background: COLORS.surface,
    borderRight: `1px solid ${COLORS.border}`,
    display: "flex", flexDirection: "column", height: "100vh",
    position: "sticky", top: 0, flexShrink: 0,
  }}>
    {/* Logo */}
    <div style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "32px", height: "32px", background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.blue})`,
          borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT, fontWeight: "900", color: "#000", fontSize: "14px",
        }}>N</div>
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: "900", fontSize: "16px", color: COLORS.text, letterSpacing: "-0.02em" }}>NEXUS HR</div>
          <div style={{ fontFamily: FONT, fontSize: "9px", color: COLORS.textMuted, letterSpacing: "0.1em" }}>OPEN SOURCE</div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
      {NAV_ITEMS.map(item => {
        const locked = !item.free && !isPro;
        const isActive = active === item.id;
        return (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 10px", borderRadius: "8px", border: "none",
            background: isActive ? COLORS.accentDim : "transparent",
            color: isActive ? COLORS.accent : locked ? COLORS.textDim : COLORS.textMuted,
            fontFamily: FONT, fontSize: "12px", fontWeight: isActive ? "700" : "400",
            cursor: "pointer", textAlign: "left", marginBottom: "2px",
            transition: "all 0.15s", letterSpacing: "0.03em",
            borderLeft: isActive ? `2px solid ${COLORS.accent}` : "2px solid transparent",
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = COLORS.surfaceAlt; e.currentTarget.style.color = locked ? COLORS.textDim : COLORS.text; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isActive ? COLORS.accent : locked ? COLORS.textDim : COLORS.textMuted; }}
          >
            <span style={{ fontSize: "14px", width: "16px", textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {locked && <span style={{ fontSize: "10px", color: COLORS.gold }}>PRO</span>}
          </button>
        );
      })}
    </nav>

    {/* Upgrade CTA */}
    {!isPro && (
      <div style={{ padding: "12px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.gold}22, ${COLORS.gold}11)`,
          border: `1px solid ${COLORS.gold}33`,
          borderRadius: "10px", padding: "14px 12px",
        }}>
          <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.gold, fontWeight: "700", letterSpacing: "0.1em", marginBottom: "4px" }}>⭐ NEXUS PRO</div>
          <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "10px" }}>AI features, payroll engine & unlimited workflows</div>
          <button style={{
            width: "100%", background: COLORS.gold, color: "#000",
            border: "none", borderRadius: "6px", padding: "7px",
            fontFamily: FONT, fontWeight: "700", fontSize: "11px",
            cursor: "pointer", letterSpacing: "0.05em",
          }}>Upgrade →</button>
        </div>
      </div>
    )}

    {/* User */}
    <div style={{ padding: "12px 14px", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "10px" }}>
      <Avatar initials="SR" size={32} color={COLORS.purple} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.text, fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Sofia Reyes</div>
        <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted }}>HR Admin</div>
      </div>
    </div>
  </div>
);

// ── Dashboard ────────────────────────────────────────────────

const Dashboard = ({ isPro }) => {
  const highRisk = EMPLOYEES.filter(e => e.risk === "high").length;
  const onLeave = EMPLOYEES.filter(e => e.status === "leave").length;
  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: "26px", fontWeight: "900", color: COLORS.text, letterSpacing: "-0.02em" }}>Good morning, Sofia 👋</div>
        <div style={{ fontFamily: FONT, fontSize: "13px", color: COLORS.textMuted, marginTop: "4px" }}>Thursday, Feb 26 · 8 active job openings · {highRisk} retention risks flagged</div>
      </div>

      {/* Announcements */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "24px" }}>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{
            background: COLORS.surface, border: `1px solid ${a.urgent ? COLORS.red + "44" : COLORS.border}`,
            borderRadius: "8px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px",
          }}>
            <span style={{ fontSize: "14px" }}>{a.type === "performance" ? "📊" : a.type === "policy" ? "📋" : "🎉"}</span>
            <span style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.text, flex: 1 }}>{a.title}</span>
            {a.urgent && <Badge color="red">Urgent</Badge>}
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <MetricCard label="Total Employees" value="124" change="+3" icon="👥" color={COLORS.accent} />
        <MetricCard label="Open Positions" value="8" change="+2" icon="📋" color={COLORS.blue} />
        <MetricCard label="Avg Performance" value="87%" change="+4%" icon="📈" color={COLORS.purple} />
        <MetricCard label="Attrition Risk Score" value="12%" icon="⚠️" color={COLORS.red} locked={!isPro} />
      </div>

      {/* Two-col layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Recent Activity */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>Recent Activity</div>
          {[
            { icon: "✅", text: "Kiran Patel completed onboarding checklist", time: "2h ago", color: COLORS.accent },
            { icon: "📨", text: "New application: Senior React Developer", time: "3h ago", color: COLORS.blue },
            { icon: "🏖", text: "Zara Ahmed leave approved (Feb 25–Mar 4)", time: "5h ago", color: COLORS.gold },
            { icon: "⚠️", text: "Payroll anomaly detected for 2 employees", time: "1d ago", color: COLORS.red },
            { icon: "📝", text: "Q4 performance reviews finalized", time: "2d ago", color: COLORS.purple },
          ].map((act, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{act.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.text }}>{act.text}</div>
                <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, marginTop: "2px" }}>{act.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Mood Pulse — PRO */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text, marginBottom: "4px" }}>Team Mood Pulse</div>
          <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "16px" }}>AI-inferred from interactions & check-ins</div>
          {EMPLOYEES.slice(0, 5).map(emp => (
            <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Avatar initials={emp.avatar} size={28} color={COLORS.purple} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.text }}>{emp.name}</div>
                <ProgressBar value={emp.performance} color={emp.performance > 85 ? COLORS.accent : emp.performance > 70 ? COLORS.gold : COLORS.red} height={3} />
              </div>
              <span style={{ fontSize: "16px" }}>{emp.mood}</span>
            </div>
          ))}
          {!isPro && (
            <div style={{
              position: "absolute", inset: 0, backdropFilter: "blur(3px)",
              background: "rgba(10,12,16,0.75)", zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "8px", borderRadius: "12px",
            }}>
              <span style={{ fontSize: "28px" }}>🧠</span>
              <div style={{ fontFamily: FONT_DISPLAY, color: COLORS.gold, fontWeight: "700", fontSize: "14px" }}>AI Mood Pulse</div>
              <div style={{ fontFamily: FONT, color: COLORS.textMuted, fontSize: "11px", textAlign: "center", maxWidth: "200px" }}>Detect burnout risk & disengagement before it becomes attrition</div>
              <button style={{ background: COLORS.gold, color: "#000", border: "none", borderRadius: "6px", padding: "8px 18px", fontFamily: FONT, fontWeight: "700", fontSize: "11px", cursor: "pointer", marginTop: "4px" }}>Unlock Pro →</button>
            </div>
          )}
        </div>

        {/* Dept Breakdown */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>Department Headcount</div>
          {[
            { name: "Engineering", count: 38, color: COLORS.accent },
            { name: "Design", count: 12, color: COLORS.blue },
            { name: "Analytics", count: 9, color: COLORS.purple },
            { name: "Marketing", count: 18, color: COLORS.gold },
            { name: "Finance", count: 14, color: COLORS.red },
            { name: "HR", count: 7, color: COLORS.textMuted },
          ].map(d => (
            <div key={d.name} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted }}>{d.name}</span>
                <span style={{ fontFamily: FONT, fontSize: "12px", color: d.color, fontWeight: "700" }}>{d.count}</span>
              </div>
              <ProgressBar value={d.count} max={40} color={d.color} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text, marginBottom: "16px" }}>Quick Actions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { label: "Add Employee", icon: "➕", color: COLORS.accent },
              { label: "Post Job", icon: "📢", color: COLORS.blue },
              { label: "Run Payroll", icon: "💰", color: COLORS.gold, pro: true },
              { label: "Generate Report", icon: "📊", color: COLORS.purple, pro: true },
              { label: "Approve Leave", icon: "✅", color: COLORS.accent },
              { label: "Send Announcement", icon: "📣", color: COLORS.red },
            ].map((a, i) => (
              <button key={i} style={{
                background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
                borderRadius: "8px", padding: "12px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
                color: a.pro && !isPro ? COLORS.textDim : COLORS.text,
                fontFamily: FONT, fontSize: "12px", textAlign: "left",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = a.color + "66"}
                onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
              >
                <span style={{ fontSize: "16px" }}>{a.icon}</span>
                <span>{a.label}</span>
                {a.pro && !isPro && <span style={{ marginLeft: "auto", fontSize: "9px", color: COLORS.gold }}>PRO</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Employees ────────────────────────────────────────────────

const Employees = ({ isPro }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.dept.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const emp = selected ? EMPLOYEES.find(e => e.id === selected) : null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 340px" : "1fr", gap: "16px" }}>
      <div>
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text, flex: 1 }}>People Directory</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees..." style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: "8px", padding: "8px 14px", color: COLORS.text,
            fontFamily: FONT, fontSize: "12px", outline: "none", width: "200px",
          }} />
          <button style={{
            background: COLORS.accent, color: "#000", border: "none",
            borderRadius: "8px", padding: "8px 16px", fontFamily: FONT,
            fontWeight: "700", fontSize: "12px", cursor: "pointer",
          }}>+ Add Employee</button>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {["all", "engineering", "design", "analytics", "marketing", "finance", "hr"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? COLORS.accentDim : COLORS.surface,
              border: `1px solid ${filter === f ? COLORS.accent + "44" : COLORS.border}`,
              color: filter === f ? COLORS.accent : COLORS.textMuted,
              borderRadius: "6px", padding: "5px 12px", cursor: "pointer",
              fontFamily: FONT, fontSize: "11px", fontWeight: "700",
              letterSpacing: "0.05em", textTransform: "capitalize",
            }}>{f === "all" ? "All Depts" : f}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(emp => (
            <div key={emp.id} onClick={() => setSelected(selected === emp.id ? null : emp.id)} style={{
              background: selected === emp.id ? COLORS.accentDim : COLORS.surface,
              border: `1px solid ${selected === emp.id ? COLORS.accent + "44" : COLORS.border}`,
              borderRadius: "10px", padding: "14px 16px",
              display: "flex", alignItems: "center", gap: "14px",
              cursor: "pointer", transition: "all 0.15s",
            }}
              onMouseEnter={e => { if (selected !== emp.id) e.currentTarget.style.borderColor = COLORS.accent + "33"; }}
              onMouseLeave={e => { if (selected !== emp.id) e.currentTarget.style.borderColor = COLORS.border; }}
            >
              <Avatar initials={emp.avatar} size={40} color={
                emp.risk === "high" ? COLORS.red : emp.risk === "medium" ? COLORS.gold : COLORS.accent
              } />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text }}>{emp.name}</span>
                  <span style={{ fontSize: "12px" }}>{emp.mood}</span>
                  {emp.risk === "high" && <Badge color="red">At Risk</Badge>}
                  {emp.risk === "medium" && <Badge color="gold">Watch</Badge>}
                </div>
                <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>{emp.role} · {emp.dept}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "2px" }}>Performance</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: "900",
                  color: emp.performance > 85 ? COLORS.accent : emp.performance > 70 ? COLORS.gold : COLORS.red,
                }}>{emp.performance}%</div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Badge color={emp.status === "active" ? "accent" : emp.status === "remote" ? "blue" : emp.status === "leave" ? "gold" : "muted"}>
                  {emp.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Detail Panel */}
      {emp && (
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px", height: "fit-content", position: "sticky", top: "20px" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: COLORS.textMuted, fontFamily: FONT, fontSize: "12px", cursor: "pointer", marginBottom: "16px", padding: 0 }}>← Close</button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: "20px" }}>
            <Avatar initials={emp.avatar} size={64} color={emp.risk === "high" ? COLORS.red : COLORS.accent} />
            <div style={{ marginTop: "10px" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: "18px", fontWeight: "900", color: COLORS.text }}>{emp.name}</div>
              <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted }}>{emp.role} · {emp.dept}</div>
            </div>
          </div>

          {[
            { label: "Joined", value: emp.joined },
            { label: "Status", value: emp.status },
            { label: "Leaves Taken", value: `${emp.leaves} days` },
            { label: "Salary", value: isPro ? `$${emp.salary.toLocaleString()}` : "****" },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>{row.label}</span>
              <span style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.text, fontWeight: "700" }}>{row.value}</span>
            </div>
          ))}

          <div style={{ marginTop: "14px" }}>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "8px" }}>SKILLS</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {emp.skills.map(s => <Badge key={s} color="muted">{s}</Badge>)}
            </div>
          </div>

          <div style={{ marginTop: "16px" }}>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "6px" }}>PERFORMANCE SCORE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900",
              color: emp.performance > 85 ? COLORS.accent : emp.performance > 70 ? COLORS.gold : COLORS.red,
              marginBottom: "6px"
            }}>{emp.performance}%</div>
            <ProgressBar value={emp.performance} color={emp.performance > 85 ? COLORS.accent : emp.performance > 70 ? COLORS.gold : COLORS.red} height={6} />
          </div>

          {emp.risk === "high" && (
            <div style={{ marginTop: "14px", background: COLORS.redDim, border: `1px solid ${COLORS.red}33`, borderRadius: "8px", padding: "12px" }}>
              <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "700", color: COLORS.red, marginBottom: "4px" }}>⚠ Attrition Risk: HIGH</div>
              <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>High leave usage + performance dip detected. Consider 1:1 check-in.</div>
            </div>
          )}

          {!isPro && (
            <ProBanner feature="Full Salary Data & AI Risk Analysis" />
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <button style={{ flex: 1, background: COLORS.accentDim, border: `1px solid ${COLORS.accent}33`, color: COLORS.accent, borderRadius: "6px", padding: "8px", fontFamily: FONT, fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Edit</button>
            <button style={{ flex: 1, background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, borderRadius: "6px", padding: "8px", fontFamily: FONT, fontSize: "11px", cursor: "pointer" }}>Message</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Recruitment ──────────────────────────────────────────────

const Recruitment = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text }}>Recruitment Pipeline</div>
      <button style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: "8px", padding: "9px 18px", fontFamily: FONT, fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>+ Post New Job</button>
    </div>

    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      {[
        { label: "Active Jobs", value: JOBS.filter(j => j.status === "active").length, color: COLORS.accent },
        { label: "Total Applicants", value: JOBS.reduce((a, j) => a + j.applicants, 0), color: COLORS.blue },
        { label: "Avg Time-to-Hire", value: "18d", color: COLORS.purple },
        { label: "Offer Accept Rate", value: "76%", color: COLORS.gold },
      ].map(m => (
        <div key={m.label} style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{m.label}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900", color: m.color }}>{m.value}</div>
        </div>
      ))}
    </div>

    {/* Kanban-style board */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
      {["Screening", "Interview", "Assessment", "Offer"].map(stage => {
        const stageJobs = JOBS.filter(j => j.stage === stage);
        return (
          <div key={stage} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontFamily: FONT, fontSize: "11px", fontWeight: "700", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{stage}</div>
              <Badge color="muted">{stageJobs.length}</Badge>
            </div>
            {stageJobs.map(job => (
              <div key={job.id} style={{
                background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
                borderRadius: "8px", padding: "12px", marginBottom: "8px",
              }}>
                <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "700", color: COLORS.text, marginBottom: "6px" }}>{job.title}</div>
                <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "8px" }}>{job.dept}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.blue }}>👤 {job.applicants}</span>
                  <Badge color={job.priority === "high" ? "red" : job.priority === "medium" ? "gold" : "muted"}>{job.priority}</Badge>
                </div>
              </div>
            ))}
            {stageJobs.length === 0 && (
              <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textDim, textAlign: "center", padding: "20px 0" }}>No positions</div>
            )}
          </div>
        );
      })}
    </div>

    <div style={{ marginTop: "20px", background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", padding: "20px" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text, marginBottom: "14px" }}>All Job Postings</div>
      {JOBS.map(job => (
        <div key={job.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "700", color: COLORS.text }}>{job.title}</div>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>Posted {job.posted}</div>
          </div>
          <Badge color="muted">{job.dept}</Badge>
          <span style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.blue }}>👤 {job.applicants} applicants</span>
          <Badge color={job.status === "active" ? "accent" : "muted"}>{job.status}</Badge>
          <button style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, borderRadius: "6px", padding: "6px 12px", fontFamily: FONT, fontSize: "11px", cursor: "pointer" }}>View</button>
        </div>
      ))}
    </div>
  </div>
);

// ── Helpdesk ─────────────────────────────────────────────────

const Helpdesk = () => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text }}>Employee Helpdesk</div>
      <button style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: "8px", padding: "9px 18px", fontFamily: FONT, fontWeight: "700", fontSize: "12px", cursor: "pointer" }}>+ New Ticket</button>
    </div>

    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      {[
        { label: "Open", value: TICKETS.filter(t => t.status === "open").length, color: COLORS.red },
        { label: "In Progress", value: TICKETS.filter(t => t.status === "in-progress").length, color: COLORS.gold },
        { label: "Resolved", value: TICKETS.filter(t => t.status === "resolved").length, color: COLORS.accent },
        { label: "Avg Resolution", value: "1.4d", color: COLORS.blue },
      ].map(m => (
        <div key={m.label} style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{m.label}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900", color: m.color }}>{m.value}</div>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {TICKETS.map(t => (
        <div key={t.id} style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: "10px", padding: "16px",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, fontWeight: "700", flexShrink: 0 }}>{t.id}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "700", color: COLORS.text, marginBottom: "2px" }}>{t.title}</div>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>{t.employee} · {t.created}</div>
          </div>
          <Badge color="muted">{t.type}</Badge>
          <Badge color={t.priority === "high" ? "red" : t.priority === "medium" ? "gold" : "muted"}>{t.priority}</Badge>
          <Badge color={t.status === "resolved" ? "accent" : t.status === "in-progress" ? "blue" : "red"}>{t.status}</Badge>
          <button style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: "6px", padding: "7px 12px", fontFamily: FONT, fontSize: "11px", cursor: "pointer" }}>Open</button>
        </div>
      ))}
    </div>
  </div>
);

// ── Payroll (PRO) ────────────────────────────────────────────

const Payroll = ({ isPro }) => {
  if (!isPro) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", textAlign: "center" }}>
      <span style={{ fontSize: "48px", marginBottom: "16px" }}>💰</span>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900", color: COLORS.gold, marginBottom: "8px" }}>Payroll Engine</div>
      <div style={{ fontFamily: FONT, fontSize: "14px", color: COLORS.textMuted, maxWidth: "380px", marginBottom: "24px" }}>
        Automated payroll runs, tax calculations, pay slips, compliance reports, and anomaly detection — all in one place.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", maxWidth: "500px", marginBottom: "28px" }}>
        {["🤖 Auto payroll runs", "🧾 Pay slip generation", "📊 Tax calculations", "⚠️ Anomaly detection", "🌍 Multi-currency", "📋 Compliance reports"].map(f => (
          <div key={f} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "12px", fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted }}>{f}</div>
        ))}
      </div>
      <button style={{ background: COLORS.gold, color: "#000", border: "none", borderRadius: "10px", padding: "14px 32px", fontFamily: FONT_DISPLAY, fontWeight: "900", fontSize: "16px", cursor: "pointer" }}>Upgrade to Pro →</button>
    </div>
  );

  return (
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text, marginBottom: "24px" }}>Payroll Engine ⭐</div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        {[
          { label: "Next Payroll", value: "Mar 1", color: COLORS.accent },
          { label: "Monthly Payroll", value: "$1.24M", color: COLORS.gold },
          { label: "Pending Approvals", value: "3", color: COLORS.red },
          { label: "Anomalies Flagged", value: "2", color: COLORS.red },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "16px" }}>
            <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{m.label}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900", color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text }}>Employee Compensation</div>
        {EMPLOYEES.map(emp => (
          <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
            <Avatar initials={emp.avatar} size={32} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "700", color: COLORS.text }}>{emp.name}</div>
              <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>{emp.role}</div>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: "900", color: COLORS.gold }}>${emp.salary.toLocaleString()}/yr</div>
            <Badge color="accent">Active</Badge>
            <button style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, borderRadius: "6px", padding: "6px 12px", fontFamily: FONT, fontSize: "11px", cursor: "pointer" }}>Pay Slip</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Analytics (PRO) ──────────────────────────────────────────

const Analytics = ({ isPro }) => {
  if (!isPro) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "400px", textAlign: "center" }}>
      <span style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</span>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900", color: COLORS.purple, marginBottom: "8px" }}>AI-Powered Analytics</div>
      <div style={{ fontFamily: FONT, fontSize: "14px", color: COLORS.textMuted, maxWidth: "380px", marginBottom: "24px" }}>
        Predict attrition, surface burnout signals, optimize headcount, and benchmark your culture — powered by LLMs and your own data.
      </div>
      <button style={{ background: COLORS.purple, color: "#fff", border: "none", borderRadius: "10px", padding: "14px 32px", fontFamily: FONT_DISPLAY, fontWeight: "900", fontSize: "16px", cursor: "pointer" }}>Unlock AI Analytics →</button>
    </div>
  );

  return (
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text, marginBottom: "8px" }}>AI Analytics ⭐</div>
      <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, marginBottom: "24px" }}>Powered by Nexus AI — analyzing patterns across your workforce data</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { title: "🔮 Attrition Forecast", desc: "3 employees show >70% 90-day flight risk based on engagement signals, performance trajectory, and leave patterns.", insight: "Zara Ahmed, Lena Kovač, and 1 other flagged", color: COLORS.red },
          { title: "🔥 Burnout Heatmap", desc: "Engineering team showing overtime patterns for 3rd consecutive week. Recommend mandatory 3-day sprint pause.", insight: "9 engineers averaging 52+ hrs/week", color: COLORS.gold },
          { title: "💡 Hiring Optimization", desc: "AI suggests posting 2 additional senior engineers before Q2 based on roadmap complexity and velocity trends.", insight: "Predicted productivity gap in 6 weeks", color: COLORS.blue },
          { title: "📈 Culture Score", desc: "Company culture score at 78/100, up +4 from last quarter. Main driver: improved manager responsiveness.", insight: "↑ Trust, Communication, Autonomy scores", color: COLORS.accent },
        ].map(card => (
          <div key={card.title} style={{ background: COLORS.surface, border: `1px solid ${card.color}33`, borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: "15px", fontWeight: "700", color: card.color, marginBottom: "10px" }}>{card.title}</div>
            <div style={{ fontFamily: FONT, fontSize: "12px", color: COLORS.textMuted, marginBottom: "10px", lineHeight: "1.6" }}>{card.desc}</div>
            <div style={{ background: card.color + "11", border: `1px solid ${card.color}22`, borderRadius: "6px", padding: "8px 12px", fontFamily: FONT, fontSize: "11px", color: card.color, fontWeight: "700" }}>{card.insight}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Attendance ───────────────────────────────────────────────

const Attendance = () => (
  <div>
    <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text, marginBottom: "24px" }}>Attendance & Leave</div>
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
      {[
        { label: "Present Today", value: "108", color: COLORS.accent },
        { label: "On Leave", value: "7", color: COLORS.gold },
        { label: "Remote", value: "9", color: COLORS.blue },
        { label: "Pending Requests", value: "4", color: COLORS.red },
      ].map(m => (
        <div key={m.label} style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "16px" }}>
          <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>{m.label}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: "28px", fontWeight: "900", color: m.color }}>{m.value}</div>
        </div>
      ))}
    </div>

    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "12px", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: "14px", fontWeight: "700", color: COLORS.text }}>Leave Balances & Requests</span>
        <button style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}33`, color: COLORS.accent, borderRadius: "6px", padding: "6px 14px", fontFamily: FONT, fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>Approve All Pending</button>
      </div>
      {EMPLOYEES.map(emp => (
        <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <Avatar initials={emp.avatar} size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "700", color: COLORS.text }}>{emp.name}</div>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>{emp.dept}</div>
          </div>
          <div style={{ width: "120px" }}>
            <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, marginBottom: "4px" }}>Days Used</div>
            <ProgressBar value={emp.leaves} max={25} color={emp.leaves > 15 ? COLORS.red : emp.leaves > 10 ? COLORS.gold : COLORS.accent} />
            <div style={{ fontFamily: FONT, fontSize: "10px", color: COLORS.textMuted, marginTop: "2px" }}>{emp.leaves}/25 days</div>
          </div>
          <Badge color={emp.status === "leave" ? "gold" : emp.status === "remote" ? "blue" : "accent"}>{emp.status}</Badge>
        </div>
      ))}
    </div>
  </div>
);

// ── Settings ─────────────────────────────────────────────────

const Settings = () => (
  <div>
    <div style={{ fontFamily: FONT_DISPLAY, fontSize: "22px", fontWeight: "900", color: COLORS.text, marginBottom: "24px" }}>Settings & Configuration</div>
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "20px" }}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "12px", height: "fit-content" }}>
        {["General", "Company", "Integrations", "Permissions", "Notifications", "Billing", "Open Source"].map((s, i) => (
          <button key={s} style={{
            width: "100%", textAlign: "left", background: i === 0 ? COLORS.accentDim : "none",
            border: "none", borderRadius: "6px", padding: "8px 10px",
            color: i === 0 ? COLORS.accent : COLORS.textMuted, fontFamily: FONT,
            fontSize: "12px", cursor: "pointer", marginBottom: "2px",
          }}>{s}</button>
        ))}
      </div>

      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "24px" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: "16px", fontWeight: "700", color: COLORS.text, marginBottom: "20px" }}>General Settings</div>
        {[
          { label: "Company Name", value: "Acme Corporation" },
          { label: "Fiscal Year Start", value: "January 1" },
          { label: "Default Timezone", value: "UTC-5 (EST)" },
          { label: "Currency", value: "USD ($)" },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: "16px" }}>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, marginBottom: "6px", letterSpacing: "0.05em" }}>{f.label}</div>
            <input defaultValue={f.value} style={{
              background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
              borderRadius: "6px", padding: "9px 14px", color: COLORS.text,
              fontFamily: FONT, fontSize: "12px", outline: "none", width: "100%",
            }} />
          </div>
        ))}
        <div style={{ marginTop: "8px", background: COLORS.accentDim, border: `1px solid ${COLORS.accent}33`, borderRadius: "8px", padding: "12px 16px" }}>
          <div style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "700", color: COLORS.accent, marginBottom: "4px" }}>🔓 Open Source</div>
          <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>Nexus HR is MIT-licensed. Contribute, fork, or self-host at github.com/nexus-hr</div>
        </div>
      </div>
    </div>
  </div>
);

// ── Main App ─────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [isPro, setIsPro] = useState(false);

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <Dashboard isPro={isPro} />;
      case "employees": return <Employees isPro={isPro} />;
      case "recruitment": return <Recruitment />;
      case "payroll": return <Payroll isPro={isPro} />;
      case "analytics": return <Analytics isPro={isPro} />;
      case "attendance": return <Attendance />;
      case "tickets": return <Helpdesk />;
      case "settings": return <Settings />;
      default: return <Dashboard isPro={isPro} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: FONT }}>
        <Sidebar active={active} setActive={setActive} isPro={isPro} />
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          {/* Top Bar */}
          <div style={{
            height: "52px", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
            display: "flex", alignItems: "center", paddingLeft: "24px", paddingRight: "20px",
            gap: "12px", position: "sticky", top: 0, zIndex: 100,
          }}>
            <div style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted, flex: 1, letterSpacing: "0.05em" }}>
              {NAV_ITEMS.find(n => n.id === active)?.label.toUpperCase()}
            </div>

            {/* PRO TOGGLE - demo only */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontFamily: FONT, fontSize: "11px", color: COLORS.textMuted }}>Demo Pro Mode:</span>
              <button onClick={() => setIsPro(!isPro)} style={{
                background: isPro ? COLORS.gold : COLORS.surfaceAlt,
                border: `1px solid ${isPro ? COLORS.gold + "66" : COLORS.border}`,
                color: isPro ? "#000" : COLORS.textMuted,
                borderRadius: "20px", padding: "4px 12px",
                fontFamily: FONT, fontSize: "11px", fontWeight: "700",
                cursor: "pointer", transition: "all 0.2s",
              }}>{isPro ? "⭐ PRO ON" : "FREE"}</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative" }}>
                <button style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, borderRadius: "6px", padding: "6px 10px", fontFamily: FONT, fontSize: "12px", cursor: "pointer" }}>🔔</button>
                <div style={{ position: "absolute", top: "-3px", right: "-3px", width: "8px", height: "8px", background: COLORS.red, borderRadius: "50%", border: `2px solid ${COLORS.surface}` }} />
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 28px" }}>
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
