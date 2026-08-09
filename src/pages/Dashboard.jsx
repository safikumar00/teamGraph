import React, { useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { 
  Users, 
  GitMerge, 
  Layers, 
  Activity, 
  Search, 
  LogOut, 
  TrendingUp, 
  AlertTriangle, 
  Eye, 
  Network, 
  X
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock data matching the CognoDB/Neo4j graph representation
const MOCK_EMPLOYEES = [
  { id: 'E1', name: 'Sunil Kumar', role: 'CEO', department: 'Leadership', email: 'sunil@teamgraph.com', phone: '+1 (555) 019-2831', tenure: '4 years', avatar: 'SK', activeProjects: 2 },
  { id: 'E2', name: 'Jessica Chen', role: 'VP of Engineering', department: 'Engineering', email: 'jessica.c@teamgraph.com', phone: '+1 (555) 014-9844', tenure: '3 years', avatar: 'JC', activeProjects: 3 },
  { id: 'E3', name: 'Marcus Vance', role: 'Design Lead', department: 'Design', email: 'marcus.v@teamgraph.com', phone: '+1 (555) 012-3844', tenure: '2 years', avatar: 'MV', activeProjects: 1 },
  { id: 'E4', name: 'David Park', role: 'Principal Product Manager', department: 'Product', email: 'david.p@teamgraph.com', phone: '+1 (555) 017-4833', tenure: '2.5 years', avatar: 'DP', activeProjects: 2 },
  { id: 'E5', name: 'Sarah Jenkins', role: 'Senior Frontend Engineer', department: 'Engineering', email: 'sarah.j@teamgraph.com', phone: '+1 (555) 015-2940', tenure: '1.5 years', avatar: 'SJ', activeProjects: 1 },
  { id: 'E6', name: 'James Carter', role: 'Graph Database Engineer', department: 'Engineering', email: 'james.c@teamgraph.com', phone: '+1 (555) 011-8594', tenure: '1 year', avatar: 'JC', activeProjects: 2 },
  { id: 'E7', name: 'Elena Rostova', role: 'HR Operations Lead', department: 'Operations', email: 'elena.r@teamgraph.com', phone: '+1 (555) 016-3949', tenure: '2 years', avatar: 'ER', activeProjects: 0 },
];

const MOCK_PROJECTS = [
  { id: 'P1', name: 'Project Apollo', status: 'Active', complexity: 'High', techStack: ['React', 'Neo4j', 'FastAPI'], desc: 'Transitioning the primary data lake to CognoDB Graph databases for relational queries.' },
  { id: 'P2', name: 'Project Hermes', status: 'In Review', complexity: 'Medium', techStack: ['Tailwind', 'Vite', 'GraphQL'], desc: 'Complete overhaul of the UI framework and migration of navigation logic.' },
  { id: 'P3', name: 'Project Athena', status: 'Planning', complexity: 'Low', techStack: ['Framer Motion', 'Radix'], desc: 'Internal developer documentation and setup of automated design tokens.' },
];

const MOCK_TEAMS = [
  { id: 'T1', name: 'Core Architecture', lead: 'Jessica Chen', size: 4, focus: 'System Scalability & Neo4j' },
  { id: 'T2', name: 'Product Experience', lead: 'David Park', size: 3, focus: 'User Journeys & Interactive Visualization' },
  { id: 'T3', name: 'People & Operations', lead: 'Elena Rostova', size: 1, focus: 'HR Automation & Resource Allocation' },
];

const MOCK_RELATIONSHIPS = [
  { from: 'E1', to: 'E2', type: 'Reports To', weight: 3 },
  { from: 'E1', to: 'E4', type: 'Reports To', weight: 3 },
  { from: 'E1', to: 'E7', type: 'Reports To', weight: 2 },
  { from: 'E2', to: 'E5', type: 'Manages', weight: 2 },
  { from: 'E2', to: 'E6', type: 'Manages', weight: 2 },
  { from: 'E3', to: 'E5', type: 'Collaborates With', weight: 1 },
  { from: 'E4', to: 'E3', type: 'Collaborates With', weight: 2 },
  { from: 'E4', to: 'E2', type: 'Collaborates With', weight: 2 },
  { from: 'E5', to: 'E6', type: 'Collaborates With', weight: 1 },
];

const MOCK_INSIGHTS = [
  { id: 'I1', severity: 'high', category: 'Silo Alert', title: 'Cross-functional isolation detected', desc: 'Design team (Marcus Vance) has very few active communication edges with the core Engineering team members (James Carter, Sarah Jenkins). Consider scheduling a joint sync.' },
  { id: 'I2', severity: 'medium', category: 'Hub Node Risk', title: 'Critical communication bottleneck', desc: 'Jessica Chen acts as a single point of failure (bridge node) between Leadership and engineering tasks. Delegation of reporting lines recommended.' },
  { id: 'I3', severity: 'low', category: 'Project Density', title: 'Optimal team collaboration density', desc: 'Project Apollo shows highly distributed ownership with strong reciprocal graph links across all contributors.' },
];

const MOCK_ACTIVITIES = [
  { id: 'A1', user: 'Jessica Chen', action: 'added James Carter to', target: 'Project Apollo', time: '10 mins ago', type: 'join' },
  { id: 'A2', user: 'Sunil Kumar', action: 'created network relationship to', target: 'David Park', time: '1 hour ago', type: 'connect' },
  { id: 'A3', user: 'Marcus Vance', action: 'updated project board for', target: 'Project Hermes', time: '4 hours ago', type: 'update' },
  { id: 'A4', user: 'Elena Rostova', action: 'registered new team', target: 'Core Architecture', time: '1 day ago', type: 'system' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Custom force layout parameters for SVG graph representation
  const graphDimensions = { width: 800, height: 450 };
  
  // Hardcoded node positions arranged in a clean, aesthetic orbital layout
  const NODE_POSITIONS = useMemo(() => ({
    'E1': { x: 400, y: 225, color: '#6366f1', size: 28 }, // CEO - Purple Center
    'E2': { x: 260, y: 150, color: '#3b82f6', size: 22 }, // Eng Lead - Blue Left
    'E3': { x: 540, y: 150, color: '#ec4899', size: 20 }, // Design Lead - Pink Right
    'E4': { x: 400, y: 80,  color: '#f59e0b', size: 22 }, // PM - Orange Top
    'E5': { x: 180, y: 280, color: '#10b981', size: 18 }, // Eng Dev - Emerald Bottom Left
    'E6': { x: 300, y: 340, color: '#10b981', size: 18 }, // Eng DB - Emerald Bottom Mid
    'E7': { x: 580, y: 300, color: '#8b5cf6', size: 18 }, // HR - Violet Bottom Right
  }), []);

  // Filtered employees for directory view
  const filteredEmployees = useMemo(() => {
    return MOCK_EMPLOYEES.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Handle node click in Graph view
  const handleNodeClick = (nodeId) => {
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setHighlightedNodes(new Set());
    } else {
      setSelectedNode(nodeId);
      const connected = new Set([nodeId]);
      MOCK_RELATIONSHIPS.forEach(rel => {
        if (rel.from === nodeId) connected.add(rel.to);
        if (rel.to === nodeId) connected.add(rel.from);
      });
      setHighlightedNodes(connected);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive" className="bg-rose-500 hover:bg-rose-600">High</Badge>;
      case 'medium': return <Badge variant="warning" className="bg-amber-500 hover:bg-amber-600 text-white">Medium</Badge>;
      default: return <Badge variant="secondary" className="bg-slate-200 text-slate-800">Low</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30 animate-pulse">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              TeamGraph
            </h1>
            <p className="text-xs text-indigo-400/80 font-medium">Relationship Intelligence Engine</p>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
            />
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block"></div>

          {/* User profile dropdown */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9 border border-indigo-500/30 bg-indigo-950 ring-2 ring-indigo-500/10">
              <AvatarFallback className="text-indigo-300 font-bold bg-indigo-900/60">
                {user?.name?.split(' ').map(n=>n[0]).join('') || 'SK'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200">{user?.name || 'Sunil Kumar'}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role || 'Administrator'}</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => logout(false)} 
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg h-9 w-9 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-950 border-slate-800 shadow-md relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300"></div>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400">Total Nodes</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{MOCK_EMPLOYEES.length}</p>
                <p className="text-[10px] text-indigo-400 font-medium">Registered Directory Edges</p>
              </div>
              <div className="p-3 bg-indigo-950/60 border border-indigo-800/40 rounded-xl">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800 shadow-md relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-300"></div>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400">Relationship Links</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{MOCK_RELATIONSHIPS.length}</p>
                <p className="text-[10px] text-emerald-400 font-medium">Active Graph Connections</p>
              </div>
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-xl">
                <GitMerge className="w-5 h-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800 shadow-md relative overflow-hidden group hover:border-pink-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all duration-300"></div>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400">Active Teams</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{MOCK_TEAMS.length}</p>
                <p className="text-[10px] text-pink-400 font-medium">Cross-department Squads</p>
              </div>
              <div className="p-3 bg-pink-950/60 border border-pink-800/40 rounded-xl">
                <Layers className="w-5 h-5 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border-slate-800 shadow-md relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-300"></div>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400">Active Projects</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">{MOCK_PROJECTS.length}</p>
                <p className="text-[10px] text-amber-400 font-medium">High & Med Complexity</p>
              </div>
              <div className="p-3 bg-amber-950/60 border border-amber-800/40 rounded-xl">
                <TrendingUp className="w-5 h-5 text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab View Container */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <TabsList className="bg-slate-950 border border-slate-800 p-1 rounded-lg">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md text-xs sm:text-sm px-4 py-2">
                <Layers className="w-3.5 h-3.5 mr-2 inline" />
                Dashboard Overview
              </TabsTrigger>
              <TabsTrigger value="graph" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md text-xs sm:text-sm px-4 py-2">
                <Network className="w-3.5 h-3.5 mr-2 inline" />
                Interactive Network Graph
              </TabsTrigger>
              <TabsTrigger value="directory" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md text-xs sm:text-sm px-4 py-2">
                <Users className="w-3.5 h-3.5 mr-2 inline" />
                Directory List
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-md text-xs sm:text-sm px-4 py-2">
                <Activity className="w-3.5 h-3.5 mr-2 inline" />
                Live Activities
              </TabsTrigger>
            </TabsList>
            <div className="text-xs text-slate-400 font-semibold hidden md:block">
              Connected Engine: <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">CognoDB Inactive (Local-Mock)</Badge>
            </div>
          </div>

          {/* TAB 1: DASHBOARD OVERVIEW */}
          <TabsContent value="dashboard" className="space-y-6 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Active Teams */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-950 border-slate-800 shadow-md">
                  <CardHeader className="p-6">
                    <CardTitle className="text-lg text-white flex items-center">
                      <Layers className="w-5 h-5 mr-2 text-indigo-400" />
                      Department Squads & active Focus
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      Teams mapped from current graph adjacency list matrix.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="divide-y divide-slate-800/80">
                      {MOCK_TEAMS.map(team => (
                        <div key={team.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-slate-900/40 px-2 rounded-lg transition-colors">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm text-slate-200">{team.name}</h4>
                            <p className="text-xs text-slate-400">Focus: {team.focus}</p>
                          </div>
                          <div className="text-right flex items-center space-x-4">
                            <div className="hidden sm:block">
                              <p className="text-xs text-slate-400">Team Lead</p>
                              <p className="text-xs text-indigo-400 font-medium">{team.lead}</p>
                            </div>
                            <Badge className="bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                              {team.size} Members
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Projects */}
                <Card className="bg-slate-950 border-slate-800 shadow-md">
                  <CardHeader className="p-6">
                    <CardTitle className="text-lg text-white flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-amber-400" />
                      Active Projects Mapping
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      Active cross-departmental development efforts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {MOCK_PROJECTS.map(proj => (
                        <div key={proj.id} className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge className={
                                proj.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                proj.status === 'In Review' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                'bg-slate-800 text-slate-400 border border-slate-700'
                              }>
                                {proj.status}
                              </Badge>
                              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{proj.complexity} Complexity</span>
                            </div>
                            <h4 className="font-semibold text-sm text-slate-200">{proj.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{proj.desc}</p>
                          </div>
                          <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap gap-1">
                            {proj.techStack.map(tech => (
                              <span key={tech} className="text-[9px] bg-slate-950 text-indigo-400 border border-indigo-900/30 px-1.5 py-0.5 rounded font-mono">{tech}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Panel */}
              <div className="space-y-6">
                <Card className="bg-slate-950 border-slate-800 shadow-md">
                  <CardHeader className="p-6">
                    <CardTitle className="text-lg text-white flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-rose-400 animate-bounce" />
                        AI Graph Insights
                      </div>
                      <Badge className="bg-indigo-950 text-indigo-400 border-indigo-900">Beta</Badge>
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-xs">
                      Algorithmic findings from the org topology network.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="space-y-4">
                      {MOCK_INSIGHTS.map(insight => (
                        <div 
                          key={insight.id} 
                          className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 space-y-2 hover:border-indigo-500/20 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest">{insight.category}</span>
                            {getSeverityBadge(insight.severity)}
                          </div>
                          <h4 className="font-bold text-sm text-slate-200">{insight.title}</h4>
                          <p className="text-xs text-slate-400 leading-relaxed">{insight.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Legend/Info Card */}
                <Card className="bg-slate-950 border-slate-850/80 border border-slate-800 p-5 shadow-inner">
                  <h4 className="font-bold text-sm text-slate-300 mb-2">Connecting to CognoDB</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    The backend queries are built with parameterized Cypher ready for Neo4j. To toggle the active database driver, modify the seam configuration in:
                  </p>
                  <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-2 font-mono text-[10px] text-indigo-400/90 select-all overflow-x-auto">
                    src/data/repository.ts
                  </div>
                </Card>
              </div>

            </div>
          </TabsContent>

          {/* TAB 2: INTERACTIVE NETWORK GRAPH */}
          <TabsContent value="graph" className="outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Interactive SVG Graph Area */}
              <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
                <div className="absolute top-4 left-4 z-10 space-y-1">
                  <h3 className="font-bold text-sm text-white">Adjacency Radial Topology</h3>
                  <p className="text-[10px] text-slate-400 flex items-center">
                    <Eye className="w-3 h-3 mr-1 inline text-indigo-400" />
                    Click nodes to focus edges & display attributes.
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800/80 rounded-lg px-3 py-2 z-10 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 shadow-md">
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1.5"></div>Leadership</div>
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5"></div>VP / Manager</div>
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></div>Engineering</div>
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-pink-500 mr-1.5"></div>Design</div>
                </div>

                {/* SVG Visualizer */}
                <div className="w-full flex items-center justify-center p-2">
                  <svg 
                    viewBox={`0 0 ${graphDimensions.width} ${graphDimensions.height}`} 
                    className="w-full h-auto max-h-[460px] overflow-visible select-none"
                  >
                    {/* Definitions for arrow markers, gradients */}
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                      </marker>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Draw Links/Edges */}
                    {MOCK_RELATIONSHIPS.map((rel, index) => {
                      const fromPos = NODE_POSITIONS[rel.from];
                      const toPos = NODE_POSITIONS[rel.to];
                      if (!fromPos || !toPos) return null;
                      
                      const isFocused = highlightedNodes.size > 0;
                      const isActive = highlightedNodes.has(rel.from) && highlightedNodes.has(rel.to);
                      
                      return (
                        <g key={index} className="transition-all duration-300">
                          {/* Outer thicker line for hover effect/click focus */}
                          <line 
                            x1={fromPos.x} 
                            y1={fromPos.y} 
                            x2={toPos.x} 
                            y2={toPos.y} 
                            stroke={isActive ? '#818cf8' : '#334155'} 
                            strokeWidth={isActive ? 3.5 : 1.5}
                            strokeOpacity={isFocused ? (isActive ? 1.0 : 0.1) : 0.6}
                            strokeDasharray={rel.type === 'Collaborates With' ? '5,5' : 'none'}
                            className="transition-all duration-300"
                            markerEnd="url(#arrow)"
                          />
                          {/* Label on link (rendered only if highlighted/active) */}
                          {isActive && (
                            <g transform={`translate(${(fromPos.x + toPos.x)/2}, ${(fromPos.y + toPos.y)/2})`}>
                              <rect x="-42" y="-9" width="84" height="15" rx="3" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1" className="shadow-sm" />
                              <text y="1" textAnchor="middle" fill="#c7d2fe" fontSize="8" fontWeight="bold" fontFamily="monospace">
                                {rel.type}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* Draw Nodes */}
                    {MOCK_EMPLOYEES.map(emp => {
                      const pos = NODE_POSITIONS[emp.id];
                      if (!pos) return null;
                      
                      const isSelected = selectedNode === emp.id;
                      const isFocused = highlightedNodes.size > 0;
                      const isHighlighted = highlightedNodes.has(emp.id);
                      
                      return (
                        <g 
                          key={emp.id} 
                          transform={`translate(${pos.x}, ${pos.y})`}
                          onClick={() => handleNodeClick(emp.id)}
                          className="cursor-pointer group transition-all duration-300"
                        >
                          {/* Selection glow ring */}
                          {isSelected && (
                            <circle 
                              r={pos.size + 8} 
                              fill="none" 
                              stroke="#6366f1" 
                              strokeWidth="2.5" 
                              className="animate-ping" 
                              style={{ animationDuration: '3s' }}
                            />
                          )}

                          {/* Outer halo */}
                          <circle 
                            r={pos.size + 4} 
                            fill={pos.color} 
                            fillOpacity={isSelected ? 0.25 : (isFocused ? (isHighlighted ? 0.15 : 0.02) : 0.1)} 
                            stroke={isSelected ? '#818cf8' : pos.color}
                            strokeWidth={isSelected ? 2 : 1}
                            strokeOpacity={isFocused ? (isHighlighted ? 0.8 : 0.05) : 0.3}
                            className="transition-all duration-300 group-hover:scale-110"
                          />

                          {/* Central node circle */}
                          <circle 
                            r={pos.size} 
                            fill="#020617" 
                            stroke={isSelected ? '#6366f1' : (isFocused ? (isHighlighted ? pos.color : '#1e293b') : pos.color)} 
                            strokeWidth={isSelected ? 3 : 2}
                            strokeOpacity={isFocused ? (isHighlighted ? 1.0 : 0.15) : 1.0}
                            className="transition-all duration-300 group-hover:scale-105"
                          />

                          {/* Node initials */}
                          <text 
                            textAnchor="middle" 
                            dy=".3em" 
                            fill={isFocused ? (isHighlighted ? '#f8fafc' : '#475569') : '#f8fafc'}
                            fontSize={pos.size > 20 ? 11 : 9} 
                            fontWeight="bold"
                            className="pointer-events-none select-none transition-all duration-300"
                          >
                            {emp.avatar}
                          </text>

                          {/* Floating name badge under the node */}
                          <text 
                            y={pos.size + 18} 
                            textAnchor="middle" 
                            fill={isFocused ? (isHighlighted ? '#e2e8f0' : '#475569') : '#cbd5e1'}
                            fontSize="9" 
                            fontWeight="bold"
                            className="pointer-events-none select-none transition-all duration-300"
                          >
                            {emp.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Node Inspector Side Panel */}
              <div className="lg:col-span-1 space-y-4">
                {selectedNode ? (
                  (() => {
                    const emp = MOCK_EMPLOYEES.find(e => e.id === selectedNode);
                    const directRels = MOCK_RELATIONSHIPS.filter(
                      r => r.from === selectedNode || r.to === selectedNode
                    );
                    
                    return (
                      <Card className="bg-slate-950 border-slate-800 shadow-md h-full flex flex-col justify-between">
                        <CardHeader className="p-5 border-b border-slate-900 flex flex-row items-start justify-between space-y-0">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-11 w-11 bg-indigo-950 border border-indigo-500/30">
                              <AvatarFallback className="text-indigo-400 font-bold bg-indigo-950/60">
                                {emp.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base text-white">{emp.name}</CardTitle>
                              <CardDescription className="text-indigo-400/80 text-[10px] font-semibold uppercase">{emp.role}</CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setSelectedNode(null); setHighlightedNodes(new Set()); }}
                            className="h-6 w-6 rounded-md hover:bg-slate-900"
                          >
                            <X className="w-3.5 h-3.5 text-slate-400" />
                          </Button>
                        </CardHeader>
                        
                        <CardContent className="p-5 flex-1 space-y-4 text-xs">
                          {/* Info Rows */}
                          <div className="space-y-2">
                            <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                              <span className="text-slate-400 font-medium">Department</span>
                              <span className="text-slate-200 font-semibold">{emp.department}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                              <span className="text-slate-400 font-medium">Tenure</span>
                              <span className="text-slate-200 font-semibold">{emp.tenure}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                              <span className="text-slate-400 font-medium">Email</span>
                              <span className="text-slate-200 font-semibold font-mono text-[10px]">{emp.email}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-900/60 pb-1.5">
                              <span className="text-slate-400 font-medium">Phone</span>
                              <span className="text-slate-200 font-semibold font-mono text-[10px]">{emp.phone}</span>
                            </div>
                          </div>

                          {/* Graph Connections */}
                          <div className="space-y-2.5">
                            <h4 className="font-bold text-[10px] text-indigo-400 uppercase tracking-widest">Active Graph Adjacencies</h4>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                              {directRels.map((rel, idx) => {
                                const isFrom = rel.from === selectedNode;
                                const partnerId = isFrom ? rel.to : rel.from;
                                const partner = MOCK_EMPLOYEES.find(e => e.id === partnerId);
                                
                                return (
                                  <div key={idx} className="bg-slate-900/80 border border-slate-900 rounded-lg p-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-5 h-5 rounded bg-indigo-950 flex items-center justify-center font-bold text-[9px] text-indigo-400">
                                        {partner.avatar}
                                      </div>
                                      <div>
                                        <p className="font-semibold text-slate-300 text-[10px]">{partner.name}</p>
                                        <p className="text-[9px] text-slate-500">{partner.role}</p>
                                      </div>
                                    </div>
                                    <Badge className="bg-indigo-950 text-indigo-400 border-indigo-900/40 text-[9px] px-1.5 py-0">
                                      {rel.type}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()
                ) : (
                  <Card className="bg-slate-950 border-slate-800 shadow-md h-full flex items-center justify-center p-6 text-center border-dashed">
                    <div className="space-y-3">
                      <div className="p-3 bg-indigo-950/40 border border-indigo-850 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                        <Network className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-300">Inspector Terminal</h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] mx-auto mt-1">
                          Focus any employee node inside the radial graph layout to load metadata properties.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

            </div>
          </TabsContent>

          {/* TAB 3: DIRECTORY LIST */}
          <TabsContent value="directory" className="outline-none">
            <Card className="bg-slate-950 border-slate-800 shadow-md">
              <CardHeader className="p-6 flex flex-row items-center justify-between space-y-0 border-b border-slate-900">
                <div>
                  <CardTitle className="text-lg text-white">Employee Directory</CardTitle>
                  <CardDescription className="text-slate-400 text-xs">Full metadata database of organization nodes.</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Filter names..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-950/40 text-slate-400 font-semibold">
                        <th className="p-4">Name</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Tenure</th>
                        <th className="p-4">Email</th>
                        <th className="p-4 text-right">Active Projects</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 bg-slate-950">
                      {filteredEmployees.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 flex items-center space-x-3">
                            <Avatar className="h-7 w-7 bg-slate-900 border border-indigo-500/10">
                              <AvatarFallback className="text-indigo-400 text-[10px] font-bold">{emp.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-slate-200">{emp.name}</span>
                          </td>
                          <td className="p-4 text-slate-300">{emp.role}</td>
                          <td className="p-4">
                            <Badge className="bg-indigo-950/40 text-indigo-400 border border-indigo-950/60 font-medium">
                              {emp.department}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-400">{emp.tenure}</td>
                          <td className="p-4 text-slate-400 font-mono text-[10px]">{emp.email}</td>
                          <td className="p-4 text-right font-bold text-indigo-400">{emp.activeProjects}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: LIVE ACTIVITIES */}
          <TabsContent value="activity" className="outline-none">
            <Card className="bg-slate-950 border-slate-800 shadow-md">
              <CardHeader className="p-6 border-b border-slate-900">
                <CardTitle className="text-lg text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-indigo-400" />
                  Real-time Graph Adjacency Edits
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Event log tracking live edits to node relationships.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative pl-6 border-l border-slate-800 space-y-6">
                  {MOCK_ACTIVITIES.map(act => (
                    <div key={act.id} className="relative space-y-1">
                      {/* Timeline dot */}
                      <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-950"></span>
                      
                      <div className="flex items-center justify-between text-xs">
                        <p className="text-slate-300">
                          <span className="font-bold text-slate-100">{act.user}</span>{' '}
                          {act.action}{' '}
                          <span className="font-semibold text-indigo-400">{act.target}</span>
                        </p>
                        <span className="text-[10px] text-slate-500 font-medium">{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-6 text-center text-xs text-slate-500">
        <p>© 2026 TeamGraph Org Intelligence. All rights reserved.</p>
        <p className="text-[10px] text-indigo-500/60 font-semibold mt-1">Stand-alone Local Simulation Environment</p>
      </footer>
    </div>
  );
}
