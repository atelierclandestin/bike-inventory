import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, ComposedChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Package, Wrench, Calendar, ChevronRight, Clock, AlertCircle, CheckCircle, FileText, Truck, CreditCard, Users, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

// ============================================
// FY2025 AUTHORITATIVE BASELINE DATA
// Source: L'Atelier Clandestin Lightspeed exports
// ============================================

const FY2025_BASELINE = {
  netRevenue: 904462,
  totalCOGS: 575868,
  grossProfit: 239555,
  grossMarginPct: 26.5,
  laborRevenue: 69107,
  inventoryCost: 281964,
  inventoryMSRP: 369455,
  arTotal: 36333,
  apTotal: 112164,
  bookings2026: 274419,
  inventoryTurns: 2.2,
  targetTurns: 3.0,
  cashReleaseOpportunity: 74000,
};

const MONTHLY_REVENUE = [
  { month: 'Dec', pct: 2, revenue: 18089, fy: 'FY2025' },
  { month: 'Jan', pct: 2, revenue: 18089, fy: 'FY2025' },
  { month: 'Feb', pct: 6, revenue: 54268, fy: 'FY2025' },
  { month: 'Mar', pct: 8, revenue: 72357, fy: 'FY2025' },
  { month: 'Apr', pct: 11, revenue: 99491, fy: 'FY2025' },
  { month: 'May', pct: 15, revenue: 135669, fy: 'FY2025' },
  { month: 'Jun', pct: 12, revenue: 108535, fy: 'FY2025' },
  { month: 'Jul', pct: 17, revenue: 153759, fy: 'FY2025' },
  { month: 'Aug', pct: 11, revenue: 99491, fy: 'FY2025' },
  { month: 'Sep', pct: 8, revenue: 72357, fy: 'FY2025' },
  { month: 'Oct', pct: 6, revenue: 54268, fy: 'FY2025' },
  { month: 'Nov', pct: 2, revenue: 18089, fy: 'FY2025' },
];

const CATEGORY_DATA = [
  { name: 'Vélos', sales: 593480, cogs: 399224, margin: 22.7, pctTotal: 63.3 },
  { name: 'Composantes', sales: 128888, cogs: 84844, margin: 24.3, pctTotal: 13.7 },
  { name: 'Accessoires', sales: 111360, cogs: 70035, margin: 27.7, pctTotal: 11.9 },
  { name: 'Services', sales: 69107, cogs: 179, margin: 99.7, pctTotal: 7.4 },
  { name: 'Pneus', sales: 26944, cogs: 16248, margin: 30.7, pctTotal: 2.9 },
  { name: 'Porte-vélos', sales: 7152, cogs: 4698, margin: 24.5, pctTotal: 0.8 },
];

const LABOR_BREAKDOWN = [
  { service: 'Atelier', revenue: 62091, margin: 100 },
  { service: 'Montage Roues', revenue: 2242, margin: 100 },
  { service: 'Suspensions', revenue: 1586, margin: 100 },
  { service: 'RideWrap', revenue: 3187, margin: 93.6 },
];

const AP_AGING = [
  { supplier: 'LTP Sports', total: 77102, current: 7756, d31_60: 29478, d61_90: 15114, d91plus: 24754 },
  { supplier: '3T Bike', total: 11177, current: 0, d31_60: 5128, d61_90: 5976, d91plus: 74 },
  { supplier: 'MRQ Taxes', total: 8058, current: 8058, d31_60: 0, d61_90: 0, d91plus: 0 },
  { supplier: 'Orbea', total: 6508, current: 7361, d31_60: 0, d61_90: -722, d91plus: -131 },
  { supplier: 'Marin', total: 4305, current: 1165, d31_60: 3140, d61_90: 0, d91plus: 0 },
  { supplier: 'Others', total: 5014, current: 447, d31_60: 2735, d61_90: -239, d91plus: 2070 },
];

const BOOKINGS_2026 = [
  { supplier: 'Norco Booking', amount: 50743, category: 'Bikes', priority: 'MEDIUM', cancelable: true, recommendation: 'REDUCE 30%' },
  { supplier: 'BMC', amount: 35000, category: 'Bikes', priority: 'MEDIUM', cancelable: false, recommendation: 'KEEP' },
  { supplier: 'Norco Closeout', amount: 28543, category: 'Bikes', priority: 'MEDIUM', cancelable: true, recommendation: 'REDUCE 20%' },
  { supplier: 'Marin Bikes', amount: 26103, category: 'Bikes', priority: 'HIGH', cancelable: false, recommendation: 'KEEP' },
  { supplier: 'Moustache', amount: 20908, category: 'E-Bikes', priority: 'HIGH', cancelable: false, recommendation: 'KEEP' },
  { supplier: '3T', amount: 17933, category: 'Bikes', priority: 'MEDIUM', cancelable: true, recommendation: 'REDUCE 25%' },
  { supplier: 'SAVA', amount: 15133, category: 'Bikes', priority: 'LOW', cancelable: true, recommendation: 'REDUCE 50%' },
  { supplier: 'Felt', amount: 13647, category: 'Bikes', priority: 'LOW', cancelable: false, recommendation: 'KEEP' },
  { supplier: 'L2P/Wahoo', amount: 10016, category: 'P&A', priority: 'MEDIUM', cancelable: false, recommendation: 'KEEP' },
  { supplier: 'OGC/Opus', amount: 9590, category: 'Bikes', priority: 'LOW', cancelable: false, recommendation: 'KEEP' },
];

const AR_DETAIL = [
  { customer: 'Alex Beaupied', layaway: 8702, workorder: 0 },
  { customer: 'Francois Morin', layaway: 6227, workorder: 0 },
  { customer: 'Sugarloaf Park', layaway: 4371, workorder: 0 },
  { customer: 'Kloe Mason', layaway: 3104, workorder: 0 },
  { customer: 'George Peace', layaway: 2529, workorder: 0 },
  { customer: 'Others', layaway: 6905, workorder: 4494 },
];

const FIXED_EXPENSES_MONTHLY = {
  rent: 2575,
  entrepot: 400,
  hydro: 400,
  assurance: 230,
  taxes: 496,
  fraisCondo: 457,
  comptable: 700,
  publicite: 600,
  bellCell: 200,
  internet: 60,
};

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#e94560',
  success: '#00d09c',
  warning: '#ffc93c',
  danger: '#ff6b6b',
  muted: '#64748b',
  bikes: '#3b82f6',
  parts: '#8b5cf6',
  service: '#10b981',
  accessories: '#f59e0b',
};

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '$0';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value) => {
  return `${(value || 0).toFixed(1)}%`;
};

// ============================================
// COMPONENTS
// ============================================

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary', alert }) => (
  <div className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${alert ? 'border-l-red-500' : 'border-l-blue-500'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS[color]}15` }}>
        <Icon size={20} style={{ color: COLORS[color] }} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trendValue}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-500 uppercase tracking-wide">{title}</div>
    {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    {alert && (
      <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
        <AlertCircle size={12} />
        {alert}
      </div>
    )}
  </div>
);

const AlertCard = ({ severity, title, description, action }) => {
  const colors = {
    critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-500' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-500' },
  };
  const c = colors[severity] || colors.info;
  
  return (
    <div className={`${c.bg} ${c.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`${c.icon} mt-0.5 flex-shrink-0`} size={18} />
        <div className="flex-1 min-w-0">
          <div className={`font-semibold ${c.text}`}>{title}</div>
          <div className="text-sm text-gray-600 mt-1">{description}</div>
          {action && (
            <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {action} <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DataStatusBadge = ({ status, label }) => {
  const styles = {
    complete: 'bg-green-100 text-green-700',
    partial: 'bg-amber-100 text-amber-700',
    missing: 'bg-red-100 text-red-700',
  };
  const icons = {
    complete: <CheckCircle size={12} />,
    partial: <Clock size={12} />,
    missing: <AlertCircle size={12} />,
  };
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {icons[status]}
      {label}
    </span>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 bg-gray-100 rounded-lg">
      <Icon size={20} className="text-gray-600" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

// ============================================
// MAIN DASHBOARD
// ============================================

export default function FinanceOSDashboard() {
  const [activeTab, setActiveTab] = useState('cockpit');
  const [scenarioSales, setScenarioSales] = useState(0);
  const [scenarioMargin, setScenarioMargin] = useState(0);
  const [scenarioBookingCut, setScenarioBookingCut] = useState(0);

  // Scenario calculations
  const projectedRevenue = useMemo(() => {
    const baseRevenue = FY2025_BASELINE.netRevenue;
    return baseRevenue * (1 + scenarioSales / 100);
  }, [scenarioSales]);

  const projectedMargin = useMemo(() => {
    return FY2025_BASELINE.grossMarginPct + scenarioMargin;
  }, [scenarioMargin]);

  const projectedBookings = useMemo(() => {
    return FY2025_BASELINE.bookings2026 * (1 - scenarioBookingCut / 100);
  }, [scenarioBookingCut]);

  const apAgingTotal = AP_AGING.reduce((sum, row) => sum + row.total, 0);
  const apOverdue = AP_AGING.reduce((sum, row) => sum + row.d61_90 + row.d91plus, 0);

  const tabs = [
    { id: 'cockpit', label: 'Friday Cockpit', icon: Activity },
    { id: 'pnl', label: 'P&L', icon: BarChart3 },
    { id: 'working-capital', label: 'Working Capital', icon: CreditCard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'bookings', label: 'Bookings Risk', icon: Truck },
    { id: 'data-health', label: 'Data Health', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">🚲</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">L'Atelier Clandestin</h1>
              <p className="text-xs text-slate-400">FinanceOS • FY2026 Week 09</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Data Freshness</div>
              <DataStatusBadge status="partial" label="FY2025 Backfill Complete" />
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Last Updated</div>
              <div className="text-sm font-medium">Feb 2, 2026</div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-slate-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        
        {/* ============================================ */}
        {/* FRIDAY COCKPIT TAB */}
        {/* ============================================ */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="space-y-3">
              <SectionHeader icon={AlertTriangle} title="Action Required" subtitle="Top 3 priorities this week" />
              <div className="grid gap-3">
                <AlertCard 
                  severity="critical"
                  title="AP Aging: $46,895 overdue 60+ days"
                  description="LTP Sports ($39,868) and 3T ($6,050) need immediate attention. Risk of supply disruption."
                  action="View AP Detail"
                />
                <AlertCard 
                  severity="warning"
                  title="2026 Bookings: $274K committed (30% of FY25 revenue)"
                  description="Consider reducing cancelable orders by $52K to improve cash position. Norco, SAVA, 3T have flexibility."
                  action="Review Booking Actions"
                />
                <AlertCard 
                  severity="warning"
                  title="Inventory Turns: 2.2x (Target: 3.0x)"
                  description="$74K cash trapped in slow inventory. Implement aging view and weekly deadstock cadence."
                  action="View Deadstock Report"
                />
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard 
                title="FY2025 Net Revenue"
                value={formatCurrency(FY2025_BASELINE.netRevenue)}
                subtitle="Dec 1, 2024 – Nov 30, 2025"
                icon={DollarSign}
                color="primary"
              />
              <KPICard 
                title="Gross Margin"
                value={formatPercent(FY2025_BASELINE.grossMarginPct)}
                subtitle={formatCurrency(FY2025_BASELINE.grossProfit) + " profit"}
                icon={TrendingUp}
                color="success"
              />
              <KPICard 
                title="Inventory at Cost"
                value={formatCurrency(FY2025_BASELINE.inventoryCost)}
                subtitle={`${FY2025_BASELINE.inventoryTurns}x turns (target 3.0x)`}
                icon={Package}
                alert="$74K cash release opportunity"
                color="warning"
              />
              <KPICard 
                title="2026 Bookings"
                value={formatCurrency(FY2025_BASELINE.bookings2026)}
                subtitle="30% of FY25 revenue"
                icon={Truck}
                alert="Major WC exposure"
                color="danger"
              />
            </div>

            {/* Revenue Seasonality Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader icon={BarChart3} title="FY2025 Revenue Seasonality" subtitle="Peak: Apr-Jul (55% of annual revenue)" />
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MONTHLY_REVENUE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `${label} FY2025`}
                    />
                    <Bar dataKey="revenue" fill={COLORS.bikes} radius={[4, 4, 0, 0]} name="Revenue" />
                    <Line type="monotone" dataKey="pct" stroke={COLORS.accent} strokeWidth={2} dot={false} yAxisId={1} hide />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4 text-center text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 font-semibold">Peak Month</div>
                  <div className="text-lg font-bold">July (17%)</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600 font-semibold">Trough</div>
                  <div className="text-lg font-bold">Jan/Nov/Dec (2%)</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <div className="text-amber-600 font-semibold">Peak:Trough Ratio</div>
                  <div className="text-lg font-bold">18:1</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-semibold">Peak Season</div>
                  <div className="text-lg font-bold">Apr-Jul (55%)</div>
                </div>
              </div>
            </div>

            {/* Category Mix */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <SectionHeader icon={PieChartIcon} title="Revenue by Category" subtitle="FY2025 product mix" />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={CATEGORY_DATA}
                        dataKey="sales"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, pctTotal }) => `${name} ${pctTotal}%`}
                        labelLine={false}
                      >
                        {CATEGORY_DATA.map((entry, idx) => (
                          <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <SectionHeader icon={Wrench} title="Service Revenue Breakdown" subtitle="$69K total, 99.7% margin" />
                <div className="space-y-3">
                  {LABOR_BREAKDOWN.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{item.service}</div>
                        <div className="text-xs text-gray-500">{item.margin}% margin</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{formatCurrency(item.revenue)}</div>
                        <div className="text-xs text-gray-500">{((item.revenue / 69107) * 100).toFixed(0)}% of service</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next 3 Actions */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Next 3 Actions (This Week)</h2>
                  <p className="text-sm text-slate-400">Highest-leverage moves for cash protection</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-slate-400 uppercase mb-2">Action 1</div>
                  <div className="font-semibold mb-1">Contact LTP Sports</div>
                  <div className="text-sm text-slate-300">Negotiate payment plan for $39,868 overdue. Protect 2026 supply relationship.</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-slate-400 uppercase mb-2">Action 2</div>
                  <div className="font-semibold mb-1">Cut Norco Booking 30%</div>
                  <div className="text-sm text-slate-300">Reduce $50,743 order by $15K. Cancelable until Feb deadline. Cash savings: $15K.</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-slate-400 uppercase mb-2">Action 3</div>
                  <div className="font-semibold mb-1">Launch Deadstock Clearance</div>
                  <div className="text-sm text-slate-300">Target 180+ day items first. 20-30% markdown to release $15K cash this month.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* P&L TAB */}
        {/* ============================================ */}
        {activeTab === 'pnl' && (
          <div className="space-y-6">
            <SectionHeader icon={BarChart3} title="FY2025 P&L Summary" subtitle="Dec 1, 2024 – Nov 30, 2025" />
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Line Item</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">FY2025 Actual</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">% of Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Net Revenue</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(904462)}</td>
                    <td className="px-6 py-4 text-right text-gray-600">100.0%</td>
                  </tr>
                  {CATEGORY_DATA.map((cat, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-3 pl-10 text-gray-600">↳ {cat.name}</td>
                      <td className="px-6 py-3 text-right text-gray-600">{formatCurrency(cat.sales)}</td>
                      <td className="px-6 py-3 text-right text-gray-500">{cat.pctTotal}%</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Cost of Goods Sold</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">({formatCurrency(575868)})</td>
                    <td className="px-6 py-4 text-right text-gray-600">63.7%</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Gross Profit</td>
                    <td className="px-6 py-4 text-right font-bold text-green-600">{formatCurrency(239555)}</td>
                    <td className="px-6 py-4 text-right text-green-600">26.5%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-gray-900">Fixed Operating Expenses</td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">({formatCurrency(71016)})</td>
                    <td className="px-6 py-4 text-right text-gray-600">7.9%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 pl-10 text-gray-600">↳ Rent</td>
                    <td className="px-6 py-3 text-right text-gray-600">({formatCurrency(30900)})</td>
                    <td className="px-6 py-3 text-right text-gray-500">3.4%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 pl-10 text-gray-600">↳ Comptable</td>
                    <td className="px-6 py-3 text-right text-gray-600">({formatCurrency(8400)})</td>
                    <td className="px-6 py-3 text-right text-gray-500">0.9%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 pl-10 text-gray-600">↳ Other Fixed</td>
                    <td className="px-6 py-3 text-right text-gray-600">({formatCurrency(31716)})</td>
                    <td className="px-6 py-3 text-right text-gray-500">3.5%</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="px-6 py-4 font-semibold text-gray-900">Operating Income (pre-payroll)</td>
                    <td className="px-6 py-4 text-right font-bold text-amber-600">{formatCurrency(168539)}</td>
                    <td className="px-6 py-4 text-right text-amber-600">18.6%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Category Margin Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader icon={TrendingUp} title="Margin by Category" subtitle="Service drives profitability" />
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CATEGORY_DATA} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="margin" fill={COLORS.success} radius={[0, 4, 4, 0]} name="Gross Margin %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* WORKING CAPITAL TAB */}
        {/* ============================================ */}
        {activeTab === 'working-capital' && (
          <div className="space-y-6">
            <SectionHeader icon={CreditCard} title="Working Capital Position" subtitle="As of Nov 30, 2025" />
            
            {/* WC Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard 
                title="Accounts Receivable"
                value={formatCurrency(36333)}
                subtitle="Layaways + Open WO"
                icon={Users}
                color="primary"
              />
              <KPICard 
                title="Accounts Payable"
                value={formatCurrency(112164)}
                subtitle={`${formatCurrency(46895)} overdue 60+ days`}
                icon={Truck}
                alert="42% overdue"
                color="danger"
              />
              <KPICard 
                title="Inventory"
                value={formatCurrency(281964)}
                subtitle="2.2x annual turns"
                icon={Package}
                color="warning"
              />
              <KPICard 
                title="Net Working Capital"
                value={formatCurrency(36333 + 281964 - 112164)}
                subtitle="AR + Inv - AP"
                icon={DollarSign}
                color="success"
              />
            </div>

            {/* AP Aging Detail */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader icon={Clock} title="AP Aging Analysis" subtitle="Supplier payment status" />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Supplier</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Total</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Current</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">31-60</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-red-600">61-90</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-red-600">91+</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {AP_AGING.map((row, idx) => (
                      <tr key={idx} className={row.d91plus > 10000 ? 'bg-red-50' : ''}>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.supplier}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(row.total)}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(row.current)}</td>
                        <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(row.d31_60)}</td>
                        <td className="px-4 py-3 text-right text-red-600">{formatCurrency(row.d61_90)}</td>
                        <td className="px-4 py-3 text-right text-red-700 font-semibold">{formatCurrency(row.d91plus)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-4 py-3">TOTAL</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(apAgingTotal)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(AP_AGING.reduce((s, r) => s + r.current, 0))}</td>
                      <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(AP_AGING.reduce((s, r) => s + r.d31_60, 0))}</td>
                      <td className="px-4 py-3 text-right text-red-600">{formatCurrency(AP_AGING.reduce((s, r) => s + r.d61_90, 0))}</td>
                      <td className="px-4 py-3 text-right text-red-700">{formatCurrency(AP_AGING.reduce((s, r) => s + r.d91plus, 0))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AR Detail */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader icon={Users} title="AR / Layaways / Open Work Orders" subtitle="Customer balances as of Nov 30, 2025" />
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Top Layaway Balances</h4>
                  <div className="space-y-2">
                    {AR_DETAIL.filter(r => r.layaway > 0).map((row, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{row.customer}</span>
                        <span className="font-semibold">{formatCurrency(row.layaway)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg flex justify-between">
                    <span className="font-semibold text-blue-700">Total Layaways</span>
                    <span className="font-bold text-blue-700">{formatCurrency(31838)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Open Work Orders</h4>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-amber-700">{formatCurrency(4494)}</div>
                    <div className="text-sm text-amber-600 mt-1">Billable work orders pending</div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      <strong>Note:</strong> WorkMate integration in Shopify will provide detailed WO aging and parts-consumed tracking starting FY2026.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* INVENTORY TAB */}
        {/* ============================================ */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <SectionHeader icon={Package} title="Inventory Control" subtitle="Turns, aging, and cash release opportunity" />
            
            {/* Inventory KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard 
                title="Inventory at Cost"
                value={formatCurrency(281964)}
                icon={Package}
                color="primary"
              />
              <KPICard 
                title="Inventory at MSRP"
                value={formatCurrency(369455)}
                subtitle="31% markup potential"
                icon={DollarSign}
                color="success"
              />
              <KPICard 
                title="Annual Turns"
                value="2.2x"
                subtitle="Target: 3.0x"
                icon={TrendingUp}
                alert="Below target"
                color="warning"
              />
              <KPICard 
                title="Cash Release Opportunity"
                value={formatCurrency(74000)}
                subtitle="If turns reach 3.0x"
                icon={TrendingUp}
                color="success"
              />
            </div>

            {/* Turns Calculation */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader icon={Activity} title="Inventory Turns Analysis" subtitle="Annual COGS ÷ Average Inventory" />
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">Annual COGS</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(575868)}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500 mb-1">Avg Inventory (est.)</div>
                  <div className="text-2xl font-bold text-gray-900">{formatCurrency(260000)}</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-blue-600 mb-1">Inventory Turns</div>
                  <div className="text-2xl font-bold text-blue-700">2.2x</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-semibold text-green-800 mb-2">💡 Cash Release Calculation</div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>Current inventory: {formatCurrency(281964)}</p>
                  <p>Target inventory @ 3.0x turns: {formatCurrency(575868 / 3)} = {formatCurrency(191956)}</p>
                  <p><strong>Potential cash release: {formatCurrency(281964 - 191956)} (~$90K)</strong></p>
                </div>
              </div>
            </div>

            {/* Aging View Placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-gray-300">
              <SectionHeader icon={Clock} title="Inventory Aging (Coming Soon)" subtitle="Requires received-date data from Shopify" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-sm text-green-600">0-30 days</div>
                  <div className="text-xl font-bold text-green-700">--</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-blue-600">31-90 days</div>
                  <div className="text-xl font-bold text-blue-700">--</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <div className="text-sm text-amber-600">91-180 days</div>
                  <div className="text-xl font-bold text-amber-700">--</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-sm text-red-600">180+ days</div>
                  <div className="text-xl font-bold text-red-700">--</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 text-center">
                Enable received-date tracking in Shopify to activate aging analysis
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* BOOKINGS RISK TAB */}
        {/* ============================================ */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <SectionHeader icon={Truck} title="2026 Pre-Orders & Bookings Risk" subtitle="$274K committed (30% of FY25 revenue)" />
            
            {/* Scenario Planning */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Activity size={20} />
                Scenario Planning
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm text-slate-400">Sales Growth vs FY25</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="-20" 
                      max="20" 
                      value={scenarioSales}
                      onChange={(e) => setScenarioSales(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-mono text-lg w-16 text-right">{scenarioSales > 0 ? '+' : ''}{scenarioSales}%</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Projected: {formatCurrency(projectedRevenue)}</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Margin Change (pp)</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="-5" 
                      max="5" 
                      value={scenarioMargin}
                      onChange={(e) => setScenarioMargin(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-mono text-lg w-16 text-right">{scenarioMargin > 0 ? '+' : ''}{scenarioMargin}pp</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Projected GM: {projectedMargin.toFixed(1)}%</div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Booking Reduction</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={scenarioBookingCut}
                      onChange={(e) => setScenarioBookingCut(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="font-mono text-lg w-16 text-right">-{scenarioBookingCut}%</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">Adjusted: {formatCurrency(projectedBookings)}</div>
                </div>
              </div>
            </div>

            {/* Booking Detail Table */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <SectionHeader icon={FileText} title="Booking Detail by Supplier" subtitle="Recommendations based on cancelability and timing" />
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Supplier</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Priority</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Cancelable</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {BOOKINGS_2026.map((row, idx) => (
                      <tr key={idx} className={row.recommendation.includes('REDUCE') ? 'bg-amber-50' : ''}>
                        <td className="px-4 py-3 font-medium text-gray-900">{row.supplier}</td>
                        <td className="px-4 py-3 text-gray-600">{row.category}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatCurrency(row.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium
                            ${row.priority === 'HIGH' ? 'bg-red-100 text-red-700' : ''}
                            ${row.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : ''}
                            ${row.priority === 'LOW' ? 'bg-gray-100 text-gray-600' : ''}`}>
                            {row.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {row.cancelable ? (
                            <span className="text-green-600">✓ Yes</span>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={row.recommendation.includes('REDUCE') ? 'text-amber-700 font-medium' : 'text-gray-600'}>
                            {row.recommendation}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr className="font-bold">
                      <td className="px-4 py-3" colSpan={2}>TOTAL</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(BOOKINGS_2026.reduce((s, r) => s + r.amount, 0))}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Reduction Opportunity */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-bold text-amber-800 mb-3">💰 Potential Booking Reductions (Cancelable Orders)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-amber-700 mb-2">If you follow all recommendations:</div>
                  <ul className="space-y-1 text-sm">
                    <li>• Norco Booking -30%: -$15,223</li>
                    <li>• Norco Closeout -20%: -$5,709</li>
                    <li>• 3T -25%: -$4,483</li>
                    <li>• SAVA -50%: -$7,567</li>
                    <li>• POC -30%: -$1,516</li>
                    <li>• LeBraquet -50%: -$1,289</li>
                    <li>• LEATT -40%: -$2,050</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-sm text-gray-600">Total Potential Savings</div>
                  <div className="text-3xl font-bold text-green-600">{formatCurrency(37837)}</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Reduces bookings from {formatCurrency(274419)} to {formatCurrency(274419 - 37837)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* DATA HEALTH TAB */}
        {/* ============================================ */}
        {activeTab === 'data-health' && (
          <div className="space-y-6">
            <SectionHeader icon={FileText} title="Data Health & Reconciliation" subtitle="Source validation and missing inputs" />
            
            {/* Data Completeness */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">FY2025 Backfill Status (Lightspeed)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>COMMERCE__SALES_LINES</span>
                    <DataStatusBadge status="complete" label="Complete" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>COMMERCE__SALES_BY_CATEGORY</span>
                    <DataStatusBadge status="complete" label="Complete" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>SAGE50__AP_AGING</span>
                    <DataStatusBadge status="complete" label="Complete" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span>BOOKING__PO_COMMITMENTS</span>
                    <DataStatusBadge status="complete" label="Complete" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span>COMMERCE__WORKORDER_LINES</span>
                    <DataStatusBadge status="partial" label="Parts consumed unclear" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span>INV__AGING_BY_RECEIVED_DATE</span>
                    <DataStatusBadge status="missing" label="Missing" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span>SAGE50__TRIAL_BALANCE</span>
                    <DataStatusBadge status="partial" label="Not uploaded" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                    <span>SAGE50__BANK_LOC_BALANCES</span>
                    <DataStatusBadge status="partial" label="LOC figure unclear" />
                  </div>
                </div>
              </div>
            </div>

            {/* Known Data Issues */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Known Data Quality Issues</h3>
              <div className="space-y-4">
                <AlertCard 
                  severity="critical"
                  title="Work Order Parts Double-Counting"
                  description="Lightspeed category reports count parts on work orders twice (once as WO, once as parts category). This affects COGS accuracy. Resolution: Implement line-item tagging in Shopify/WorkMate for FY2026."
                />
                <AlertCard 
                  severity="warning"
                  title="LOC Balance Discrepancy"
                  description="Balance sheet shows ~$3.1K LOC used; cashflow sheet shows $57K used on $100K limit. Need to confirm authoritative figure from Sage 50."
                />
                <AlertCard 
                  severity="info"
                  title="Inventory Received Dates Not Tracked"
                  description="Cannot calculate aging buckets (0-30, 31-90, etc.) without received-date data. Enable in Shopify for FY2026 inventory tracking."
                />
              </div>
            </div>

            {/* Drive Folder Structure */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Required Drive Folder Structure</h3>
              <div className="font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg">
                <pre>{`/FinanceOS/
├── 01_Sage50_Exports/
│   ├── SAGE50__TRIAL_BALANCE__SOURCE-SAGE50__FY2025__M11__2025-11-30__v01.csv
│   ├── SAGE50__GL_DETAIL__SOURCE-SAGE50__FY2025__M11__2025-11-30__v01.csv
│   └── SAGE50__AP_AGING__SOURCE-SAGE50__FY2025__M11__2025-11-30__v01.csv
├── 02_Backfill_Lightspeed_FY2025/
│   ├── COMMERCE__SALES_LINES__SOURCE-LIGHTSPEED__FY2025__FULL__2025-11-30__v01.csv
│   └── COMMERCE__WORKORDER_LINES__SOURCE-LIGHTSPEED__FY2025__FULL__2025-11-30__v01.csv
├── 03_Inventory_Exports/
│   └── INV__ONHAND_SNAPSHOT__SOURCE-LIGHTSPEED__FY2025__M11__2025-11-30__v01.csv
├── 04_Bookings_Preorders_2026/
│   └── BOOKING__PO_COMMITMENTS__SOURCE-MANUAL__FY2026__ROLLING__2026-02-01__v03.csv
├── 05_Manual_Overrides/
│   └── SAGE50__BANK_LOC_BALANCES__SOURCE-MANUAL__FY2025__M11__2025-11-30__v01.csv
└── 06_Live_Shopify_FY2026+/
    └── (pending Shopify go-live)`}</pre>
              </div>
            </div>

            {/* File Naming Convention */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-800 mb-3">📁 File Naming Convention</h3>
              <code className="text-sm bg-white px-3 py-2 rounded block mb-3">
                {'<DOMAIN>__<DATASET>__SOURCE-<SYSTEM>__FY<YYYY>__<PERIOD>__<DATE>__v<##>.csv'}
              </code>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>DOMAIN:</strong> COMMERCE, INV, SAGE50, BOOKING</p>
                <p>• <strong>PERIOD:</strong> W01-W52 (weekly), M01-M12 (monthly), FULL, ROLLING</p>
                <p>• <strong>DATE:</strong> YYYY-MM-DD format</p>
                <p>• <strong>v##:</strong> Version number (increment on re-export)</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <div>FinanceOS v1.0 • L'Atelier Clandestin</div>
          <div>FY2025 Baseline: Lightspeed | FY2026+: Shopify/WorkMate | Accounting: Sage 50</div>
        </div>
      </footer>
    </div>
  );
}
