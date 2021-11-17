const PrivacyFactory = artifacts.require('./levels/PrivacyFactory.sol')
const Privacy = artifacts.require('./attacks/Privacy.sol')

const LiftTicket = artifacts.require('./LiftTicket.sol')
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers')
const utils = require('../utils/TestUtils')


contract('Privacy', function(accounts) {

  let liftTicket
  let level
  let instance
  let player = accounts[0]

  before(async function() {
    liftTicket = await LiftTicket.new();
    level = await PrivacyFactory.new()
    await liftTicket.registerLevel(level.address)
    instance = await utils.createLevelInstance(
      liftTicket, level.address, player, Privacy,
      {from: player, value: web3.utils.toWei('1', 'ether')}
    )
  });

  describe('instance', function() {

    it('should start locked', async function() {
      assert.equal(await instance.locked(), true);
    });

    it('should not unlock with any key', async function() {
      await expectRevert.unspecified(
        instance.unlock("0x123")
      );
    });

    it('should unlock with the proper key', async function() {
      
      // Read storage.
      for(let i = 0; i < 6; i++) {
        //console.log(await web3.eth.getStorageAt(instance.address, i));
      }

      // Read contract storage.
      const dataEntry = await web3.eth.getStorageAt(instance.address, 5);
      //console.log("data entry " + dataEntry)
      const key = '0x' + dataEntry.substring(2, 34);

      // Unlock.
      await instance.unlock(key);
      assert.equal(await instance.locked(), false);

      // Factory check (should pass)
      const completed = await utils.submitLevelInstance(
        liftTicket,
        level.address,
        instance.address,
        player
      );
      assert.equal(completed, true);
    });
  });

});
