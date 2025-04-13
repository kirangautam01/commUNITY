import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io(backendUrl);

const MessageBox = () => {
  const { id: communityId } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  const currentUser = localStorage.getItem("userName");

  useEffect(() => {
    socket.emit('join-room', communityId);

    socket.on('receive-message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [communityId]);

  const sendMessage = () => {
    if (message.trim() && currentUser) {
      const newMessage = {
        communityId,
        message,
        sender: currentUser,
      };
  
      socket.emit('send-message', newMessage);
      setMessage('');
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-md max-w-[75%] ${
              msg.sender === currentUser?.username
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-200 self-start text-left'
            }`}
          >
            <strong>
              {msg.sender === currentUser? 'You' : msg.sender}:
            </strong>{' '}
            {msg.message}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex gap-2 mt-4 flex-col sm:flex-row">
        <input
          className="flex-1 border px-4 py-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-primaryBlue text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
