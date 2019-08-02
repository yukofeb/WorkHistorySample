import React, { Component } from 'react';
import UserHistory from "../contracts/UserHistory"
import web3  from '../web3/provider'
import './UserHistories.css';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

const styles = makeStyles(theme => ({
  paper: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  //container: {
  //  display: 'flex',
  //  flexWrap: 'wrap',
  //},
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const HistoryMatrix = (props) => {
  return (
    <TableRow key={props.startDate}>
      <TableCell>{ props.company }</TableCell>
      <TableCell>{ props.startDate }</TableCell>
      <TableCell>{ props.endDate }</TableCell>
      <TableCell>{ props.role }</TableCell>
    </TableRow>
  );
};

class UserHistories extends Component {
  
  state = {
    contract: '',
    accounts: '',
    newCompany: '',
    newStartDate: '',
    newEndDate: '',
    newRole: '',
    historyLength: '',
    myHistories: [],
  }

  componentDidMount = async () => {
    this.companyChange = this.companyChange.bind(this);
    this.startDateChange = this.startDateChange.bind(this);
    this.endDateChange = this.endDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getHist = this.getHist.bind(this);

    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    //const deployedNetwork = UserHistory.networks[networkId];
    const deployedNetwork = UserHistory.networks[5777];
    console.log(`networkId: ${networkId}`);
    console.log(`deployedNetwork: ${deployedNetwork}`);
    const instance = new web3.eth.Contract(
      UserHistory.abi,
      deployedNetwork.address
    );
    this.setState({contract:instance, accounts:accounts})
    //await this.getHist()
  };

  companyChange(event){
    this.setState({newCompany: event.target.value});
  };
  
  startDateChange(event){
    this.setState({newStartDate: event.target.value});
  };
  
  endDateChange(event){
    this.setState({newEndDate: event.target.value});
  };
  
  roleChange(event){
    this.setState({newRole: event.target.value});
  };
  
  async handleSubmit(event){
    event.preventDefault();
    const { accounts, contract } = this.state;
    await contract.methods.setHistory(this.state.newCompany, this.state.newStartDate, this.state.newEndDate, this.state.newRole).send({from: accounts[0]})
      .on('transactionHash', (hash) => {
        console.log('hash: ',hash)
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt)
        this.getHist()
      })
      .on('receipt', (receipt) => {
        console.log('receipt: ',receipt)
      })
      .catch(error => {
        console.log('set error', error);
      });
  }

  async getHist(event) {
    const { accounts, contract } = await this.state;
    console.log(this.state)
    contract.methods.getOwnHistoryIds(accounts[0]).call({from:accounts[0]})
    .then(result => {
      console.log(result)
      this.setState({ historyLength: result.length });
      return result
    }).then(result => {
      this.setState({ myHistories: []})
      for (var i = 0; i < result.length; i++) {
         contract.methods.getOwnHistories(i).call({from: accounts[0]})
        .then(rst => {
          this.setState({ myHistories: this.state.myHistories.concat(rst)})
        }).then(rst => {
          console.log(this.state.myHistories)
        })
      }
    })
  }

  render() {
    return (
      <div className="UserHistories">
        <header className="UserHistories-header">
          <h1 className="UserHistories-title">マイページ</h1>
        </header>

        <h5 className="UserHistories-intro">
          新規登録
        </h5>

        <form onSubmit={this.handleSubmit}>
          <TextField
            id="company"
            label="company"
            className={styles.textField}
            value={this.state.newCompany}
            onChange={this.companyChange.bind(this)}
          />
          <TextField
            id="startdate"
            label="startDate"
            type="date"
            value={this.state.newStartDate}
            onChange={this.startDateChange.bind(this)}
            className={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="enddate"
            label="endDate"
            type="date"
            value={this.state.newendDate}
            onChange={this.endDateChange.bind(this)}
            className={styles.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="role"
            label="role"
            className={styles.textField}
            value={this.state.newRole}
            onChange={this.roleChange.bind(this)}
          />
          <Button type="submit" variant="contained" className="UserHistories-button" color="primary">登録</Button>
        </form>

        <h5 className="UserHistories-intro">
          職歴一覧
        </h5>

        <Button size="small" className="UserHistories-button" color="primary" onClick={() => this.getHist()}>Reload</Button>
        <Paper className={styles.paper}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>startDate</TableCell>
                <TableCell>endDate</TableCell>
                <TableCell>role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.myHistories.map((item) => (
                <HistoryMatrix key={item[1]} company={item[0]} startDate={item[1]} endDate={item[2]} role={item[3]} />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default UserHistories;