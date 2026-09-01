const PATTERNS = [
  { key: "CSE – AI & ML", re: /\bcse\b.*\b(aiml|ai ml|ai&ml|artificial intelligence)\b|\b(aiml|ai ml)\b.*\bcse\b/ },
  { key: "CSE – Data Science", re: /\bcse\b.*\b(ds|data science)\b|\b(ds|data science)\b.*\bcse\b/ },
  { key: "ECE – AI & ML", re: /\bece\b.*\b(aiml|ai ml|ai&ml)\b|\b(aiml|ai ml)\b.*\bece\b/ },
  { key: "ECE – Data Science", re: /\bece\b.*\b(ds|data science)\b|\b(ds|data science)\b.*\bece\b/ },
  { key: "AI & ML", re: /\baiml\b|\bai ml\b|ai&ml|artificial intelligence/ },
  { key: "Data Science", re: /\bdata science\b|\bds\b/ },
  { key: "CSE", re: /\bcse\b|computer science/ },
  { key: "ECE", re: /\bece\b|electronics and communication/ },
  { key: "EEE", re: /\beee\b|electrical/ },
  { key: "Mechanical", re: /\bmech\b/ },
  { key: "Civil", re: /\bcivil\b/ },
  { key: "IT", re: /\bit\b|information technology/ },
  { key: "MBA", re: /\bmba\b/ },
  { key: "BCA", re: /\bbca\b/ },
  { key: "Design", re: /\bdesign\b/ },
];

const titleCase = (s) => s.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export function normalizeBranch(raw) {
  const original = String(raw || "").trim();
  const s = original.toLowerCase().replace(/[.,\-_()/&]+/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return { key: "Undecided", label: "Undecided", original: "" };

  let degree = "B.Tech";
  if (/\bintegrated\b/.test(s)) degree = "M.Tech Integrated";
  else if (/\bm tech\b|\bmtech\b/.test(s)) degree = "M.Tech";

  const matched = PATTERNS.find((p) => p.re.test(s));
  const key = matched ? matched.key : titleCase(s);
  return { key, label: `${degree} ${key}`, original };
}

export function groupBranches(records = []) {
  const groups = {};
  records.forEach((item) => {
    const n = normalizeBranch(item.degreeWithBranch);
    let g = groups[n.key];
    if (!g) {
      g = groups[n.key] = { key: n.key, label: n.label, count: 0, variants: {} };
    }
    g.count++;
    const v = n.original || "Unspecified";
    g.variants[v] = (g.variants[v] || 0) + 1;
  });
  return Object.values(groups)
    .map((g) => ({ ...g, variants: Object.entries(g.variants).sort((a, b) => b[1] - a[1]) }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}