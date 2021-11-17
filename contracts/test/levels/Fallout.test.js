const FalloutFactory = artifacts.require('./levels/FalloutFactory.sol')
const Fallout = artifacts.require('./attacks/Fallout.sol')

const LiftTicket = artifacts.require('./LiftTicket.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')

contract('Fallout', function(accounts) {

  let liftTicket
  let level
  let owner = accounts[1]
  let player = accounts[0]

  beforeEach(async function() {
    liftTicket = await LiftTicket.new();
    level = await FalloutFactory.new()
    await liftTicket.registerLevel(level.address)
    //console.log(liftTicket.address, level.address)
  });

  it('should allow the player to solve the level', async function() {

    const instance = await utils.createLevelInstance(
      liftTicket, level.address, player, Fallout,
      {from: player}
    )

    assert.equal(await instance.owner(), 0x0)

    await instance.Fal1out()
    assert.equal(await instance.owner(), player)

    // Factory check
    const ethCompleted = await utils.submitLevelInstance(
      liftTicket,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)
  });

});
