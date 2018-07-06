const fs = require("fs");
const path = require("path");
const {
    updateFileHeader,
  getPackageJsonVersion,
  replaceFileHeaderVersion
} = require("../bin/cli");

test("Get version from package.json", () => {
  expect(getPackageJsonVersion()).toMatch(/(\d+\.){1,3}\d+/);
});

test("Replace version in file header", () => {
  ["css", "php"].forEach(ext => {
    let beforeFilePath = path.resolve(
      __dirname,
      `samples/${ext}-file-header.before`
    );
    let afterFilePath = path.resolve(
      __dirname,
      `samples/${ext}-file-header.after`
    );

    let afterFile = fs.readFileSync(afterFilePath, "utf8");

    expect(replaceFileHeaderVersion(beforeFilePath, "1.1.0")).toEqual(
      afterFile
    );
  });
});

test("Update file with new version in the file header", () => {
  let refFilePath = path.resolve(__dirname, 'samples/css-file-header.before');
  let refFile = fs.readFileSync(refFilePath, "utf8");
  let resultFilePath = path.resolve(__dirname, 'samples/css-file-header.after');
  let resultFile = fs.readFileSync(resultFilePath, "utf8");
  let tempFilePath = './test/file-header.temp';
  let tempFile = ''

  fs.writeFileSync(tempFilePath, refFile, "utf8");
  tempFile = fs.readFileSync(tempFilePath, "utf8");
  updateFileHeader(tempFilePath, "1.1.0");
  tempFile = fs.readFileSync(tempFilePath, "utf8");
  fs.unlinkSync(tempFilePath)

  expect(tempFile).toEqual(resultFile);
});
