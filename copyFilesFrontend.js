const {
  srcPathsPolyglot,
  basePathPolyglot,
  importantFiles,
} = require("./frontend_polyglot");

const fs = require("fs");
const path = require("path");

function copyFilesToSingleFile(srcPaths, outputFile, basePath) {
  console.time(`Copying to ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile, { flags: "w" });

  srcPaths.forEach((srcPath) => {
    const absoluteSrcPath = path.resolve(basePath, srcPath);
    const baseDir = absoluteSrcPath.endsWith(path.sep)
      ? absoluteSrcPath.slice(0, -1)
      : absoluteSrcPath;
    if (fs.statSync(absoluteSrcPath).isDirectory()) {
      copyDirectory(baseDir, baseDir, writeStream);
    } else if (fs.statSync(absoluteSrcPath).isFile()) {
      const relativePath = `./${path.relative(basePath, absoluteSrcPath)}`;
      copyFile(absoluteSrcPath, relativePath, writeStream);
    }
  });

  writeStream.end(() => {
    console.timeEnd(`Copying to ${outputFile}`);
  });
}

function copyDirectory(baseDir, currentDir, writeStream) {
  const files = fs.readdirSync(currentDir);
  files.forEach((file) => {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      copyDirectory(baseDir, fullPath, writeStream);
    } else if (fs.statSync(fullPath).isFile()) {
      const relativePath = `./${path.relative(baseDir, fullPath)}`;
      copyFile(fullPath, relativePath, writeStream);
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

copyFilesToSingleFile(srcPathsPolyglot, "all.md", basePathPolyglot);
copyFilesToSingleFile(importantFiles, "important.md", basePathPolyglot);

console.timeEnd("Total time");

// node copyFiles.js
