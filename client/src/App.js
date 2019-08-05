import React from "react"
import Sample from "./contracts/Sample"
import web3  from './web3/provider'

export default class App extends React.Component{

  state = {
    contract: '',
    accounts: '',
    storageValue: '',
    newValue: ''
  }

  componentDidMount = async () => {
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Sample.networks[networkId];
    //console.log("deployedNetwork.address: ",deployedNetwork.address)
    //console.log(`accounts: ${accounts}`)
    //console.log(`networkId: ${networkId}`)
    //console.log('Sample.abi: ',JSON.stringify(Sample.abi))
    const instance = new web3.eth.Contract(
      Sample.abi,
      deployedNetwork.address
    );
    this.setState({contract:instance, accounts:accounts})
    
    // storageValueを取得
    await instance.methods.getValue().call({from:accounts[0]})
    .then(result => {
      this.setState({ storageValue: result})
      console.log(`getValue: ${result}`)
    }).catch(error => {
      console.log(`error: ${error}`)
    })
  };

  handleChange(event){
    this.setState({newValue: event.target.value});
  }

  async handleSubmit(event){
    event.preventDefault();
    const { accounts, contract } = this.state;
    console.log('a')
    await contract.methods.setValue(this.state.newValue).send({from: accounts[0]})
      .on('transactionHash', (hash) => {
        console.log('hash: ',hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt)
        this.setState({ storageValue: this.state.newValue });
      })
      .on('receipt', (receipt) => {
        console.log('receipt: ',receipt)
      })
      .catch(error => {
        console.log('set error', error);
      });
  }

  runExample = async () => {
    const { accounts, contract } = await this.state;
    await contract.methods.getValue().call({from:accounts[0]})
    .then(result => {
      console.log('getValue: ',result)
      this.setState({ storageValue: result });
    })

    console.log("this.state: ",this.state)
  };

  render() {
    return (
      <div>
        <p>storageValue: {this.state.storageValue}</p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.newValue} onChange={this.handleChange.bind(this)} />
          <input type="submit" value="Submit" />
        </form>
        <button onClick={() => this.runExample()}>SET</button>
        <p>accounts: {this.state.accounts}</p>
      </div>
    )
  }
}
