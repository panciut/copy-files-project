const fs = require("fs");
const path = require("path");
const ignore = require("ignore");
const { basePathPolyglot, srcPathsPolyglot } = require("./backend_polyglot");

function loadGitignore(dir) {
  const gitignorePath = path.join(dir, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    return ignore().add(gitignoreContent);
  }
  return ignore();
}

function generateTree(dirPath, ignoreDirs = []) {
  const ig = loadGitignore(dirPath);

  function isIgnored(filePath) {
    const relativePath = path.relative(dirPath, filePath);
    if (!relativePath) {
      return false; // Do not ignore the base directory itself
    }
    return (
      ig.ignores(relativePath) || ignoreDirs.includes(path.basename(filePath))
    );
  }

  function createTree(currentPath) {
    const stats = fs.statSync(currentPath);
    const info = {
      path: currentPath,
      name: path.basename(currentPath),
    };

    if (stats.isDirectory() && !isIgnored(currentPath)) {
      info.type = "directory";
      info.children = fs
        .readdirSync(currentPath)
        .map((child) => createTree(path.join(currentPath, child)))
        .filter((child) => child !== null);
    } else if (stats.isFile() && !isIgnored(currentPath)) {
      info.type = "file";
    } else {
      return null; // Ignore this file or directory
    }

    return info;
  }

  return createTree(dirPath);
}

function generateTreeFromPaths(baseDir, filePaths) {
  const tree = {
    name: path.basename(baseDir),
    type: "directory",
    children: [],
  };

  const nodes = {};

  filePaths.forEach((filePath) => {
    const parts = filePath.split(path.sep);
    let currentNode = tree;

    parts.forEach((part, index) => {
      if (!nodes[part]) {
        const newNode = {
          name: part,
          type: index === parts.length - 1 ? "file" : "directory",
          children: [],
        };

        if (index === parts.length - 1) {
          newNode.path = path.join(baseDir, filePath);
        }

        currentNode.children.push(newNode);
        nodes[part] = newNode;
      }
      currentNode = nodes[part];
    });
  });

  return tree;
}

function printTree(node, indent = "", isLast = true) {
  if (!node) return;
  console.log(`${indent}${isLast ? "└── " : "├── "}${node.name}`);

  if (node.type === "directory") {
    const newIndent = indent + (isLast ? "    " : "│   ");
    node.children.forEach((child, index, array) =>
      printTree(child, newIndent, index === array.length - 1)
    );
  }
}

function writeTreeToFile(node, writeStream, indent = "", isLast = true) {
  if (!node) return;
  writeStream.write(`${indent}${isLast ? "└── " : "├── "}${node.name}\n`);

  if (node.type === "directory") {
    const newIndent = indent + (isLast ? "    " : "│   ");
    node.children.forEach((child, index, array) =>
      writeTreeToFile(child, writeStream, newIndent, index === array.length - 1)
    );
  }
}

function writeToFile(text, filePath) {
  const outputFilePath = filePath; // Change this to the desired output file path
  const writeStream = fs.createWriteStream(outputFilePath, { flags: "w" });

  writeTreeToFile(text, writeStream);
  writeStream.end();
}

// Example usage:
const ignoreDirs = ["node_modules", "venv", ".git"]; // Add directories you want to ignore

writeToFile(generateTree(basePathPolyglot, ignoreDirs), "tree.md");

const srcPath = path.join(basePathPolyglot, "src");
writeToFile(generateTree(srcPath, ignoreDirs), "treeSrc.md");

const treeFromPaths = generateTreeFromPaths(basePathPolyglot, srcPathsPolyglot);
writeToFile(treeFromPaths, "treePaths.md");

// Print to console
// printTree(tree);

// Write to file

module.exports = {
  generateTree,
  generateTreeFromPaths,
  printTree,
  writeTreeToFile,
};

// node generateTree.js
