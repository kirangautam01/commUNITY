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
    if (message.trim()) {
      socket.emit('send-message', {
        communityId,
        message,
        sender: 'You', // Replace with actual user later
      });
      setMessages((prev) => [...prev, { message, sender: 'You' }]);
      setMessage('');
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-200 p-2 rounded-md">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <div className="flex gap-2 mt-4">
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
