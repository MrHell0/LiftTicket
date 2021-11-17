/*eslint no-undef: "off"*/
const LiftTicket = artifacts.require('./LiftTicket.sol');
const DummyLevel = artifacts.require('./levels/DummyLevel.sol');
const Dummy = artifacts.require('./levels/Dummy.sol');
const FallbackFactory = artifacts.require('./levels/FallbackFactory.sol');
const Manufactured = artifacts.require('./levels/Manufactured.sol');
const { expectRevert } = require('openzeppelin-test-helpers')
const utils = require('./utils/TestUtils')

contract('LiftTicket', function(accounts) {

  // ----------------------------------
  // Before
  // ----------------------------------

  let owner = accounts[0];
  let player = accounts[1];
  let liftTicket;

  before(async function() {
    liftTicket = await LiftTicket.new();
  });

  it(`should not allow a player to manufacture a solution instance`, async function() {

    const level = await FallbackFactory.new()
    await liftTicket.registerLevel(level.address, {from: owner});

    // Instead of solving the instance, the player manufactures an instance
    // with the desired state:
    // const instance = await utils.createLevelInstance(liftTicket, level.address, player, Fallback)
    const instance = await Manufactured.new()

    await expectRevert.unspecified(liftTicket.submitLevelInstance(instance.address, {from: player}))
  });

  it(`should not allow player A to use player's B instance to complete a level`, async function() {

    const level = await DummyLevel.new()
    await liftTicket.registerLevel(level.address, {from: owner});

    const instance = await utils.createLevelInstance(liftTicket, level.address, player, Dummy)
    await instance.setCompleted(true);
    const completed = await instance.completed();
    assert.equal(completed, true)

    await expectRevert.unspecified(liftTicket.submitLevelInstance(instance.address, {from: accounts[2]}))
  });

  it(`should not allow a player to generate 2 completion logs with the same instance`, async function() {

    const level = await DummyLevel.new()
    await liftTicket.registerLevel(level.address, {from: owner});

    const instance = await utils.createLevelInstance(liftTicket, level.address, player, Dummy)
    await instance.setCompleted(true);
    const completed = await instance.completed();
    assert.equal(completed, true)

    const ethCompleted = await utils.submitLevelInstance(
      liftTicket,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)

    // Resubmit instance
    await expectRevert.unspecified(liftTicket.submitLevelInstance(instance.address))
  });

  it(`should provide instances and verify completion`, async function() {

    const level = await DummyLevel.new()
    await liftTicket.registerLevel(level.address, {from: owner});

    const instance = await utils.createLevelInstance(liftTicket, level.address, player, Dummy)
    await instance.setCompleted(true);
    const completed = await instance.completed();
    assert.equal(completed, true)

    const ethCompleted = await utils.submitLevelInstance(
      liftTicket,
      level.address,
      instance.address,
      player
    )
    assert.equal(ethCompleted, true)
  });

  it(`should provide instances and verify non-complettion`, async function() {

    const level = await DummyLevel.new()
    await liftTicket.registerLevel(level.address, {from: owner});

    const instance = await utils.createLevelInstance(liftTicket, level.address, player, Dummy)

    const completed = await utils.submitLevelInstance(
      liftTicket,
      level.address,
      instance.address,
      player
    )
    assert.equal(completed, false)
  });

  it(`should not provide instances to non-registered level factories`, async function() {
    const level = await DummyLevel.new()
    await expectRevert.unspecified(liftTicket.createLevelInstance(level.address, {from: player}))
  });

  it(`should not allow anyone but the owner to upload a level`, async function() {
    const level = await DummyLevel.new()
    await expectRevert.unspecified(liftTicket.registerLevel(level.address, {from: player}))
  });
});
