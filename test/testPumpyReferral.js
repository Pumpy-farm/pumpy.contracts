const helper = require("./../helpers/index.js");

const PMP = artifacts.require("PMP");
const TT = artifacts.require("TT");
const PumpyFarm = artifacts.require("PumpyFarm");
const StratLock = artifacts.require("StratLock");
const ReferralStratLock = artifacts.require("ReferralStratLock");
const PumpyReferral = artifacts.require("PumpyReferral");

contract('Contracts', (accounts) => {
    it('Mint 1000 tokens to Account 0', async () => {
        const pmpInst = await TT.deployed();
        await pmpInst.mint(accounts[0], 1000);
        const balance = await pmpInst.balanceOf(accounts[0]);
        assert.equal(balance, 1000, "Error");
    });
    it('Mint 1000 tokens to Account 2', async () => {
        const pmpInst = await TT.deployed();
        await pmpInst.mint(accounts[2], 1000);
        const balance = await pmpInst.balanceOf(accounts[2]);
        assert.equal(balance, 1000, "Error");
    });
    it('Transfer ownership to PumpyFarm', async () => {
        const pmpInst = await PMP.deployed();
        await pmpInst.transferOwnership(PumpyFarm.address);
        const owner = await pmpInst.owner();
        assert.equal(owner, PumpyFarm.address, "Error");
    });
    it('Increase Allowance for Referral', async () => {
        const ALLOWANCE = 999999999999;
        const pmpInst = await TT.deployed();
        const pumpyReferralInst = await PumpyReferral.deployed();
        await pmpInst.increaseAllowance(pumpyReferralInst.address, ALLOWANCE);
        const allowance = await pmpInst.allowance(accounts[0], pumpyReferralInst.address);
        assert.equal(ALLOWANCE, allowance, "Error");
    });
    it('Increase Allowance for Referral Account 2', async () => {
        const ALLOWANCE = 999999999999;
        const pmpInst = await TT.deployed();
        const pumpyReferralInst = await PumpyReferral.deployed();
        await pmpInst.increaseAllowance(pumpyReferralInst.address, ALLOWANCE, {from: accounts[2]});
        const allowance = await pmpInst.allowance(accounts[2], pumpyReferralInst.address);
        assert.equal(ALLOWANCE, allowance, "Error");
    });
    it('Add StratLock', async () => {
        const stratLockInst = await StratLock.deployed();
        const pumpyFarmInst = await PumpyFarm.deployed();
        const pmpInst = await TT.deployed(); 

        await pumpyFarmInst.add(1, pmpInst.address, false, stratLockInst.address);
        const poolLength = await pumpyFarmInst.poolLength();
        assert.equal(poolLength, 1, "Error");
    });
    it('Set up Referal', async () => {
        const pumpyReferral = await PumpyReferral.deployed();
        const referralStratLockInst = await ReferralStratLock.deployed();
        await pumpyReferral.setStrategy(0, referralStratLockInst.address);
        await pumpyReferral.setTreasure(accounts[1]);
    });
    it('Deposit', async () => {
        const pumpyReferral = await PumpyReferral.deployed();
        await pumpyReferral.deposit(accounts[2], 0, 100);
        await helper.advanceTimeAndBlock(6000);
        console.log((await pumpyReferral.pendingPMP(0, accounts[0])).toString())
    });
    it('Deposit Account 2', async () => {
        const pumpyReferral = await PumpyReferral.deployed();
        const pmpInst = await TT.deployed();
        await pumpyReferral.deposit('0x0000000000000000000000000000000000000000', 0, 100, {from: accounts[2]});
        console.log(await pmpInst.balanceOf(accounts[2]))
        console.log(await pumpyReferral.pendingPMP(0, accounts[2]))
    });
    it('Withdraw', async () => {
        const ttInst = await TT.deployed();
        const pmpInst = await PMP.deployed();
        const pumpyReferral = await PumpyReferral.deployed();
        console.log((await pumpyReferral.pendingPMP(0, accounts[0])).toString())
        await debug(pumpyReferral.withdraw(0, 100));
        const treasurebalance = await pmpInst.balanceOf(accounts[2]);
        console.log(treasurebalance.toString())
        const balance = await ttInst.balanceOf(accounts[0]);
        assert.equal(balance, 1001, "Error");
    });
});
