import React, { useState, useEffect } from 'react';
import './chat.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); 

function Chat() {
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [typing, setTyping] = useState(false); 

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

  
    socket.on('userTyping', (name) => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000); 
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('userTyping');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        username,
        text: newMessage,
      };
      socket.emit('sendMessage', message); 
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  const handleChangeName = () => {
    const newName = prompt('Enter your new name:');
    if (newName) {
      setUsername(newName);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    socket.emit('typing', username);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        {username ? (
          <div>
            <h3>{username}'s Chat</h3>
            <button className="change-name-button" onClick={handleChangeName}>
              Change Name
            </button>
          </div>
        ) : (
          <button onClick={handleChangeName}>Enter your name</button>
        )}
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.username === username ? 'sent' : 'received'}`}
          >
            <strong>{message.username}: </strong>
            {message.text}
          </div>
        ))}
        {typing && <div className="typing-indicator">Someone is typing...</div>}
      </div>

      {username && (
        <div className="chat-form">
          <input
            className="message-input"
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button className="send-button" onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default Chat;
