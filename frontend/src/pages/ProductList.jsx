import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosConfig';


const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Products</h1>

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            className="border p-4 rounded shadow"
          >
            <h2 className="font-bold">{p.title}</h2>
            <p>${p.price}</p>
            <p>{p.category}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
