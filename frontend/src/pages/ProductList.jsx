import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get('/products')
      .then((res) => setProducts(res.data))
      .catch(() => alert('Failed to load products'));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Products</h1>

      {products.length === 0 && (
        <p className="text-gray-600">No products found.</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            className="border p-4 rounded shadow hover:bg-gray-100"
          >
            {p.images?.length > 0 && (
              <img
                src={p.images[0]}
                alt={p.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}

            <h2 className="font-bold">{p.title}</h2>
            <p className="text-gray-700">${p.price}</p>
            <p className="text-sm text-gray-500">{p.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
