// src/App.js
import React from 'react';
import Chat from './components/chat';  // Importing Chat component from the 'components' folder

const App = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Chat</h1>
      <Chat />  {/* Render the Chat component */}
    </div>
  );
};

export default App;
