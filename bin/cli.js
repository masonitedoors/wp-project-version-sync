#! /usr/bin/env node

const fs = require("fs");
const path = require("path");
const program = require("commander");
const chalk = require("chalk");
const wpThemeVersionPattern = /^((?:<\?php\n)?\/\*\*?(?:.|\n)*Version:)(\s*)([\d.]*)((?:.|\n)+)/;

run();

function run() {
  let paths = [];
  let errors = [];
  let srcFileDefault = "package.json";
  let srcFileVal = srcFileDefault;

  program
    .option(
      "-s, --src [srcFile]",
      "Source of version. Default is your project's package.json"
    )
    .option(
      "-p, --path <path...> [paths]",
      "Relative path to your plugin or theme's file header."
    )
    .parse(process.argv);

  srcFileVal = program.srcFile || srcFileDefault;
  pathVal = program.path || null;
  pathsVal = program.args || null;

  if (srcFileVal !== srcFileDefault) {
    console.error(
      chalk.red("package.json is the only accepted source at the moment.")
    );
  }

  if (!pathVal) {
    console.error(chalk.red("No paths were specified."));
    return false;
  }

  console.log(
    `Source: ${srcFileVal} ${
      srcFileDefault === srcFileVal ? chalk.green("(Default)") : ""
    }\n`
  );

  paths = paths.concat(pathVal, pathsVal);

  paths.forEach(p => {
    if (fs.existsSync(p)) {
      updateFileHeader(pathVal);
    } else {
      errors.push(`${p} could not be found.`)
    }
  });

  if (errors.length > 0) {
    console.error(chalk.red(errors.join('\n')));
    console.log(chalk.yellow('Done with errors.'))
  } else {
    console.log(chalk.green('Done without errors.'))
  }
}

function updateFileHeader(pathToFile, version = getPackageJsonVersion()) {
  let newContent = replaceFileHeaderVersion(pathToFile, version);
  fs.writeFileSync(pathToFile, newContent, "utf8");
}

function getPackageJsonVersion() {
  const packageJson = require(path.resolve(process.cwd(), "package.json"));
  return packageJson.version;
}

function replaceFileHeaderVersion(pathToFile, version) {
  const replaceOutput = function(match, before, whitespace, oldVersion, after) {
    return before + whitespace + version + after;
  };
  const file = fs.readFileSync(pathToFile, "utf8");
  return file.replace(wpThemeVersionPattern, replaceOutput);
}

module.exports = {
  updateFileHeader,
  getPackageJsonVersion,
  replaceFileHeaderVersion
};
