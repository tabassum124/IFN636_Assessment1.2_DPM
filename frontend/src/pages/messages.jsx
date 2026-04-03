import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axiosInstance
      .get('/messages')
      .then((res) => setConversations(res.data))
      .catch(() => alert('Failed to load messages'));
  }, []);

  if (!user) {
    return <p className="p-6 text-center">Please log in to view your messages.</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {conversations.length === 0 && (
        <p className="text-gray-600">You have no conversations yet.</p>
      )}

      <div className="space-y-3">
        {conversations.map((conv) => (
          <Link
            key={conv._id}
            to={`/messages/${conv._id}`}
            className="block border p-4 rounded shadow hover:bg-gray-100"
          >
            <p className="font-semibold">
              Chat with: {conv.otherUser?.name || 'Unknown User'}
            </p>
            <p className="text-gray-600 text-sm">
              Last message: {conv.lastMessage?.content || 'No messages yet'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Messages;
