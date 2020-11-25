const fs = require("fs");
const chalk = require("chalk");
const commandLineArgs = require("command-line-args");

const { transformStyles } = require("./core");

const optionDefinitions = [
  {
    name: "filePath",
    alias: "f",
    type: String,
    description: "输入文件路径",
  },
  {
    name: "outDir",
    alias: "o",
    type: String,
    description: "输出路径",
  },
];

const runOptions = {
  filePath: "./index.css",
  outDir: "./dist",
  ...commandLineArgs(optionDefinitions),
};

function validateFile(url) {
  const hasFile = fs.existsSync(url);
  if (!hasFile) {
    const msg = "未查询到指定目录";
    console.log(chalk.red(msg));
  }
  return hasFile;
}

function eazyKey(json) {
  let result = "";
  result = json.replace(/{"/g, "{").replace(/,"/g, ",").replace(/":/g, ":");
  return result;
}

function main() {
  try {
    const { filePath, outDir } = runOptions;
    if (!validateFile(outDir)) return
    const classNames = fs.readFileSync(`${__dirname}/${filePath}`, "utf-8");
    const styleSheet = transformStyles(classNames);
    const code = `const styles = ${eazyKey(JSON.stringify(styleSheet))}`;
    fs.writeFileSync(`${__dirname}/${outDir}/styles.js`, code, (err) =>
      console.log(chalk.red(err))
    );
    console.log(chalk.green(`转换完成! ${__dirname}/${outDir}`));
  } catch (error) {
    console.error(chalk.red(error));
  }
}

main();
