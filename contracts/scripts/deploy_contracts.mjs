  import prompt from 'prompt';
import colors from 'colors';
import Web3 from 'web3';
import fs from 'fs';
import * as ethutil from '../../client/src/utils/ethutil.js';
import * as constants from '../../client/src/constants.js';
import HDWalletProvider from '@truffle/hdwallet-provider';
import * as gamedata from '../../client/src/gamedata/gamedata.json';
import * as LiftTicketABI from '../build/contracts/LiftTicket.sol/LiftTicket.json';

let web3;
let liftTicket;

const PROMPT_ON_DEVELOP = true
const DEPLOY_DATA_PATH = `../client/src/gamedata/deploy.${constants.ACTIVE_NETWORK.name}.json`

async function exec() {
  
  console.log(colors.cyan(`<< NETWORK: ${constants.ACTIVE_NETWORK.name} >>`).inverse)

  await initWeb3()

  // Retrieve deployment data for the active network.
  const deployData = loadDeployData(DEPLOY_DATA_PATH)

  // Determine which contracts need to be deployed.
  let count = 0;
  if(needsDeploy(deployData.liftTicket)) {
    count++
    console.log(colors.red(`(${count}) Will deploy LiftTicket.sol!`))
  }
  gamedata.default.levels.map(level => {
    if(needsDeploy(deployData[level.deployId])) {
      count++
      console.log(colors.cyan(`(${count}) Will deploy ${level.levelContract} (${level.name})`))
    }
  })

  if(count === 0) {
    console.log(colors.gray(`No actions to perform, exiting.`));
    return;
  }

  if(await confirmDeployment()) {
    await deployContracts(deployData)
    //storeDeployData(DEPLOY_DATA_PATH, deployData)
    console.log("Done");
    return;
  }
}

exec()
.then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

async function deployContracts(deployData) {

  let from = constants.ADDRESSES[constants.ACTIVE_NETWORK.name];
  if(!from) from = (await web3.eth.getAccounts())[0];
  console.log("FROM: ", from)

  // Deploy/retrieve liftTicket contract
  const LiftTicket = await ethutil.getTruffleContract(LiftTicketABI.default, {from})

  const props = {
    gasPrice: await web3.eth.getGasPrice() * 10,
    gas: 4500000
  };

  if(needsDeploy(deployData.liftTicket)) {
		console.log(deployData);
    console.log(`Deploying LiftTicket.sol...`);
    try {
      liftTicket = await LiftTicket.new(props);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    console.log(colors.yellow(`  LiftTicket: ${liftTicket.address}`));
    deployData.liftTicket = liftTicket.address;
  } else {
    console.log('Using deployed LiftTicket.sol:', deployData.liftTicket);
    liftTicket = await LiftTicket.at(deployData.liftTicket)
  }

  // Sweep levels
  for (const level of gamedata.default.levels) {
    // console.log('level: ', level);
    if(needsDeploy(deployData[level.deployId])) {
      console.log(`Deploying ${level.levelContract}, deployId: ${level.deployId}...`);

      // Deploy contract
      const LevelABI = JSON.parse(fs.readFileSync(`./build/contracts/levels/${level.levelContract}/${withoutExtension(level.levelContract)}.json`, 'utf-8'))
      const Contract = await ethutil.getTruffleContract(LevelABI, {from})
      const contract = await Contract.new(...level.deployParams, props)

      console.log(colors.yellow(`  ${level.name}: ${contract.address}`));
      deployData[level.deployId] = contract.address
      console.log(colors.gray(`  storing deployed id: ${level.deployId} with address: ${contract.address}`));

      // Register level in LiftTicket contract
      console.log(`  Registering level ${level.levelContract} in LiftTicket.sol...`)
      const tx = await liftTicket.registerLevel(contract.address, props);
      console.log(`Registered ${level.levelContract}!`)
      // console.log(tx)
      storeDeployData(DEPLOY_DATA_PATH, deployData);
    } else {
      console.log(`Using deployed ${level.levelContract}...`);
    }
  };

}

// ----------------------------------
// Utils
// ----------------------------------

function withoutExtension(str) {
  return str.split('.')[0]
}

function needsDeploy(deployAddress) {
  console.log(`address is: ${deployAddress}`);
  if(constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) return true
  return deployAddress === undefined || deployAddress === 'x'
}

function initWeb3() {
  return new Promise(async (resolve, reject) => {

    let provider
    if(constants.ACTIVE_NETWORK === constants.NETWORKS.LOCAL) {
      const providerUrl = `${constants.ACTIVE_NETWORK.url}:${constants.ACTIVE_NETWORK.port}`
      console.log(colors.gray(`connecting web3 to '${providerUrl}'...`));
      provider = new Web3.providers.HttpProvider(providerUrl);
    } else {
      provider = new HDWalletProvider(
        constants.ACTIVE_NETWORK.privKey,
        constants.ACTIVE_NETWORK.url
      )
    }

    web3 = new Web3(provider)

    web3.eth.net.isListening((err, res) => {
      if(err) {
        console.log('error connecting web3:', err);
        reject()
        return
      }
      console.log(colors.gray(`web3 connected: ${res}\n`));
      ethutil.setWeb3(web3)
      resolve()
    })
  })
}

function loadDeployData(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'))
  }
  catch(err){
    console.log(`err is ${err}`);
    return {}
  }
}

function storeDeployData(path, deployData) {
  console.log(colors.green(`Writing updated deploy data: ${path}`))
  return fs.writeFileSync(path, JSON.stringify(deployData, null, 2), 'utf8')
}

function confirmDeployment() {
  return new Promise((resolve, reject) => {
    if(PROMPT_ON_DEVELOP || constants.ACTIVE_NETWORK !== constants.NETWORKS.LOCAL) {
      const options = {
        properties: {
          confirmDeployment: {
            description: `Confirm deployment? (y/n)`
          }
        }
      }

      prompt.start()
      prompt.get(options, (err, res) => {
        if (err) return reject(err)
        resolve(res.confirmDeployment === 'y')
      })
    } else {
      resolve(true)
    }
  })
}
