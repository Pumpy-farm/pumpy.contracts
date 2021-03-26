const PMP = artifacts.require("PMP");
const TT = artifacts.require("TT");
const PumpyFarm = artifacts.require("PumpyFarm");
const StratLock = artifacts.require("StratLock");
const ReferralStratStaking = artifacts.require("ReferralStratStaking");
const PumpyReferral = artifacts.require("PumpyReferral");
const StratStaking = artifacts.require("StratStaking");

module.exports = async function(deployer) {
    await deployer.deploy(PMP);
    await deployer.deploy(TT);
    await deployer.deploy(PumpyFarm, PMP.address);
    await deployer.deploy(StratLock, PumpyFarm.address, PMP.address, TT.address);
    await deployer.deploy(ReferralStratStaking);
    await deployer.deploy(PumpyReferral, PumpyFarm.address, PMP.address);
    await deployer.deploy(StratStaking, PumpyFarm.address, PMP.address, PMP.address);
};
