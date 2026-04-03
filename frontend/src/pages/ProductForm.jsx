import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ProductForm = ({ mode }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: '',
    location: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Load product data in edit mode
  useEffect(() => {
    if (mode === 'edit') {
      axiosInstance
        .get(`/products/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            price: p.price || '',
            category: p.category || '',
            images: Array.isArray(p.images) ? p.images.join(',') : '',
            location: p.location || '',
          });
        })
        .catch(() => alert('Failed to load product'));
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      images: form.images.split(',').map((i) => i.trim()),
    };

    try {
      if (mode === 'create') {
        await axiosInstance.post('/products', payload);
      } else {
        await axiosInstance.put(`/products/${id}`, payload);
      }

      navigate('/products');
    } catch (err) {
      alert('Failed to save product');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded">
        <h1 className="text-2xl mb-4 font-bold">
          {mode === 'create' ? 'Create Product' : 'Edit Product'}
        </h1>

        {/* Title */}
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          rows="4"
        />

        {/* Price */}
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Category */}
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Images */}
        <input
          placeholder="Image URLs (comma separated)"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        {/* Location */}
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;

