import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

//const client = new W3CWebSocket('ws://127.0.0.1:8000');
let currentChannelId = '';
//import io from "socket.io-client"; 
const validLink = new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
// import App from './App';
// import reportWebVitals from './reportWebVitals';

class ChannelDisplay extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      channelList:[],
      openChannelIds:[],
    };
  }
  componentDidMount() {
    this.getChannelList();
  }
  async getChannelList(){
    const response = await fetch('/api/channels/',
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
      this.setState({channelList:body});
  }
  channelOptionItems(list){
    return list.map((item) => <a onClick={() => this.openChannel(item._id,item.channelName)} key={item._id}>{item.channelName}</a>)
  }
  openChannel(id,name){
    console.log(id);
    let l = this.state.openChannelIds;
    let alreadyOpen=false;
    for(const item of l){
      if(id == item){
        alreadyOpen=true;
      }
    }
    if(!alreadyOpen){
      l.push({id,name});
      this.setState({openChannelIds:l})
      currentChannelId = id;
      this.loadedChannels(this.state.openChannelIds);
    }
    
    
  }
  loadedChannels(list){
      console.log("list "+list);
      return list.map((id) => <ChatDisplay chatId={id.id} key={id.id} name={id.name}/>)
  }
  render(){
    return(
      <div>
        <div className="dropdown">
        <button className="dropbtn">Open Channel</button>
        <div className="dropdown-content">
          {this.channelOptionItems(this.state.channelList)}
          
        </div>
        </div>
        {this.loadedChannels(this.state.openChannelIds)}
      </div>
      
      );
  }
}


class ChatDisplay extends React.Component{
  constructor(props){
      super(props);
      this.state = {value: 'test',messages:[]};
      this.messageList = [];
      this.refeshChat = this.refeshChat.bind(this);
      this.client = new W3CWebSocket('ws://127.0.0.1:8000');
  }
  componentDidMount() {
    this.client.onopen = () => {
      console.log('WebSocket Client Connected');
      this.refeshChat();
    };
    this.client.onmessage = (message) => {
      console.log(message.data);
      this.refeshChat();
    
    };
  }
  chatListItems(messages){
      console.log(messages);
      
      return messages.map((message) => {
        if(validLink.test(message.text)){
          return <li key={message._id}>{message.username}: <a href={message.text}>{message.text}</a></li>
        }else{
          return <li key={message._id}>{message.username}: {message.text}</li>
        }
        }
        )
  }
  async refeshChat(){
    console.log("refreshing chat");
    const response = await fetch('/api/channels/'+this.props.chatId+'/messages',
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
            <h1>{this.props.name}</h1>
            <div className='scrollable-div'>
              <a className='loadMore'>Load Older Messages</a>
              
              <ul>
                  {this.chatListItems(this.state.messages)}
              </ul>
            </div>
            <MessageEditor chatId={this.props.chatId} refresh={this.refeshChat} client={this.client}/>
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
      this.props.client.send(JSON.stringify({message:this.state.value,type:"userEvent",username:"james young"}));
      this.setState({value:''});
      //this.props.refresh();
    }
    async send(message){
      const response = await fetch('/api/channels/'+this.props.chatId+'/messages',
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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<div><ChannelDisplay /></div>);
