const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const USAGE = "flatten.ts CONTRACT_TO_FLATTEN.sol";

async function exec() {
  const contractPath = process.argv[2];
  console.log(`${contractPath}`);
  if (!contractPath) {
    console.error(USAGE);
    process.exit(1);
  }
  const contractName = path.basename(contractPath).split(".sol")[0];
  const outputFile = path.join("flattened", contractName + ".flat");

  const lines = execSync(`npx hardhat flatten ${contractPath}`)
    .toString()
    .split("\n");

  let licenseCount = 0;

  // filter out all license identifiers except the first one
  const filteredLines = lines.map((line: ScrollSetting) => {
    let _line = line;
    if (line.startsWith("// SPDX-License-Identifier")) {
      licenseCount += 1;
      if (licenseCount > 1) {
        _line = "";
      }
    }
    return _line;
  });

  const sourceString = filteredLines.join("\n");
  fs.writeFileSync(outputFile, sourceString);
}

exec()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
