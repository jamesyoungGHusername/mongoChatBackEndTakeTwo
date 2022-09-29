import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          {/* <Board /> */}
          <ChatDisplay />
          <ChatDisplay />
          
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

class MessageEditor extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        value: '',
        data:null,
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.callBackendAPI = this.callBackendAPI.bind(this);
      console.log(props.refresh);
      
    }
    handleChange(event) {
      console.log("changed")
      this.setState({value: event.target.value});
    }
    handleSubmit(event){
      event.preventDefault();
      console.log(this.state.value);
      this.setState({value:''});
      this.callBackendAPI();
    }
    async callBackendAPI(){
      const response = await fetch('/api/channels',
        {
          headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          }
        }
      );
      const body = await response.json();
      console.log(body);
      return body;
    };
    

  render(){
      return(
          <form id="form" action="" onSubmit={this.handleSubmit}>
              <input type="text" value={this.state.value} onChange={this.handleChange} id="input" autoComplete="off" /><button>Send</button>
          </form>
      );
  }
}

class ChatDisplay extends React.Component{
  constructor(props){
      super(props);
      this.state = {value: 'test',messages:[]};
      this.messageList = [];
      
  }
  
  ChatListItems(messages){
      console.log(messages);
      return messages.map((message) => <li key={message}>{message}</li>)
  }
  RefeshChat(){
    console.log("refreshing chat");
  }

  render(){
      return(
          <div>
              <ul>
                  {this.ChatListItems(this.state.messages)}
              </ul>
              <MessageEditor refresh={this.RefreshChat}/>
          </div>
          
      );
  }
}



// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
