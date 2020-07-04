const fs = require("fs");

exports.read = (dir, options) => {
  let stat;
  try {
    stat = fs.statSync(dir);
  } catch (e) {
    throw new Error(`"${dir}" can't be opened as a directory.`);
  }

  const root = {
    type: "directory",
    name: dir,
    children: readDirectory(dir, 1, options)
  };

  return root;
};

const path = require("path");

const readDirectory = (dir, depth, options) => {
  if (options.level < depth) {
    return [];
  }

  const dirents = fs.readdirSync(dir, {
    withFileTypes: true
  });

  const nodes = [];
  dirents.forEach(dirent => {
    if (dirent.name.startsWith(".")) {
      return;
    }
    if (dirent.isFile()) {
      nodes.push({
        type: "file",
        name: dirent.name
      });
    } else if (dirent.isDirectory()) {
      nodes.push({
        type: "directory",
        name: dirent.name,
        children: readDirectory(path.join(dir, dirent.name), depth + 1, options)
      });
    }
  });

  return nodes;
};