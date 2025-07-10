import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [textInput, setTextInput] = useState('');
  const recognition = useRef(null);
  const [speechApiSupported, setSpeechApiSupported] = useState(true);
  const [conversationState, setConversationState] = useState('idle');
  const [tempPhoneNumber, setTempPhoneNumber] = useState('');

  const speak = useCallback((text) => {
    setMessages((prev) => [...prev, { text, sender: 'bot' }]);
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleUserMessage = useCallback(async (message) => {
    const sanitizedMessage = message.replace(/\.$/, '').trim();
    setMessages((prev) => [...prev, { text: sanitizedMessage, sender: 'user' }]);
    setTextInput('');

    if (conversationState === 'awaiting_phone_number') {
      setTempPhoneNumber(sanitizedMessage);
      setConversationState('awaiting_validation');
      speak("What are the last three digits of your document?");
    } else if (conversationState === 'awaiting_validation') {
      try {
        const response = await fetch('http://127.0.0.1:8000/block-line/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: tempPhoneNumber, last_three_digits: sanitizedMessage }),
        });
        const data = await response.json();
        if (response.ok) {
          speak(`Your line has been blocked. Your ticket number is ${data.ticket_id}.`);
          setConversationState('idle');
        } else {
          speak(`${data.detail}. Please try again. What are the last three digits of your document?`);
        }
      } catch (error) {
        speak("Sorry, I couldn't connect to the server. Please try again later.");
        setConversationState('idle');
      }
    }
  }, [conversationState, tempPhoneNumber, speak]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.lang = 'en-US';
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };
      recognition.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setSpeechApiSupported(false);
    }
  }, [handleUserMessage]);

  const toggleListen = () => {
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
    }
    setIsListening(!isListening);
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSend = () => {
    if (textInput.trim()) {
      handleUserMessage(textInput);
    }
  };

  const startOver = () => {
    setMessages([]);
    setConversationState('awaiting_phone_number');
    speak("What is the phone number?");
  };

  useEffect(() => {
    speak("Welcome to the line blocking service. Press Start to begin.");
  }, [speak]);

  return (
    <div className="App">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={textInput}
          onChange={handleTextInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          disabled={conversationState === 'idle'}
        />
        <button onClick={handleSend} disabled={conversationState === 'idle'}>Send</button>
        {speechApiSupported ? (
          <button onClick={toggleListen} className="mic-button" disabled={conversationState === 'idle'}>
            {isListening ? '🛑' : '🎤'}
          </button>
        ) : (
          <p>Speech recognition not supported in this browser.</p>
        )}
        <button onClick={startOver}>Start Over</button>
      </div>
    </div>
  );
};

export default App;
