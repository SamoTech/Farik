import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ppjgyyjxrjugcjnysfbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwamd5eWp4cmp1Z2NqbnlzZmJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MDc2NzIsImV4cCI6MjA4Njk4MzY3Mn0.kQ8mXjgWOPtJD1IvukXEolTcUmK2y1vSvvE7RRc0WJ4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth Helpers ──────────────────────────────────────────────

export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// ── Employees ─────────────────────────────────────────────────

export const getEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const addEmployee = async (employee) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single();
  return { data, error };
};

export const updateEmployee = async (id, updates) => {
  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteEmployee = async (id) => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  return { error };
};

// ── Jobs ──────────────────────────────────────────────────────

export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const addJob = async (job) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select()
    .single();
  return { data, error };
};

export const updateJob = async (id, updates) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// ── Tickets ───────────────────────────────────────────────────

export const getTickets = async () => {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const addTicket = async (ticket) => {
  const { data, error } = await supabase
    .from('tickets')
    .insert([ticket])
    .select()
    .single();
  return { data, error };
};

export const updateTicket = async (id, updates) => {
  const { data, error } = await supabase
    .from('tickets')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

// ── Announcements ─────────────────────────────────────────────

export const getAnnouncements = async () => {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

// ── Payroll ───────────────────────────────────────────────────

export const getPayroll = async () => {
  const { data, error } = await supabase
    .from('payroll')
    .select('*, employees(name, role, department)')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const runPayroll = async (employeeId, month, baseSalary, bonus = 0, deductions = 0) => {
  const net = baseSalary + bonus - deductions;
  const { data, error } = await supabase
    .from('payroll')
    .insert([{
      employee_id: employeeId,
      month,
      base_salary: baseSalary,
      bonus,
      deductions,
      net_salary: net,
      status: 'paid',
      paid_at: new Date().toISOString(),
    }])
    .select()
    .single();
  return { data, error };
};

// ── Analytics ─────────────────────────────────────────────────

export const getAnalytics = async () => {
  const [empRes, jobRes, ticketRes, payrollRes] = await Promise.all([
    supabase.from('employees').select('id, department, performance, risk_level, status, salary'),
    supabase.from('jobs').select('id, status, applicants, department'),
    supabase.from('tickets').select('id, status, type'),
    supabase.from('payroll').select('net_salary, month, status'),
  ]);

  const employees  = empRes.data || [];
  const jobs       = jobRes.data || [];
  const tickets    = ticketRes.data || [];
  const payroll    = payrollRes.data || [];

  const totalPayroll = payroll.reduce((s, p) => s + (p.net_salary || 0), 0);
  const avgPerf      = employees.length
    ? Math.round(employees.reduce((s, e) => s + (e.performance || 0), 0) / employees.length)
    : 0;
  const atRisk       = employees.filter(e => e.risk_level === 'high').length;
  const deptMap      = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});

  return {
    totalEmployees:  employees.length,
    activeJobs:      jobs.filter(j => j.status === 'active').length,
    totalApplicants: jobs.reduce((s, j) => s + (j.applicants || 0), 0),
    openTickets:     tickets.filter(t => t.status === 'open').length,
    avgPerformance:  avgPerf,
    atRiskCount:     atRisk,
    totalPayroll,
    deptBreakdown:   deptMap,
  };
};
