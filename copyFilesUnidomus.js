// src/copyFiles.js

const fs = require("fs");
const path = require("path");

function copyFilesToSingleFile(
  srcPaths,
  outputFile,
  basePath,
  filterFn = () => true
) {
  console.time(`Copying to ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile, { flags: "w" });

  srcPaths.forEach((srcPath) => {
    const absoluteSrcPath = path.resolve(basePath, srcPath);
    if (fs.existsSync(absoluteSrcPath)) {
      if (fs.statSync(absoluteSrcPath).isDirectory()) {
        copyDirectory(absoluteSrcPath, absoluteSrcPath, writeStream, filterFn);
      } else if (fs.statSync(absoluteSrcPath).isFile()) {
        const relativePath = `./${path.relative(basePath, absoluteSrcPath)}`;
        if (filterFn(relativePath)) {
          copyFile(absoluteSrcPath, relativePath, writeStream);
        }
      }
    } else {
      console.error(`Path does not exist: ${absoluteSrcPath}`);
    }
  });

  writeStream.end(() => {
    console.timeEnd(`Copying to ${outputFile}`);
  });
}

function copyDirectory(baseDir, currentDir, writeStream, filterFn) {
  const files = fs.readdirSync(currentDir);
  files.forEach((file) => {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      copyDirectory(baseDir, fullPath, writeStream, filterFn);
    } else if (fs.statSync(fullPath).isFile()) {
      const relativePath = `./${path.relative(baseDir, fullPath)}`;
      if (filterFn(relativePath)) {
        copyFile(fullPath, relativePath, writeStream);
      }
    }
  });
}

function copyFile(filePath, relativePath, writeStream) {
  writeStream.write(`# ${relativePath}\n`);
  const data = fs.readFileSync(filePath, "utf-8");
  writeStream.write(data + "\n\n");
}

// Example usage with timing:
console.time("Total time");

const paths = ["src"]; // Ensure this is the correct relative path
const basePath = "/Users/panciut/new_fronted"; // Ensure this is the correct base path

// Copy all files
copyFilesToSingleFile(paths, "all.md", basePath);

// Copy files excluding *.styles.ts
copyFilesToSingleFile(
  paths,
  "without_styles.md",
  basePath,
  (relativePath) => !relativePath.endsWith(".styles.ts")
);

// Copy only *.styles.ts files
copyFilesToSingleFile(paths, "only_styles.md", basePath, (relativePath) =>
  relativePath.endsWith(".styles.ts")
);

console.timeEnd("Total time");
