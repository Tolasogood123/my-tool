/** Templates and composition logic for a downloadable .gitignore file. */

export interface GitignoreTemplate {
  id: string;
  label: string;
  lines: string[];
}

export const GITIGNORE_TEMPLATES: GitignoreTemplate[] = [
  {
    id: "node",
    label: "Node.js",
    lines: [
      "node_modules/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      ".npm/",
      ".yarn/",
      "coverage/",
      ".nyc_output/",
    ],
  },
  {
    id: "nextjs",
    label: "Next.js / React",
    lines: [
      "/.next/",
      "/out/",
      "/build/",
      "/dist/",
      ".env*.local",
      "next-env.d.ts",
      "*.tsbuildinfo",
    ],
  },
  {
    id: "python",
    label: "Python",
    lines: [
      "__pycache__/",
      "*.py[cod]",
      ".venv/",
      "venv/",
      "env/",
      ".pytest_cache/",
      ".mypy_cache/",
      "*.egg-info/",
      ".coverage",
    ],
  },
  {
    id: "java",
    label: "Java / Maven / Gradle",
    lines: [
      "*.class",
      "target/",
      "build/",
      ".gradle/",
      "*.jar",
      "*.war",
      ".settings/",
      ".classpath",
      ".project",
    ],
  },
  {
    id: "dotnet",
    label: ".NET",
    lines: [
      "bin/",
      "obj/",
      "*.user",
      "*.suo",
      ".vs/",
      "packages/",
      "TestResults/",
      "project.lock.json",
    ],
  },
  {
    id: "go",
    label: "Go",
    lines: ["*.exe", "*.test", "*.out", "vendor/", "go.work", ".gopath/"],
  },
  {
    id: "rust",
    label: "Rust",
    lines: ["/target/", "Cargo.lock", "*.rs.bk", "**/*.rs.bk"],
  },
  {
    id: "ruby",
    label: "Ruby / Rails",
    lines: [
      "*.gem",
      ".bundle/",
      "vendor/bundle/",
      "log/",
      "tmp/",
      "public/assets/",
      "config/database.yml",
    ],
  },
  {
    id: "php",
    label: "PHP / Composer",
    lines: ["vendor/", "composer.phar", ".phpunit.result.cache", "*.log", "/public/uploads/"],
  },
  {
    id: "macos",
    label: "macOS",
    lines: [".DS_Store", ".AppleDouble", ".LSOverride", "._*", ".Spotlight-V100", ".Trashes"],
  },
  {
    id: "windows",
    label: "Windows",
    lines: ["Thumbs.db", "Thumbs.db:encryptable", "ehthumbs.db", "Desktop.ini", "$RECYCLE.BIN/", "*.tmp"],
  },
  {
    id: "linux",
    label: "Linux",
    lines: ["*~", ".fuse_hidden*", ".directory", ".Trash-*", ".nfs*"],
  },
  {
    id: "vscode",
    label: "VS Code",
    lines: [".vscode/*", "!.vscode/settings.json", "!.vscode/extensions.json", "*.code-workspace"],
  },
  {
    id: "jetbrains",
    label: "JetBrains IDEs",
    lines: [".idea/", "*.iml", "*.ipr", "*.iws", "out/", ".gradle/"],
  },
  {
    id: "docker",
    label: "Docker",
    lines: ["*.log", ".dockerignore.bak", "docker-compose.override.yml", "data/", ".env"],
  },
];

export interface GitignoreOptions {
  selectedIds: string[];
  includeHeader?: boolean;
}

/**
 * Combines the selected templates into one file, de-duplicating repeated rules
 * while keeping comments and section headings readable.
 */
export function buildGitignore(options: GitignoreOptions): string {
  const { selectedIds, includeHeader = true } = options;
  const selected = GITIGNORE_TEMPLATES.filter((template) => selectedIds.includes(template.id));
  if (selected.length === 0) return "";

  const lines: string[] = [];
  if (includeHeader) {
    lines.push("# Generated with the TolaDev .gitignore Generator", "# Review these rules before committing.", "");
  }

  const seen = new Set<string>();
  for (const template of selected) {
    if (lines.length > 0 && lines[lines.length - 1] !== "") lines.push("");
    lines.push(`# --- ${template.label} ---`);
    for (const raw of template.lines) {
      const key = raw.trim();
      if (!key) continue;
      // Keep repeated comments but de-duplicate actual ignore rules.
      if (!key.startsWith("#") && seen.has(key)) continue;
      if (!key.startsWith("#")) seen.add(key);
      lines.push(raw);
    }
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}
