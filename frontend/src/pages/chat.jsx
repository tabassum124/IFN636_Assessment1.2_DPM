import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { id } = useParams(); // other user ID
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages between logged-in user and other user
  useEffect(() => {
    axiosInstance
      .get(`/messages?userId=${id}`)
      .then((res) => {
        setMessages(res.data);
        scrollToBottom();
      })
      .catch(() => alert('Failed to load chat'));
  }, [id]);

  // Send a new message
  const sendMessage = async () => {
    if (!content.trim()) return;

    try {
      const res = await axiosInstance.post(`/messages`, {
        receiverId: id,
        content,
      });

      setMessages((prev) => [...prev, res.data]);
      setContent('');
      scrollToBottom();
    } catch (err) {
      alert('Failed to send message');
    }
  };

  if (!user) {
    return <p className="p-6 text-center">Please log in to view this chat.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>

      <div className="border rounded p-4 h-96 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-3 p-2 rounded max-w-xs ${
              msg.sender === user.id
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-300 text-black'
            }`}
          >
            {msg.content}
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
