const fs = require('fs');
const path = require('path');

const PAGES_DIR = path.join(__dirname, '../../src/pages');

const files = [
  'EmployeesView.tsx',
  'EmployeeDetailView.tsx',
  'ProjectsView.tsx',
  'ProjectDetailView.tsx',
  'TeamsView.tsx',
  'SkillsView.tsx',
  'SkillDetailView.tsx',
  'TechnologiesView.tsx',
  'TechnologyDetailView.tsx',
  'ClientsView.tsx',
  'ClientDetailView.tsx',
  'InsightsView.tsx',
  'SettingsView.tsx'
];

files.forEach(file => {
  const filePath = path.join(PAGES_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace router imports
  content = content.replace(
    /import\s+([\s\S]*?)\s+from\s+['"]@tanstack\/react-router['"]/g,
    (match, imports) => {
      // Remove createFileRoute, keep Link or other elements, add useParams, useNavigate, etc.
      let cleaned = imports.replace(/createFileRoute\s*,?\s*/g, '').trim();
      cleaned = cleaned.replace(/,\s*$/g, '');
      const list = cleaned ? cleaned.split(',').map(s => s.trim()) : [];
      if (!list.includes('Link')) {
        // if useParams or something is needed, we will import it below
      }
      
      const newImports = ['Link', 'useParams', 'useNavigate', 'useLocation'];
      const filtered = [...new Set([...list.filter(x => x && x !== 'createFileRoute'), ...newImports])];
      
      return `import { ${filtered.join(', ')} } from "react-router-dom"`;
    }
  );

  // 2. Replace Route.useParams() or useParams({ from: ... })
  content = content.replace(/Route\.useParams\(\)/g, 'useParams()');
  content = content.replace(/useParams\(\s*\{\s*from:\s*['"][^'"]+['"]\s*\}\s*\)/g, 'useParams()');

  // 3. Replace Route.useSearch() or useSearch({ from: ... })
  content = content.replace(/Route\.useSearch\(\)/g, 'useLocation()');
  content = content.replace(/useSearch\(\s*\{\s*from:\s*['"][^'"]+['"]\s*\}\s*\)/g, 'useLocation()');

  // 4. Handle Route definitions:
  // e.g. export const Route = createFileRoute(...)({ ... component: ComponentName })
  const routeRegex = /export\s+const\s+Route\s*=\s*createFileRoute\([\s\S]*?\)\(\{\s*([\s\S]*?)\s*\}\);?/g;
  content = content.replace(routeRegex, (match, body) => {
    // Find component name in body
    const compMatch = body.match(/component\s*:\s*(\w+)/);
    if (compMatch) {
      return `// Route defined here\nexport default ${compMatch[1]};`;
    }
    return '';
  });

  // 5. Replace links with params, e.g.
  // to="/employees/$employeeId" params={{ employeeId: employee.id }}
  // to="/skills/$skillId" params={{ skillId: s.id }}
  content = content.replace(
    /to\s*=\s*["']([^"']+)["']\s+params\s*=\s*\{\{\s*(\w+)\s*:\s*([^}]+)\s*\}\}/g,
    (match, to, paramName, paramValue) => {
      // Convert to="/employees/$employeeId" to={`/employees/${employee.id}`}
      let cleanTo = to;
      // Strip any $paramName in the path
      cleanTo = cleanTo.replace(new RegExp(`\\$${paramName}`, 'g'), '');
      if (cleanTo.endsWith('/')) {
        cleanTo = cleanTo.slice(0, -1);
      }
      return `to={\`${cleanTo}/\${${paramValue.trim()}}\`}`;
    }
  );
  
  // Handled double nested links, e.g. to="/employees/$employeeId" params={{ employeeId: ... }}
  content = content.replace(
    /Link\s+to\s*=\s*["']([^"']+)["']\s+params\s*=\s*\{\s*(\w+)\s*:\s*([^}]+)\s*\}/g,
    (match, to, paramName, paramValue) => {
      let cleanTo = to.replace(new RegExp(`\\$${paramName}`, 'g'), '');
      if (cleanTo.endsWith('/')) {
        cleanTo = cleanTo.slice(0, -1);
      }
      return `Link to={\`${cleanTo}/\${${paramValue.trim()}}\`}`;
    }
  );

  // If there are links like to="/teams" with params or as never, clean them
  content = content.replace(/to\s*=\s*\{["']\/teams["']\s+as\s+never\}/g, 'to="/teams"');
  content = content.replace(/to\s*=\s*\{["']\/network["']\s+as\s+never\}/g, 'to="/network"');
  content = content.replace(/to\s*=\s*\{["']\/insights["']\s+as\s+never\}/g, 'to="/insights"');
  content = content.replace(/to\s*=\s*\{["']\/settings["']\s+as\s+never\}/g, 'to="/settings"');
  content = content.replace(/to\s*=\s*\{["']\/employees["']\s+as\s+never\}/g, 'to="/employees"');
  content = content.replace(/to\s*=\s*\{["']\/projects["']\s+as\s+never\}/g, 'to="/projects"');
  content = content.replace(/to\s*=\s*\{["']\/skills["']\s+as\s+never\}/g, 'to="/skills"');
  content = content.replace(/to\s*=\s*\{["']\/technologies["']\s+as\s+never\}/g, 'to="/technologies"');
  content = content.replace(/to\s*=\s*\{["']\/clients["']\s+as\s+never\}/g, 'to="/clients"');

  content = content.replace(/to\s*=\s*["']\/network["']\s*as\s*never/g, 'to="/network"');
  content = content.replace(/to\s*=\s*["']\/settings["']\s*as\s*never/g, 'to="/settings"');
  content = content.replace(/to\s*=\s*["']\/insights["']\s*as\s*never/g, 'to="/insights"');
  
  // Specific fix for file imports from @/
  content = content.replace(/@\/components\/entity\/entity-chip/g, '@/components/entity/entity-chip');
  content = content.replace(/@\/components\/graph\/graph-canvas/g, '@/components/graph/graph-canvas');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed: ${file}`);
});
console.log('All pages processed successfully.');
