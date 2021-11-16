import hre from "hardhat";

async function verifyContract(address: string, constructorArguments = []) {
  console.log(`veryifing ${address}`);
  try {
    await hre.run("verify:verify", {
      address: address,
      constructorArguments,
    });
  } catch (error) {
    // if it was already verified, it’s like a success, so let’s move forward and save it
    console.error(`Error verifying: ${error}`);
    return;
  }
}

async function exec(): Promise<void> {
  let deployment: any;
  try {
    //@ts-ignore
    deployment = await import(
      `../../client/src/gamedata/deploy.${hre.network.name}.json`
    );
  } catch (e) {
    throw e;
  }

  for (const k of Object.keys(deployment.default)) {
    const address = deployment[k];
    await verifyContract(address);
  }
  return;
}

exec()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
