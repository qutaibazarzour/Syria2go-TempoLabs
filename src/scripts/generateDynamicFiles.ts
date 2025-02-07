import fs from "fs";
import path from "path";

const COMPONENTS_DIR = path.join(process.cwd(), "src/components");
const DYNAMIC_DIR = path.join(
  process.cwd(),
  "src/tempobook/dynamic/src/components",
);

function generateDynamicFile(componentName: string, componentPath: string) {
  const dynamicContent = `import ${componentName} from "./../../../../../components/${componentPath}";

const TempoComponent = () => {
  return <${componentName} />;
}

TempoComponent.getLayout = (page) => page;

export default TempoComponent;`;

  const dynamicDir = path.join(DYNAMIC_DIR, componentName);
  if (!fs.existsSync(dynamicDir)) {
    fs.mkdirSync(dynamicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dynamicDir, "index.jsx"), dynamicContent);
}

function scanComponents(dir: string) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== "ui") {
        // Skip ui directory
        scanComponents(fullPath);
      }
    } else if (file.endsWith(".tsx") && !file.endsWith(".stories.tsx")) {
      const componentName = path.basename(file, ".tsx");
      const relativePath = path.relative(COMPONENTS_DIR, fullPath);
      generateDynamicFile(componentName, relativePath);
    }
  });
}

// Create dynamic directory if it doesn't exist
if (!fs.existsSync(DYNAMIC_DIR)) {
  fs.mkdirSync(DYNAMIC_DIR, { recursive: true });
}

// Start scanning components
scanComponents(COMPONENTS_DIR);
