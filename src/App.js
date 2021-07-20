import './App.css';
import React from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await lottery.methods.getBalance().call();
    this.setState({ manager, players, balance });
  }

  enterLottery = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'Success!' });
  }

  pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Picking winner...' });

    try {
      await lottery.methods.pickWinner().send({ from: accounts[0] });
    } catch {
      this.setState({ message: 'Error: Are you the contract manager?' });
    }

    this.setState({ message: 'Success!' });
  }

  render() {
    return (
      <div className='App'>
        <h2>LOTTERY CONTRACT</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are {this.state.players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} amount of ether!
        </p>

        <hr />

        <form onSubmit={this.enterLottery}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to submit </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />

        <button onClick={this.pickWinner}>Randomly pick a winner!</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
