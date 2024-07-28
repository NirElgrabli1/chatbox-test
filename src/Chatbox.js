// src/Chatbox.js
import React, { useState } from 'react';
import axios from 'axios';
import { FaFemale, FaRobot } from 'react-icons/fa';  // Use a female icon and a robot icon
import './Chatbox.css';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsPending(true);

    setTimeout(async () => {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-3.5-turbo", // Replace with your model name
            messages: [...messages, userMessage],
          },
          {
            headers: {
              Authorization: `Bearer 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`, // Replace with your API key
              'Content-Type': 'application/json',
            }
          }
        );

        const botMessage = response.data.choices[0].message;
        setMessages([...messages, userMessage]); // Show user message first
        setTimeout(() => {
          setMessages([...messages, userMessage, { role: 'assistant', content: 'Typing...' }]);
        }, 500); // Delay the "Typing..." message by 0.5 seconds
        setTimeout(() => {
          setMessages([...messages, userMessage, { role: 'assistant', content: botMessage }]);
        }, 1000); // Show the actual response after another 0.5 seconds (total 1 second)
      } catch (error) {
        console.error('Error sending message:', error);
        // Optionally, handle the error state
      } finally {
        setIsPending(false);
      }
    }, 500); // Ensure the pending animation lasts at least 0.5 seconds
  };

  return (
    <div className={`chatbox-wrapper ${isOpen ? 'open' : 'closed'}`}>
      <div className="chatbox-toggle" onClick={() => setIsOpen(!isOpen)}>
        Chat
      </div>
      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbox-message ${msg.role === 'user' ? 'user' : 'bot'}`}
              >
                {msg.role === 'user' && <FaFemale className="user-icon" />}
                {msg.role === 'assistant' && <FaRobot className="bot-icon" />}
                <p><strong>{msg.role === 'user' ? 'You' : 'מייעץ אלקטרוני'}:</strong> {msg.content}</p>
              </div>
            ))}
            {isPending && (
              <div className="chatbox-message bot">
                <FaRobot className="bot-icon" />
                <p><strong>מייעץ אלקטרוני:</strong> Typing...</p>
              </div>
            )}
          </div>
          <div className="chatbox-input-container">
            <input
              className="chatbox-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? handleSend() : null)}
              placeholder="Type your message..."
            />
            <button className="chatbox-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
