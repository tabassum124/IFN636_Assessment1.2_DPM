import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => alert('Failed to load product'));
  }, [id]);

  const sendMessage = async () => {
    try {
      await axiosInstance.post('/messages', {
        productId: id,
        receiverId: product.owner?._id,
        content: message,
      });
      alert('Message sent');
      setMessage('');
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const deleteProduct = async () => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      navigate('/'); // FIXED
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (!product) return <p className="p-6">Loading...</p>;

  // FIXED: user.id instead of user._id
  const isOwner = user && product.owner && user.id === product.owner._id;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      <p className="text-gray-700 mb-2">{product.description}</p>
      <p className="text-xl font-semibold mb-4">${product.price}</p>

      {isOwner ? (
        <div className="flex gap-4">
          <Link
            to={`/products/${id}/edit`}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Edit
          </Link>

          <button
            onClick={deleteProduct}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      ) : (
        user && (
          <div className="mt-6">
            <textarea
              className="border p-2 w-full rounded"
              placeholder="Write a message to the seller..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Send Message
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default ProductDetails;
