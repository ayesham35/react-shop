import {useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

const PAGE_SIZE = 12;

export default function ProductList({ onProductClick }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);

    // wait 400ms after the user stops typing before fetching
    const debouncedQuery = useDebouncedValue(searchQuery, 400);

    const skip = page * PAGE_SIZE;
    const url = debouncedQuery.trim()
        ? `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedQuery)}&limit=${PAGE_SIZE}&skip=${skip}`
        : `https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${skip}`;

    const { data, loading, error } = useFetch(url);

    // derive products and total from data
    const products = data?.products ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                }}
                className="search"
            />
            {error && <p className="error">Error: {error}</p>}
            {loading && <p>Loading...</p>}

            {!loading && !error && (
                <>
                    <div className="product-grid">
                        {products.map(p => (
                            <div key={p.id} className="product-card" onClick={() => onProductClick(p.id)}>
                                <img src={p.thumbnail} alt={p.title}/>
                                <h3>{p.title}</h3>
                                <p className="price">${p.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    {products.length === 0 && <p>No products found.</p>}

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>Previous</button>
                            <span>Page {page + 1} of {totalPages}</span>
                            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>Next</button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}


