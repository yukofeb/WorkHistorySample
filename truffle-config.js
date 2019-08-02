var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MNEMONIC;
var url = process.env.INFURAURL;

module.exports = {
    networks: {

      development: {
        host: "127.0.0.1",
        port: 7545,
        network_id: "*" // Match any network id
        //gas:4712388
      },

      ropsten: {
        provider: function() {
          return new HDWalletProvider(
            mnemonic,
            url     // set your infura url
          );
        },
        network_id: 3,
        // gas: 5000000
      }
  }
}
