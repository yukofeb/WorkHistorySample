var Sample = artifacts.require("Sample.sol");
var UserHistory = artifacts.require("UserHistory.sol");

module.exports = function(deployer) {
  deployer.deploy(Sample);
  deployer.deploy(UserHistory);
};
