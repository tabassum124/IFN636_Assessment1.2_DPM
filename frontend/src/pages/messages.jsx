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
      .then((res) => {
        const msgs = res.data;

        // Group messages by the OTHER user
        const convMap = {};

        msgs.forEach((msg) => {
          const other =
            msg.sender._id === user.id ? msg.receiver : msg.sender;

          if (!convMap[other._id]) {
            convMap[other._id] = {
              otherUser: other,
              lastMessage: msg,
            };
          }
        });

        setConversations(Object.values(convMap));
      })
      .catch(() => alert('Failed to load messages'));
  }, [user.id]);

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
            key={conv.otherUser._id}
            to={`/messages/${conv.otherUser._id}`}
            className="block border p-4 rounded shadow hover:bg-gray-100"
          >
            <p className="font-semibold">
              Chat with: {conv.otherUser.name}
            </p>
            <p className="text-gray-600 text-sm">
              Last message: {conv.lastMessage.content}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Messages;
