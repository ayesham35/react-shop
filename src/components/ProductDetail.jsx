import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductDetail({ productId, onBack }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //get the dispatch function from cart context
    const { dispatch } = useCart();

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`https://dummyjson.com/products/${productId}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (!cancelled) setProduct(data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [productId]);

    if (loading) return <p>Loading product...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!product) return null;

    return (
        <div className="product-detail">
            <button onClick={onBack} className="back-btn">← Back to list</button>
            <div className="detail-grid">
                <img src={product.thumbnail} alt={product.title} />
                <div>
                    <h2>{product.title}</h2>
                    <p className="category">{product.category}</p>
                    <p className="price-large">${product.price.toFixed(2)}</p>
                    <p>{product.description}</p>
                    <p className="stock">In stock: {product.stock}</p>
                    <p className="rating">Rating: {product.rating} / 5</p>
                    <button
                        className="add-btn"
                        onClick={() => dispatch({ type: 'ADD', product })}>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}