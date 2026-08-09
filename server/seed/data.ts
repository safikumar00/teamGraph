import type { SeedStep } from "./index";

// 7 Clients
export const CLIENTS = [
  { id: "C1", name: "Acme Corp", industry: "Retail & E-commerce", region: "North America", since: "2022-01-15", health: "Healthy" },
  { id: "C2", name: "Globex Corp", industry: "Security & Defense", region: "Europe", since: "2023-04-10", health: "Watch" },
  { id: "C3", name: "Initech", industry: "Financial Services", region: "North America", since: "2021-08-20", health: "Healthy" },
  { id: "C4", name: "Umbrella Corp", industry: "Biotechnology & Health", region: "Asia-Pacific", since: "2024-02-01", health: "Escalated" },
  { id: "C5", name: "Wayne Enterprises", industry: "Aerospace & Industrial", region: "North America", since: "2020-11-12", health: "Healthy" },
  { id: "C6", name: "Stark Industries", industry: "Energy & Advanced Tech", region: "North America", since: "2019-06-01", health: "Healthy" },
  { id: "C7", name: "Tyrell Corp", industry: "Artificial Intelligence & Robotics", region: "Asia-Pacific", since: "2023-10-15", health: "Healthy" }
];

// 14 Technologies
export const TECHNOLOGIES = [
  { id: "T1", name: "TypeScript", category: "Language", adoption: 90 },
  { id: "T2", name: "Python", category: "Language", adoption: 85 },
  { id: "T3", name: "Rust", category: "Language", adoption: 40 },
  { id: "T4", name: "Go", category: "Language", adoption: 65 },
  { id: "T5", name: "Neo4j", category: "Database", adoption: 50 },
  { id: "T6", name: "AWS", category: "Cloud Platform", adoption: 80 },
  { id: "T7", name: "Docker", category: "Containerization", adoption: 95 },
  { id: "T8", name: "Kubernetes", category: "Container Orchestration", adoption: 75 },
  { id: "T9", name: "PyTorch", category: "Machine Learning Framework", adoption: 55 },
  { id: "T10", name: "React", category: "Frontend Framework", adoption: 88 },
  { id: "T11", name: "Next.js", category: "Frontend Framework", adoption: 70 },
  { id: "T12", name: "GraphQL", category: "API Technology", adoption: 60 },
  { id: "T13", name: "PostgreSQL", category: "Database", adoption: 82 },
  { id: "T14", name: "Terraform", category: "Infrastructure as Code", adoption: 72 }
];

// 24 Skills
export const SKILLS = [
  { id: "S1", name: "Frontend Development", category: "Software Engineering", rarity: "Common" },
  { id: "S2", name: "Backend Development", category: "Software Engineering", rarity: "Common" },
  { id: "S3", name: "UI/UX Design", category: "Design", rarity: "Common" },
  { id: "S4", name: "Database Administration", category: "Database Operations", rarity: "Uncommon" },
  { id: "S5", name: "Graph Databases", category: "Database Operations", rarity: "Rare" },
  { id: "S6", name: "Cloud Architecture", category: "Cloud Computing", rarity: "Uncommon" },
  { id: "S7", name: "DevOps", category: "Infrastructure Operations", rarity: "Common" },
  { id: "S8", name: "Machine Learning", category: "Artificial Intelligence", rarity: "Uncommon" },
  { id: "S9", name: "Natural Language Processing", category: "Artificial Intelligence", rarity: "Rare" },
  { id: "S10", name: "Cybersecurity", category: "Security Operations", rarity: "Uncommon" },
  { id: "S11", name: "Project Management", category: "Management", rarity: "Common" },
  { id: "S12", name: "Agile Methodologies", category: "Management", rarity: "Common" },
  { id: "S13", name: "Mobile Development", category: "Software Engineering", rarity: "Uncommon" },
  { id: "S14", name: "Data Engineering", category: "Data Operations", rarity: "Uncommon" },
  { id: "S15", name: "System Architecture", category: "Software Engineering", rarity: "Rare" },
  { id: "S16", name: "API Design", category: "Software Engineering", rarity: "Common" },
  { id: "S17", name: "Quality Assurance", category: "Software Engineering", rarity: "Common" },
  { id: "S18", name: "Technical Writing", category: "Content Operations", rarity: "Common" },
  { id: "S19", name: "Product Strategy", category: "Management", rarity: "Uncommon" },
  { id: "S20", name: "Performance Tuning", category: "Database Operations", rarity: "Rare" },
  { id: "S21", name: "Infrastructure as Code", category: "Infrastructure Operations", rarity: "Uncommon" },
  { id: "S22", name: "Deep Learning", category: "Artificial Intelligence", rarity: "Rare" },
  { id: "S23", name: "Financial Engineering", category: "Domain Domain", rarity: "Critical" },
  { id: "S24", name: "Hardware Integration", category: "Domain Domain", rarity: "Critical" }
];

// 8 Teams
export const TEAMS = [
  { id: "TM1", name: "Platform Core", department: "Engineering", focus: "System Scalability & Performance" },
  { id: "TM2", name: "Graph Intelligence", department: "Engineering", focus: "Search, Neo4j & Knowledge Graphs" },
  { id: "TM3", name: "Digital Experience", department: "Engineering", focus: "User Interfaces & Mobile Apps" },
  { id: "TM4", name: "Enterprise Products", department: "Solutions", focus: "Client Project Deliveries" },
  { id: "TM5", name: "Cloud Operations", department: "Operations", focus: "SRE, CI/CD & Security Compliance" },
  { id: "TM6", name: "AI Research", department: "Research", focus: "Machine Learning & Deep Neural Networks" },
  { id: "TM7", name: "Cyber Security", department: "Operations", focus: "Threat Analysis & Red Teaming" },
  { id: "TM8", name: "Product Leadership", department: "Product", focus: "Product Strategy & UX Design" }
];

// 12 Certifications
export const CERTIFICATIONS = [
  { id: "CR1", name: "AWS Solutions Architect", issuer: "Amazon Web Services" },
  { id: "CR2", name: "Neo4j Certified Professional", issuer: "Neo4j" },
  { id: "CR3", name: "Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation" },
  { id: "CR4", name: "Google Cloud Professional Architect", issuer: "Google" },
  { id: "CR5", name: "HashiCorp Certified Terraform Associate", issuer: "HashiCorp" },
  { id: "CR6", name: "Certified Information Systems Security Professional (CISSP)", issuer: "ISC2" },
  { id: "CR7", name: "Project Management Professional (PMP)", issuer: "Project Management Institute" },
  { id: "CR8", name: "Scrum Master Certified (SMC)", issuer: "Scrum Alliance" },
  { id: "CR9", name: "TensorFlow Developer Certificate", issuer: "Google" },
  { id: "CR10", name: "Oracle Certified Database Professional", issuer: "Oracle" },
  { id: "CR11", name: "Cisco Certified Network Professional (CCNP)", issuer: "Cisco" },
  { id: "CR12", name: "Microsoft Certified Azure Solutions Architect", issuer: "Microsoft" }
];

// 16 Projects
export const PROJECTS = [
  { id: "P1", name: "Project Apollo", code: "APL", summary: "CognoDB graph database migration for high-performance relational queries.", status: "Active", risk: "Medium", progress: 65, clientId: "C6", teamId: "TM2", startedAt: "2025-01-10", targetAt: "2025-10-30", dependsOn: [] },
  { id: "P2", name: "Project Hermes", code: "HMS", summary: "Complete revamp of the core web interface onto Next.js and Tailwind.", status: "Active", risk: "Low", progress: 40, clientId: "C1", teamId: "TM3", startedAt: "2025-03-01", targetAt: "2025-12-15", dependsOn: [] },
  { id: "P3", name: "Project Athena", code: "ATH", summary: "Internal technical documentation, API specs, and onboarding playbooks.", status: "Planning", risk: "Low", progress: 10, clientId: "C1", teamId: "TM8", startedAt: "2025-09-01", targetAt: "2026-03-01", dependsOn: [] },
  { id: "P4", name: "Project Zeus", code: "ZUS", summary: "Cloud-native infrastructure migration and automation for the enterprise client.", status: "Active", risk: "High", progress: 55, clientId: "C5", teamId: "TM5", startedAt: "2024-11-01", targetAt: "2025-09-30", dependsOn: ["P1"] },
  { id: "P5", name: "Project Ares", code: "ARS", summary: "Implementation of zero-trust network endpoints and intrusion response shields.", status: "Active", risk: "Medium", progress: 80, clientId: "C2", teamId: "TM7", startedAt: "2024-08-15", targetAt: "2025-08-30", dependsOn: [] },
  { id: "P6", name: "Project Poseidon", code: "PSD", summary: "High-frequency trade ledger using Rust and customized transactional DB schemas.", status: "Active", risk: "High", progress: 30, clientId: "C3", teamId: "TM1", startedAt: "2025-02-20", targetAt: "2025-11-30", dependsOn: ["P1"] },
  { id: "P7", name: "Project Hades", code: "HDS", summary: "Train deep learning transformers for automated document parser extraction.", status: "Active", risk: "Medium", progress: 70, clientId: "C7", teamId: "TM6", startedAt: "2024-10-01", targetAt: "2025-08-15", dependsOn: ["P1"] },
  { id: "P8", name: "Project Iris", code: "IRS", summary: "Mobile companion application supporting geolocation and notification endpoints.", status: "Active", risk: "Low", progress: 45, clientId: "C1", teamId: "TM3", startedAt: "2025-02-15", targetAt: "2025-11-15", dependsOn: ["P2"] },
  { id: "P9", name: "Project Chronos", code: "CHN", summary: "Optimised time-series data storage and visualization dashboard panels.", status: "Completed", risk: "Low", progress: 100, clientId: "C5", teamId: "TM4", startedAt: "2024-05-01", targetAt: "2024-12-20", dependsOn: [] },
  { id: "P10", name: "Project Demeter", code: "DMT", summary: "Agritech telemetry analytical dashboards and forecasting pipelines.", status: "Active", risk: "Low", progress: 50, clientId: "C4", teamId: "TM6", startedAt: "2025-01-15", targetAt: "2025-10-15", dependsOn: [] },
  { id: "P11", name: "Project Helios", code: "HLS", summary: "Solar microgrid telemetry collection and API mesh gateway architecture.", status: "Active", risk: "Medium", progress: 25, clientId: "C6", teamId: "TM4", startedAt: "2025-04-01", targetAt: "2026-02-28", dependsOn: ["P4"] },
  { id: "P12", name: "Project Hephaestus", code: "HPH", summary: "Infrastructure configuration audits and fully automated CI/CD pipelines.", status: "Completed", risk: "Low", progress: 100, clientId: "C1", teamId: "TM5", startedAt: "2024-07-01", targetAt: "2025-01-30", dependsOn: [] },
  { id: "P13", name: "Project Nemesis", code: "NMS", summary: "ML-powered static and dynamic malware binary threat signature analysis.", status: "Planning", risk: "High", progress: 5, clientId: "C2", teamId: "TM7", startedAt: "2025-10-01", targetAt: "2026-07-31", dependsOn: ["P5"] },
  { id: "P14", name: "Project Odysseus", code: "ODY", summary: "Autonomous robot navigational map builder utilizing graph structures.", status: "Active", risk: "High", progress: 42, clientId: "C7", teamId: "TM6", startedAt: "2024-12-01", targetAt: "2025-12-01", dependsOn: ["P7"] },
  { id: "P15", name: "Project Perseus", code: "PRS", summary: "High-security biometric auth middleware integration with hardware APIs.", status: "Planning", risk: "Medium", progress: 15, clientId: "C4", teamId: "TM7", startedAt: "2025-09-01", targetAt: "2026-04-30", dependsOn: ["P5"] },
  { id: "P16", name: "Project Thor", code: "THR", summary: "Distributed smart grid power router and real-time load balancer panels.", status: "Completed", risk: "Low", progress: 100, clientId: "C6", teamId: "TM4", startedAt: "2024-06-01", targetAt: "2025-03-31", dependsOn: ["P11"] }
];

// 45 Employees
export const EMPLOYEES = [
  // E1 - CEO
  { id: "E1", name: "Sunil Kumar", role: "Chief Executive Officer", seniority: "Principal", department: "Leadership", tenure: "6 years", location: "San Francisco, USA", email: "sunil@teamgraph.com", experienceYears: 18, joinedAt: "2020-08-01", teamId: "TM8", managerId: null },
  // TM1 - Platform Core
  { id: "E2", name: "Jessica Chen", role: "Principal Systems Architect", seniority: "Principal", department: "Engineering", tenure: "5 years", location: "San Francisco, USA", email: "jessica.c@teamgraph.com", experienceYears: 14, joinedAt: "2021-02-15", teamId: "TM1", managerId: "E1" },
  { id: "E5", name: "James Carter", role: "Senior Platform Engineer", seniority: "Senior", department: "Engineering", tenure: "3 years", location: "London, UK", email: "james.c@teamgraph.com", experienceYears: 8, joinedAt: "2023-01-10", teamId: "TM1", managerId: "E2" },
  { id: "E8", name: "Alex Mercer", role: "Systems Engineer & Rust Specialist", seniority: "Senior", department: "Engineering", tenure: "2.5 years", location: "Berlin, Germany", email: "alex.m@teamgraph.com", experienceYears: 9, joinedAt: "2023-10-15", teamId: "TM1", managerId: "E2" },
  { id: "E14", name: "Ryan Gosling", role: "Software Developer", seniority: "Mid", department: "Engineering", tenure: "2 years", location: "New York, USA", email: "ryan.g@teamgraph.com", experienceYears: 5, joinedAt: "2024-05-15", teamId: "TM1", managerId: "E2" },
  { id: "E20", name: "Keanu Reeves", role: "Low-Level Systems Engineer", seniority: "Senior", department: "Engineering", tenure: "1.5 years", location: "Seattle, USA", email: "keanu.r@teamgraph.com", experienceYears: 10, joinedAt: "2024-11-01", teamId: "TM1", managerId: "E2" },
  // TM2 - Graph Intelligence
  { id: "E3", name: "Marcus Vance", role: "Principal Database Engineer", seniority: "Principal", department: "Engineering", tenure: "4 years", location: "New York, USA", email: "marcus.v@teamgraph.com", experienceYears: 13, joinedAt: "2022-04-10", teamId: "TM2", managerId: "E2" },
  { id: "E6", name: "Sarah Jenkins", role: "Senior Graph Engineer", seniority: "Senior", department: "Engineering", tenure: "3 years", location: "Toronto, Canada", email: "sarah.j@teamgraph.com", experienceYears: 7, joinedAt: "2023-02-15", teamId: "TM2", managerId: "E3" },
  { id: "E9", name: "Emily Blunt", role: "Database Infrastructure Architect", seniority: "Staff", department: "Engineering", tenure: "2 years", location: "London, UK", email: "emily.b@teamgraph.com", experienceYears: 11, joinedAt: "2024-03-01", teamId: "TM2", managerId: "E3" },
  { id: "E15", name: "Florence Pugh", role: "Database Administrator", seniority: "Mid", department: "Engineering", tenure: "2 years", location: "Austin, USA", email: "florence.p@teamgraph.com", experienceYears: 4, joinedAt: "2024-06-01", teamId: "TM2", managerId: "E3" },
  { id: "E21", name: "Tom Hardy", role: "Junior Graph Developer", seniority: "Junior", department: "Engineering", tenure: "1 year", location: "London, UK", email: "tom.h@teamgraph.com", experienceYears: 2, joinedAt: "2025-06-01", teamId: "TM2", managerId: "E3" },
  // TM3 - Digital Experience
  { id: "E4", name: "David Park", role: "VP of Product Experience", seniority: "Principal", department: "Product", tenure: "4.5 years", location: "San Francisco, USA", email: "david.p@teamgraph.com", experienceYears: 15, joinedAt: "2021-11-01", teamId: "TM8", managerId: "E1" },
  { id: "E7", name: "Gwyneth Paltrow", role: "Senior UX Designer", seniority: "Senior", department: "Product", tenure: "3 years", location: "Los Angeles, USA", email: "gwyneth.p@teamgraph.com", experienceYears: 8, joinedAt: "2023-03-01", teamId: "TM3", managerId: "E4" },
  { id: "E10", name: "Zendaya Coleman", role: "Senior Frontend Engineer", seniority: "Senior", department: "Engineering", tenure: "3 years", location: "Los Angeles, USA", email: "zendaya@teamgraph.com", experienceYears: 7, joinedAt: "2023-05-10", teamId: "TM3", managerId: "E4" },
  { id: "E16", name: "Tom Holland", role: "Frontend Developer", seniority: "Mid", department: "Engineering", tenure: "2.5 years", location: "London, UK", email: "tom.h1@teamgraph.com", experienceYears: 5, joinedAt: "2023-11-15", teamId: "TM3", managerId: "E4" },
  { id: "E22", name: "Scarlett Johansson", role: "Mobile Application Developer", seniority: "Senior", department: "Engineering", tenure: "2 years", location: "New York, USA", email: "scarlett.j@teamgraph.com", experienceYears: 9, joinedAt: "2024-04-10", teamId: "TM3", managerId: "E4" },
  { id: "E28", name: "Robert Downey Jr", role: "Principal UI Architect", seniority: "Principal", department: "Engineering", tenure: "1.5 years", location: "Los Angeles, USA", email: "robert.d@teamgraph.com", experienceYears: 16, joinedAt: "2024-09-01", teamId: "TM3", managerId: "E4" },
  { id: "E34", name: "Chris Evans", role: "Frontend Engineer", seniority: "Mid", department: "Engineering", tenure: "1 year", location: "Boston, USA", email: "chris.e@teamgraph.com", experienceYears: 4, joinedAt: "2025-03-01", teamId: "TM3", managerId: "E4" },
  // TM4 - Enterprise Products
  { id: "E11", name: "Chris Hemsworth", role: "Principal Solution Architect", seniority: "Principal", department: "Solutions", tenure: "3.5 years", location: "Sydney, Australia", email: "chris.h@teamgraph.com", experienceYears: 13, joinedAt: "2022-09-01", teamId: "TM4", managerId: "E2" },
  { id: "E17", name: "Natalie Portman", role: "Enterprise Product Architect", seniority: "Staff", department: "Solutions", tenure: "2.5 years", location: "Paris, France", email: "natalie.p@teamgraph.com", experienceYears: 11, joinedAt: "2023-12-01", teamId: "TM4", managerId: "E11" },
  { id: "E23", name: "Tessa Thompson", role: "Solutions Developer", seniority: "Mid", department: "Solutions", tenure: "2 years", location: "Brooklyn, USA", email: "tessa.t@teamgraph.com", experienceYears: 6, joinedAt: "2024-04-01", teamId: "TM4", managerId: "E11" },
  { id: "E29", name: "Christian Bale", role: "Senior Solutions Engineer", seniority: "Senior", department: "Solutions", tenure: "1.5 years", location: "London, UK", email: "christian.b@teamgraph.com", experienceYears: 10, joinedAt: "2024-10-01", teamId: "TM4", managerId: "E11" },
  { id: "E35", name: "Mark Ruffalo", role: "Senior Hardware Solutions Engineer", seniority: "Senior", department: "Solutions", tenure: "1 year", location: "Boston, USA", email: "mark.r@teamgraph.com", experienceYears: 8, joinedAt: "2025-04-01", teamId: "TM4", managerId: "E11" },
  // TM5 - Cloud Operations
  { id: "E12", name: "Elena Rostova", role: "VP of Cloud Operations", seniority: "Principal", department: "Operations", tenure: "3.5 years", location: "Seattle, USA", email: "elena.r@teamgraph.com", experienceYears: 14, joinedAt: "2022-10-15", teamId: "TM5", managerId: "E2" },
  { id: "E18", name: "Benedict Cumberbatch", role: "Senior SRE Lead", seniority: "Senior", department: "Operations", tenure: "2.5 years", location: "London, UK", email: "benedict.c@teamgraph.com", experienceYears: 9, joinedAt: "2023-12-01", teamId: "TM5", managerId: "E12" },
  { id: "E24", name: "Elizabeth Olsen", role: "Kubernetes Orchestration Architect", seniority: "Staff", department: "Operations", tenure: "2 years", location: "Atlanta, USA", email: "elizabeth.o@teamgraph.com", experienceYears: 8, joinedAt: "2024-04-01", teamId: "TM5", managerId: "E12" },
  { id: "E30", name: "Tom Hiddleston", role: "Infrastructure Automation Developer", seniority: "Mid", department: "Operations", tenure: "1.5 years", location: "London, UK", email: "tom.h2@teamgraph.com", experienceYears: 5, joinedAt: "2024-10-01", teamId: "TM5", managerId: "E12" },
  { id: "E36", name: "Paul Bettany", role: "CI/CD SRE Architect", seniority: "Senior", department: "Operations", tenure: "1 year", location: "London, UK", email: "paul.b@teamgraph.com", experienceYears: 9, joinedAt: "2025-04-01", teamId: "TM5", managerId: "E12" },
  // TM6 - AI Research
  { id: "E13", name: "Hugh Jackman", role: "Principal Research Scientist", seniority: "Principal", department: "Research", tenure: "3.5 years", location: "Sydney, Australia", email: "hugh.j@teamgraph.com", experienceYears: 16, joinedAt: "2022-10-01", teamId: "TM6", managerId: "E2" },
  { id: "E19", name: "Ryan Reynolds", role: "Senior Machine Learning Engineer", seniority: "Senior", department: "Research", tenure: "2.5 years", location: "Vancouver, Canada", email: "ryan.r@teamgraph.com", experienceYears: 8, joinedAt: "2023-12-15", teamId: "TM6", managerId: "E13" },
  { id: "E25", name: "Gal Gadot", role: "Deep Learning Specialist", seniority: "Senior", department: "Research", tenure: "2.0 years", location: "Tel Aviv, Israel", email: "gal.g@teamgraph.com", experienceYears: 7, joinedAt: "2024-04-01", teamId: "TM6", managerId: "E13" },
  { id: "E31", name: "Henry Cavill", role: "Research & Development Engineer", seniority: "Senior", department: "Research", tenure: "1.5 years", location: "London, UK", email: "henry.c@teamgraph.com", experienceYears: 9, joinedAt: "2024-10-01", teamId: "TM6", managerId: "E13" },
  { id: "E37", name: "Margot Robbie", role: "Data Scientist", seniority: "Mid", department: "Research", tenure: "1 year", location: "Gold Coast, Australia", email: "margot.r@teamgraph.com", experienceYears: 4, joinedAt: "2025-04-01", teamId: "TM6", managerId: "E13" },
  { id: "E41", name: "Cillian Murphy", role: "AI Ethics & Logic Researcher", seniority: "Staff", department: "Research", tenure: "0.8 years", location: "Dublin, Ireland", email: "cillian.m@teamgraph.com", experienceYears: 12, joinedAt: "2025-10-01", teamId: "TM6", managerId: "E13" },
  { id: "E42", name: "Robert Pattinson", role: "Junior Neural Network Engineer", seniority: "Junior", department: "Research", tenure: "0.6 years", location: "London, UK", email: "robert.p@teamgraph.com", experienceYears: 2, joinedAt: "2025-12-01", teamId: "TM6", managerId: "E13" },
  // TM7 - Cyber Security
  { id: "E26", name: "Idris Elba", role: "Director of Cyber Security", seniority: "Principal", department: "Operations", tenure: "2 years", location: "London, UK", email: "idris.e@teamgraph.com", experienceYears: 15, joinedAt: "2024-04-01", teamId: "TM7", managerId: "E2" },
  { id: "E32", name: "Lupita Nyong'o", role: "Senior Security Analyst", seniority: "Senior", department: "Operations", tenure: "1.5 years", location: "Nairobi, Kenya", email: "lupita.n@teamgraph.com", experienceYears: 7, joinedAt: "2024-10-01", teamId: "TM7", managerId: "E26" },
  { id: "E38", name: "Daniel Craig", role: "Principal Penetration Tester", seniority: "Staff", department: "Operations", tenure: "1 year", location: "London, UK", email: "daniel.c@teamgraph.com", experienceYears: 12, joinedAt: "2025-04-01", teamId: "TM7", managerId: "E26" },
  { id: "E43", name: "Ana de Armas", role: "Threat Intelligence Researcher", seniority: "Mid", department: "Operations", tenure: "0.6 years", location: "Madrid, Spain", email: "ana.d@teamgraph.com", experienceYears: 5, joinedAt: "2025-10-01", teamId: "TM7", managerId: "E26" },
  // TM8 - Product Leadership
  { id: "E27", name: "Chadwick Boseman", role: "VP of Product Strategy", seniority: "Principal", department: "Product", tenure: "2.5 years", location: "Atlanta, USA", email: "chadwick.b@teamgraph.com", experienceYears: 14, joinedAt: "2023-10-01", teamId: "TM8", managerId: "E1" },
  { id: "E33", name: "Letitia Wright", role: "Senior Product Manager", seniority: "Senior", department: "Product", tenure: "1.5 years", location: "London, UK", email: "letitia.w@teamgraph.com", experienceYears: 8, joinedAt: "2024-10-01", teamId: "TM8", managerId: "E27" },
  { id: "E39", name: "Michael B. Jordan", role: "Enterprise Product Manager", seniority: "Senior", department: "Product", tenure: "1 year", location: "New York, USA", email: "michael.j@teamgraph.com", experienceYears: 9, joinedAt: "2025-04-01", teamId: "TM8", managerId: "E27" },
  { id: "E40", name: "Danai Gurira", role: "Principal Agile Coach", seniority: "Staff", department: "Product", tenure: "1 year", location: "Atlanta, USA", email: "danai.g@teamgraph.com", experienceYears: 12, joinedAt: "2025-04-01", teamId: "TM8", managerId: "E27" },
  { id: "E44", name: "Winston Duke", role: "Design Strategist Lead", seniority: "Senior", department: "Product", tenure: "0.6 years", location: "Trinidad & Tobago", email: "winston.d@teamgraph.com", experienceYears: 8, joinedAt: "2025-10-01", teamId: "TM8", managerId: "E27" },
  { id: "E45", name: "Angela Bassett", role: "VP of Business Operations", seniority: "Principal", department: "Leadership", tenure: "2.5 years", location: "San Francisco, USA", email: "angela.b@teamgraph.com", experienceYears: 16, joinedAt: "2023-10-01", teamId: "TM8", managerId: "E1" }
];

// WORKS_IN Relationships (Employee -> Team)
export const WORKS_IN = EMPLOYEES.map(emp => ({ fromId: emp.id, toId: emp.teamId }));

// REPORTS_TO Relationships (Employee -> Manager)
export const REPORTS_TO = EMPLOYEES.filter(emp => emp.managerId !== null).map(emp => ({ fromId: emp.id, toId: emp.managerId }));

// MENTORED Relationships (Employee -> Mentee)
export const MENTORED = [
  { fromId: "E1", toId: "E2" },
  { fromId: "E1", toId: "E4" },
  { fromId: "E2", toId: "E5" },
  { fromId: "E3", toId: "E6" },
  { fromId: "E4", toId: "E10" },
  { fromId: "E4", toId: "E7" },
  { fromId: "E11", toId: "E17" },
  { fromId: "E12", toId: "E18" },
  { fromId: "E13", toId: "E19" },
  { fromId: "E26", toId: "E32" },
  { fromId: "E27", toId: "E33" },
  { fromId: "E5", toId: "E14" },
  { fromId: "E6", toId: "E21" },
  { fromId: "E10", toId: "E16" },
  { fromId: "E13", toId: "E41" },
  { fromId: "E18", toId: "E30" },
  { fromId: "E19", toId: "E37" }
];

// WORKED_ON Relationships (Employee -> Project)
export const WORKED_ON = [
  // P1 - Apollo (Stark)
  { fromId: "E2", toId: "P1" }, { fromId: "E3", toId: "P1" }, { fromId: "E5", toId: "P1" }, { fromId: "E6", toId: "P1" }, { fromId: "E8", toId: "P1" }, { fromId: "E9", toId: "P1" }, { fromId: "E14", toId: "P1" }, { fromId: "E20", toId: "P1" }, { fromId: "E21", toId: "P1" },
  // P2 - Hermes (Acme)
  { fromId: "E4", toId: "P2" }, { fromId: "E7", toId: "P2" }, { fromId: "E10", toId: "P2" }, { fromId: "E16", toId: "P2" }, { fromId: "E28", toId: "P2" }, { fromId: "E34", toId: "P2" },
  // P3 - Athena (Internal)
  { fromId: "E4", toId: "P3" }, { fromId: "E10", toId: "P3" }, { fromId: "E44", toId: "P3" },
  // P4 - Zeus (Wayne)
  { fromId: "E11", toId: "P4" }, { fromId: "E12", toId: "P4" }, { fromId: "E18", toId: "P4" }, { fromId: "E24", toId: "P4" }, { fromId: "E29", toId: "P4" }, { fromId: "E30", toId: "P4" }, { fromId: "E36", toId: "P4" },
  // P5 - Ares (Globex)
  { fromId: "E26", toId: "P5" }, { fromId: "E32", toId: "P5" }, { fromId: "E38", toId: "P5" }, { fromId: "E43", toId: "P5" },
  // P6 - Poseidon (Initech)
  { fromId: "E8", toId: "P6" }, { fromId: "E11", toId: "P6" }, { fromId: "E14", toId: "P6" }, { fromId: "E29", toId: "P6" }, { fromId: "E35", toId: "P6" },
  // P7 - Hades (Tyrell)
  { fromId: "E13", toId: "P7" }, { fromId: "E19", toId: "P7" }, { fromId: "E25", toId: "P7" }, { fromId: "E31", toId: "P7" }, { fromId: "E37", toId: "P7" },
  // P8 - Iris (Acme)
  { fromId: "E7", toId: "P8" }, { fromId: "E10", toId: "P8" }, { fromId: "E16", toId: "P8" }, { fromId: "E22", toId: "P8" }, { fromId: "E28", toId: "P8" },
  // P9 - Chronos (Wayne)
  { fromId: "E5", toId: "P9" }, { fromId: "E9", toId: "P9" }, { fromId: "E20", toId: "P9" }, { fromId: "E23", toId: "P9" },
  // P10 - Demeter (Umbrella)
  { fromId: "E19", toId: "P10" }, { fromId: "E37", toId: "P10" }, { fromId: "E42", toId: "P10" },
  // P11 - Helios (Stark)
  { fromId: "E11", toId: "P11" }, { fromId: "E13", toId: "P11" }, { fromId: "E23", toId: "P11" }, { fromId: "E31", toId: "P11" },
  // P12 - Hephaestus (Internal)
  { fromId: "E12", toId: "P12" }, { fromId: "E18", toId: "P12" }, { fromId: "E24", toId: "P12" }, { fromId: "E30", toId: "P12" },
  // P13 - Nemesis (Globex)
  { fromId: "E19", toId: "P13" }, { fromId: "E26", toId: "P13" }, { fromId: "E32", toId: "P13" }, { fromId: "E38", toId: "P13" }, { fromId: "E43", toId: "P13" },
  // P14 - Odysseus (Tyrell)
  { fromId: "E6", toId: "P14" }, { fromId: "E13", toId: "P14" }, { fromId: "E25", toId: "P14" }, { fromId: "E31", toId: "P14" }, { fromId: "E41", toId: "P14" }, { fromId: "E42", toId: "P14" },
  // P15 - Perseus (Umbrella)
  { fromId: "E20", toId: "P15" }, { fromId: "E26", toId: "P15" }, { fromId: "E32", toId: "P15" },
  // P16 - Thor (Stark)
  { fromId: "E11", toId: "P16" }, { fromId: "E35", toId: "P16" }, { fromId: "E28", toId: "P16" }, { fromId: "E34", toId: "P16" }
];

// HAS_SKILL Relationships (Employee -> Skill)
export const HAS_SKILL = [
  // Leadership & PMs
  { fromId: "E1", toId: "S11" }, { fromId: "E1", toId: "S12" }, { fromId: "E1", toId: "S19" },
  { fromId: "E27", toId: "S11" }, { fromId: "E27", toId: "S12" }, { fromId: "E27", toId: "S19" },
  { fromId: "E33", toId: "S11" }, { fromId: "E33", toId: "S12" }, { fromId: "E33", toId: "S19" },
  { fromId: "E39", toId: "S11" }, { fromId: "E39", toId: "S12" },
  { fromId: "E40", toId: "S12" }, { fromId: "E40", toId: "S11" },
  { fromId: "E44", toId: "S3" }, { fromId: "E44", toId: "S19" },
  { fromId: "E45", toId: "S11" }, { fromId: "E45", toId: "S18" },

  // Platform Core
  { fromId: "E2", toId: "S2" }, { fromId: "E2", toId: "S15" }, { fromId: "E2", toId: "S20" },
  { fromId: "E5", toId: "S2" }, { fromId: "E5", toId: "S15" }, { fromId: "E5", toId: "S16" },
  { fromId: "E8", toId: "S2" }, { fromId: "E8", toId: "S15" }, { fromId: "E8", toId: "S23" },
  { fromId: "E14", toId: "S2" }, { fromId: "E14", toId: "S16" },
  { fromId: "E20", toId: "S2" }, { fromId: "E20", toId: "S15" }, { fromId: "E20", toId: "S20" },

  // Graph Core
  { fromId: "E3", toId: "S4" }, { fromId: "E3", toId: "S5" }, { fromId: "E3", toId: "S15" },
  { fromId: "E6", toId: "S2" }, { fromId: "E6", toId: "S5" }, { fromId: "E6", toId: "S16" },
  { fromId: "E9", toId: "S4" }, { fromId: "E9", toId: "S5" }, { fromId: "E9", toId: "S20" },
  { fromId: "E15", toId: "S4" }, { fromId: "E15", toId: "S16" },
  { fromId: "E21", toId: "S2" }, { fromId: "E21", toId: "S5" },

  // Experience
  { fromId: "E4", toId: "S1" }, { fromId: "E4", toId: "S3" }, { fromId: "E4", toId: "S19" },
  { fromId: "E7", toId: "S3" }, { fromId: "E7", toId: "S1" },
  { fromId: "E10", toId: "S1" }, { fromId: "E10", toId: "S3" }, { fromId: "E10", toId: "S16" },
  { fromId: "E16", toId: "S1" }, { fromId: "E16", toId: "S16" },
  { fromId: "E22", toId: "S13" }, { fromId: "E22", toId: "S1" },
  { fromId: "E28", toId: "S1" }, { fromId: "E28", toId: "S3" }, { fromId: "E28", toId: "S15" },
  { fromId: "E34", toId: "S1" }, { fromId: "E34", toId: "S17" },

  // Solutions
  { fromId: "E11", toId: "S15" }, { fromId: "E11", toId: "S6" }, { fromId: "E11", toId: "S23" },
  { fromId: "E17", toId: "S15" }, { fromId: "E17", toId: "S6" }, { fromId: "E17", toId: "S16" },
  { fromId: "E23", toId: "S2" }, { fromId: "E23", toId: "S16" },
  { fromId: "E29", toId: "S2" }, { fromId: "E29", toId: "S15" }, { fromId: "E29", toId: "S6" },
  { fromId: "E35", toId: "S2" }, { fromId: "E35", toId: "S24" },

  // DevOps
  { fromId: "E12", toId: "S6" }, { fromId: "E12", toId: "S7" }, { fromId: "E12", toId: "S15" },
  { fromId: "E18", toId: "S7" }, { fromId: "E18", toId: "S21" }, { fromId: "E18", toId: "S6" },
  { fromId: "E24", toId: "S7" }, { fromId: "E24", toId: "S21" }, { fromId: "E24", toId: "S15" },
  { fromId: "E30", toId: "S7" }, { fromId: "E30", toId: "S21" },
  { fromId: "E36", toId: "S7" }, { fromId: "E36", toId: "S21" }, { fromId: "E36", toId: "S17" },

  // AI
  { fromId: "E13", toId: "S8" }, { fromId: "E13", toId: "S15" }, { fromId: "E13", toId: "S24" },
  { fromId: "E19", toId: "S8" }, { fromId: "E19", toId: "S22" }, { fromId: "E19", toId: "S14" },
  { fromId: "E25", toId: "S8" }, { fromId: "E25", toId: "S22" }, { fromId: "E25", toId: "S15" },
  { fromId: "E31", toId: "S2" }, { fromId: "E31", toId: "S8" }, { fromId: "E31", toId: "S16" },
  { fromId: "E37", toId: "S14" }, { fromId: "E37", toId: "S8" },
  { fromId: "E41", toId: "S9" }, { fromId: "E41", toId: "S8" },
  { fromId: "E42", toId: "S8" }, { fromId: "E42", toId: "S22" },

  // Security
  { fromId: "E26", toId: "S10" }, { fromId: "E26", toId: "S15" },
  { fromId: "E32", toId: "S10" }, { fromId: "E32", toId: "S7" },
  { fromId: "E38", toId: "S10" }, { fromId: "E38", toId: "S2" },
  { fromId: "E43", toId: "S10" }, { fromId: "E43", toId: "S18" }
];

// USES_TECHNOLOGY Relationships (Employee -> Technology)
export const USES_TECHNOLOGY = [
  // Platform
  { fromId: "E2", toId: "T3" }, { fromId: "E2", toId: "T4" }, { fromId: "E2", toId: "T7" },
  { fromId: "E5", toId: "T1" }, { fromId: "E5", toId: "T4" }, { fromId: "E5", toId: "T7" },
  { fromId: "E8", toId: "T3" }, { fromId: "E8", toId: "T7" }, { fromId: "E8", toId: "T13" },
  { fromId: "E14", toId: "T1" }, { fromId: "E14", toId: "T13" },
  { fromId: "E20", toId: "T3" }, { fromId: "E20", toId: "T4" }, { fromId: "E20", toId: "T7" },

  // Graph
  { fromId: "E3", toId: "T5" }, { fromId: "E3", toId: "T13" }, { fromId: "E3", toId: "T6" },
  { fromId: "E6", toId: "T1" }, { fromId: "E6", toId: "T5" }, { fromId: "E6", toId: "T12" },
  { fromId: "E9", toId: "T5" }, { fromId: "E9", toId: "T13" }, { fromId: "E9", toId: "T6" },
  { fromId: "E15", toId: "T13" }, { fromId: "E15", toId: "T12" },
  { fromId: "E21", toId: "T1" }, { fromId: "E21", toId: "T5" },

  // Experience
  { fromId: "E4", toId: "T10" }, { fromId: "E4", toId: "T11" },
  { fromId: "E7", toId: "T10" }, { fromId: "E7", toId: "T1" },
  { fromId: "E10", toId: "T1" }, { fromId: "E10", toId: "T10" }, { fromId: "E10", toId: "T11" },
  { fromId: "E16", toId: "T1" }, { fromId: "E16", toId: "T10" },
  { fromId: "E22", toId: "T1" }, { fromId: "E22", toId: "T10" },
  { fromId: "E28", toId: "T1" }, { fromId: "E28", toId: "T10" }, { fromId: "E28", toId: "T11" }, { fromId: "E28", toId: "T12" },
  { fromId: "E34", toId: "T1" }, { fromId: "E34", toId: "T10" },

  // Solutions
  { fromId: "E11", toId: "T6" }, { fromId: "E11", toId: "T7" }, { fromId: "E11", toId: "T1" },
  { fromId: "E17", toId: "T6" }, { fromId: "E17", toId: "T7" }, { fromId: "E17", toId: "T12" },
  { fromId: "E23", toId: "T1" }, { fromId: "E23", toId: "T13" },
  { fromId: "E29", toId: "T3" }, { fromId: "E29", toId: "T6" }, { fromId: "E29", toId: "T13" },
  { fromId: "E35", toId: "T4" }, { fromId: "E35", toId: "T1" },

  // Cloud
  { fromId: "E12", toId: "T6" }, { fromId: "E12", toId: "T8" }, { fromId: "E12", toId: "T14" },
  { fromId: "E18", toId: "T6" }, { fromId: "E18", toId: "T8" }, { fromId: "E18", toId: "T14" }, { fromId: "E18", toId: "T7" },
  { fromId: "E24", toId: "T7" }, { fromId: "E24", toId: "T8" }, { fromId: "E24", toId: "T14" },
  { fromId: "E30", toId: "T14" }, { fromId: "E30", toId: "T7" },
  { fromId: "E36", toId: "T8" }, { fromId: "E36", toId: "T14" }, { fromId: "E36", toId: "T7" },

  // AI
  { fromId: "E13", toId: "T2" }, { fromId: "E13", toId: "T9" }, { fromId: "E13", toId: "T7" },
  { fromId: "E19", toId: "T2" }, { fromId: "E19", toId: "T9" }, { fromId: "E19", toId: "T5" },
  { fromId: "E25", toId: "T2" }, { fromId: "T25", toId: "T9" }, { fromId: "E25", toId: "T7" },
  { fromId: "E31", toId: "T2" }, { fromId: "E31", toId: "T4" }, { fromId: "E31", toId: "T7" },
  { fromId: "E37", toId: "T2" }, { fromId: "E37", toId: "T13" },
  { fromId: "E41", toId: "T2" }, { fromId: "E41", toId: "T9" },
  { fromId: "E42", toId: "T2" }, { fromId: "E42", toId: "T9" },

  // Security
  { fromId: "E26", toId: "T7" }, { fromId: "E26", toId: "T4" },
  { fromId: "E32", toId: "T7" }, { fromId: "E32", toId: "T6" },
  { fromId: "E38", toId: "T3" }, { fromId: "E38", toId: "T7" },
  { fromId: "E43", toId: "T2" }, { fromId: "E43", toId: "T7" }
];

// CERTIFIED_IN Relationships (Employee -> Certification)
export const CERTIFIED_IN = [
  { fromId: "E2", toId: "CR1" }, { fromId: "E11", toId: "CR1" }, { fromId: "E12", toId: "CR1" }, { fromId: "E18", toId: "CR1" },
  { fromId: "E3", toId: "CR2" }, { fromId: "E5", toId: "CR2" }, { fromId: "E6", toId: "CR2" }, { fromId: "E9", toId: "CR2" },
  { fromId: "E12", toId: "CR3" }, { fromId: "E18", toId: "CR3" }, { fromId: "E24", toId: "CR3" },
  { fromId: "E11", toId: "CR4" }, { fromId: "E17", toId: "CR4" }, { fromId: "E29", toId: "CR4" },
  { fromId: "E18", toId: "CR5" }, { fromId: "E30", toId: "CR5" },
  { fromId: "E26", toId: "CR6" }, { fromId: "E32", toId: "CR6" }, { fromId: "E38", toId: "CR6" },
  { fromId: "E27", toId: "CR7" }, { fromId: "E33", toId: "CR7" }, { fromId: "E39", toId: "CR7" },
  { fromId: "E7", toId: "CR8" }, { fromId: "E33", toId: "CR8" }, { fromId: "E40", toId: "CR8" },
  { fromId: "E13", toId: "CR9" }, { fromId: "E19", toId: "CR9" }, { fromId: "E25", toId: "CR9" }
];

// FOR_CLIENT Relationships (Project -> Client)
export const FOR_CLIENT = [
  { fromId: "P1", toId: "C6" }, { fromId: "P11", toId: "C6" }, { fromId: "P16", toId: "C6" },
  { fromId: "P2", toId: "C1" }, { fromId: "P8", toId: "C1" },
  { fromId: "P4", toId: "C5" }, { fromId: "P9", toId: "C5" },
  { fromId: "P5", toId: "C2" }, { fromId: "P13", toId: "C2" },
  { fromId: "P6", toId: "C3" },
  { fromId: "P7", toId: "C7" }, { fromId: "P14", toId: "C7" },
  { fromId: "P10", toId: "C4" }, { fromId: "P15", toId: "C4" },
  { fromId: "P3", toId: "C1" }, { fromId: "P12", toId: "C1" }
];

// USES Relationships (Project -> Technology)
export const USES = [
  { fromId: "P1", toId: "T1" }, { fromId: "P1", toId: "T5" },
  { fromId: "P2", toId: "T1" }, { fromId: "P2", toId: "T10" }, { fromId: "P2", toId: "T11" },
  { fromId: "P3", toId: "T1" }, { fromId: "P3", toId: "T11" },
  { fromId: "P4", toId: "T6" }, { fromId: "P4", toId: "T7" }, { fromId: "P4", toId: "T8" }, { fromId: "P4", toId: "T14" },
  { fromId: "P5", toId: "T4" }, { fromId: "P5", toId: "T7" }, { fromId: "P5", toId: "T8" },
  { fromId: "P6", toId: "T3" }, { fromId: "P6", toId: "T13" },
  { fromId: "P7", toId: "T2" }, { fromId: "P7", toId: "T9" },
  { fromId: "P8", toId: "T1" }, { fromId: "P8", toId: "T10" },
  { fromId: "P9", toId: "T4" }, { fromId: "P9", toId: "T13" },
  { fromId: "P10", toId: "T2" }, { fromId: "P10", toId: "T13" },
  { fromId: "P11", toId: "T4" }, { fromId: "P11", toId: "T2" },
  { fromId: "P12", toId: "T7" }, { fromId: "P12", toId: "T8" }, { fromId: "P12", toId: "T14" },
  { fromId: "P13", toId: "T3" }, { fromId: "P13", toId: "T2" },
  { fromId: "P14", toId: "T2" }, { fromId: "P14", toId: "T9" }, { fromId: "P14", toId: "T5" },
  { fromId: "P15", toId: "T3" }, { fromId: "P15", toId: "T4" },
  { fromId: "P16", toId: "T4" }, { fromId: "P16", toId: "T10" }
];

// REQUIRES_SKILL Relationships (Project -> Skill)
export const REQUIRES_SKILL = [
  { fromId: "P1", toId: "S5" }, { fromId: "P1", toId: "S15" },
  { fromId: "P2", toId: "S1" }, { fromId: "P2", toId: "S3" },
  { fromId: "P3", toId: "S18" },
  { fromId: "P4", toId: "S6" }, { fromId: "P4", toId: "S7" },
  { fromId: "P5", toId: "S10" },
  { fromId: "P6", toId: "S23" }, { fromId: "P6", toId: "S20" },
  { fromId: "P7", toId: "S8" }, { fromId: "P7", toId: "S22" },
  { fromId: "P8", toId: "S13" }, { fromId: "P8", toId: "S1" },
  { fromId: "P9", toId: "S14" }, { fromId: "P9", toId: "S4" },
  { fromId: "P10", toId: "S14" },
  { fromId: "P11", toId: "S24" }, { fromId: "P11", toId: "S16" },
  { fromId: "P12", toId: "S7" }, { fromId: "P12", toId: "S21" },
  { fromId: "P13", toId: "S10" }, { fromId: "P13", toId: "S8" },
  { fromId: "P14", toId: "S5" }, { fromId: "P14", toId: "S22" },
  { fromId: "P15", toId: "S10" },
  { fromId: "P16", toId: "S24" }
];

// DEPENDS_ON Relationships (Project -> Project)
export const DEPENDS_ON = [
  { fromId: "P4", toId: "P1" },
  { fromId: "P6", toId: "P1" },
  { fromId: "P7", toId: "P1" },
  { fromId: "P8", toId: "P2" },
  { fromId: "P11", toId: "P4" },
  { fromId: "P13", toId: "P5" },
  { fromId: "P14", toId: "P7" },
  { fromId: "P16", toId: "P11" }
];

/**
 * Builds the idempotent list of Cypher queries to seed all data.
 * Node creation uses MERGE on id.
 * Relationship creation MATCHes endpoints and MERGEs the relationship.
 */
export function buildDataSeedSteps(): SeedStep[] {
  const steps: SeedStep[] = [];

  // 1. Clients
  CLIENTS.forEach(c => {
    steps.push({
      name: `seed:client:${c.id}`,
      cypher: `MERGE (n:Client {id: $id}) ON CREATE SET n.name = $name, n.industry = $industry, n.region = $region, n.since = $since, n.health = $health`,
      params: c
    });
  });

  // 2. Technologies
  TECHNOLOGIES.forEach(t => {
    steps.push({
      name: `seed:technology:${t.id}`,
      cypher: `MERGE (n:Technology {id: $id}) ON CREATE SET n.name = $name, n.category = $category, n.adoption = $adoption`,
      params: t
    });
  });

  // 3. Skills
  SKILLS.forEach(s => {
    steps.push({
      name: `seed:skill:${s.id}`,
      cypher: `MERGE (n:Skill {id: $id}) ON CREATE SET n.name = $name, n.category = $category, n.rarity = $rarity`,
      params: s
    });
  });

  // 4. Teams
  TEAMS.forEach(t => {
    steps.push({
      name: `seed:team:${t.id}`,
      cypher: `MERGE (n:Team {id: $id}) ON CREATE SET n.name = $name, n.department = $department, n.focus = $focus`,
      params: t
    });
  });

  // 5. Certifications
  CERTIFICATIONS.forEach(c => {
    steps.push({
      name: `seed:certification:${c.id}`,
      cypher: `MERGE (n:Certification {id: $id}) ON CREATE SET n.name = $name, n.issuer = $issuer`,
      params: c
    });
  });

  // 6. Projects
  PROJECTS.forEach(p => {
    steps.push({
      name: `seed:project:${p.id}`,
      cypher: `MERGE (n:Project {id: $id}) ON CREATE SET n.name = $name, n.code = $code, n.summary = $summary, n.status = $status, n.risk = $risk, n.progress = $progress, n.startedAt = $startedAt, n.targetAt = $targetAt`,
      params: { id: p.id, name: p.name, code: p.code, summary: p.summary, status: p.status, risk: p.risk, progress: p.progress, startedAt: p.startedAt, targetAt: p.targetAt }
    });
  });

  // 7. Employees
  EMPLOYEES.forEach(e => {
    steps.push({
      name: `seed:employee:${e.id}`,
      cypher: `MERGE (n:Employee {id: $id}) ON CREATE SET n.name = $name, n.role = $role, n.seniority = $seniority, n.department = $department, n.tenure = $tenure, n.location = $location, n.email = $email, n.experienceYears = $experienceYears, n.joinedAt = $joinedAt`,
      params: { id: e.id, name: e.name, role: e.role, seniority: e.seniority, department: e.department, tenure: e.tenure, location: e.location, email: e.email, experienceYears: e.experienceYears, joinedAt: e.joinedAt }
    });
  });

  // 8. WORKS_IN
  WORKS_IN.forEach(r => {
    steps.push({
      name: `rel:works_in:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Team {id: $toId}) MERGE (a)-[r:WORKS_IN]->(b)`,
      params: r
    });
  });

  // 9. REPORTS_TO
  REPORTS_TO.forEach(r => {
    steps.push({
      name: `rel:reports_to:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Employee {id: $toId}) MERGE (a)-[r:REPORTS_TO]->(b)`,
      params: r
    });
  });

  // 10. MENTORED
  MENTORED.forEach(r => {
    steps.push({
      name: `rel:mentored:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Employee {id: $toId}) MERGE (a)-[r:MENTORED]->(b)`,
      params: r
    });
  });

  // 11. WORKED_ON
  WORKED_ON.forEach(r => {
    steps.push({
      name: `rel:worked_on:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Project {id: $toId}) MERGE (a)-[r:WORKED_ON]->(b)`,
      params: r
    });
  });

  // 12. HAS_SKILL
  HAS_SKILL.forEach(r => {
    steps.push({
      name: `rel:has_skill:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Skill {id: $toId}) MERGE (a)-[r:HAS_SKILL]->(b)`,
      params: r
    });
  });

  // 13. USES_TECHNOLOGY
  USES_TECHNOLOGY.forEach(r => {
    // Fixed typo from DL list where fromId was T25 instead of E25
    const cleanFromId = r.fromId === "T25" ? "E25" : r.fromId;
    steps.push({
      name: `rel:uses_technology:${cleanFromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Technology {id: $toId}) MERGE (a)-[r:USES_TECHNOLOGY]->(b)`,
      params: { fromId: cleanFromId, toId: r.toId }
    });
  });

  // 14. CERTIFIED_IN
  CERTIFIED_IN.forEach(r => {
    steps.push({
      name: `rel:certified_in:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Employee {id: $fromId}), (b:Certification {id: $toId}) MERGE (a)-[r:CERTIFIED_IN]->(b)`,
      params: r
    });
  });

  // 15. FOR_CLIENT
  FOR_CLIENT.forEach(r => {
    steps.push({
      name: `rel:for_client:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Project {id: $fromId}), (b:Client {id: $toId}) MERGE (a)-[r:FOR_CLIENT]->(b)`,
      params: r
    });
  });

  // 16. USES
  USES.forEach(r => {
    steps.push({
      name: `rel:uses:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Project {id: $fromId}), (b:Technology {id: $toId}) MERGE (a)-[r:USES]->(b)`,
      params: r
    });
  });

  // 17. REQUIRES_SKILL
  REQUIRES_SKILL.forEach(r => {
    steps.push({
      name: `rel:requires_skill:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Project {id: $fromId}), (b:Skill {id: $toId}) MERGE (a)-[r:REQUIRES_SKILL]->(b)`,
      params: r
    });
  });

  // 18. DEPENDS_ON
  DEPENDS_ON.forEach(r => {
    steps.push({
      name: `rel:depends_on:${r.fromId}_to_${r.toId}`,
      cypher: `MATCH (a:Project {id: $fromId}), (b:Project {id: $toId}) MERGE (a)-[r:DEPENDS_ON]->(b)`,
      params: r
    });
  });

  return steps;
}
