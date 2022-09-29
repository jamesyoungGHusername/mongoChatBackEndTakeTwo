import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import io from "socket.io-client"; 

// import App from './App';
// import reportWebVitals from './reportWebVitals';

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          {/* <Board /> */}
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
      this.send = this.send.bind(this);
      console.log(props.refresh);
    }
    handleChange(event) {
      console.log("changed")
      this.setState({value: event.target.value});
    }
    handleSubmit(event){
      event.preventDefault();
      console.log(this.state.value);
      if(this.state.value != ""){
        this.send(this.state.value);
      }
      this.setState({value:''});
      this.props.refresh();
    }
    async send(message){
      const response = await fetch('/api/channels/633506bff3062b9dde088655/messages',
        {
          method:"POST",
          body:JSON.stringify({messageText:message,
          username:"James Young"}),
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
      this.refeshChat = this.refeshChat.bind(this);
  }
  
  chatListItems(messages){
      console.log(messages);
      return messages.map((message) => <li key={message._id}>{message.username}: {message.text}</li>)
  }
  async refeshChat(){
    console.log("refreshing chat");
    const response = await fetch('/api/channels/633506bff3062b9dde088655/messages',
        {
          method:"GET",
          headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          }
        }
      );
    const body = await response.json();
    console.log(body);
    let messageList = [];
    this.setState({messages:[]});
    for(const message of body){
      messageList.push({_id:message._id,text:message.messageText,username:message.username});
    }
    this.setState({messages:messageList});
  }

  render(){
      return(
          <div>
            <div className='scrollable-div'>
              <ul>
                  {this.chatListItems(this.state.messages)}
              </ul>
            </div>
            <MessageEditor refresh={this.refeshChat}/>
          </div>
          
      );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
