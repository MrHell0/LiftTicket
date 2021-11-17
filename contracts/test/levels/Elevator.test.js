const ElevatorFactory = artifacts.require('./levels/ElevatorFactory.sol')
const ElevatorAttack = artifacts.require('./attacks/ElevatorAttack.sol')
const Elevator = artifacts.require('./levels/Elevator.sol')

const LiftTicket = artifacts.require('./LiftTicket.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Elevator', function(accounts) {

  let liftTicket
  let level
  let owner = accounts[1]
  let player = accounts[0]

  before(async function() {
    liftTicket = await LiftTicket.new();
    level = await ElevatorFactory.new()
    await liftTicket.registerLevel(level.address)
  });

  it('should fail if the player didnt solve the level', async function() {
    const instance = await utils.createLevelInstance(liftTicket, level.address, player, Elevator)
    const completed = await utils.submitLevelInstance(
      liftTicket,
      level.address,
      instance.address,
      player
    )

    assert.isFalse(completed)
  });

  it('should allow the player to solve the level', async function() {
    const instance = await utils.createLevelInstance(liftTicket, level.address, player, Elevator)

    const attacker = await ElevatorAttack.new()
    await attacker.attack(instance.address)

    const completed = await utils.submitLevelInstance(
      liftTicket,
      level.address,
      instance.address,
      player
    )

    assert.isTrue(completed)
  });
});
