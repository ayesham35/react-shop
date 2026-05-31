import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import './App.css';
import {AuthProvider} from './context/AuthContext.jsx';
import LoginForm from './components/LoginForm.jsx';

function App() {
    const [view, setView] = useState('list');
    const [selectedId, setSelectedId] = useState(null);

    return (
        <AuthProvider>
        <CartProvider>
            <div className="app">
                <Header
                    onLogoClick={() => setView('list')}
                    onCartClick={() => setView('cart')}
                    onLoginClick={() => setView('login')}
                    />

                {view === 'list' && <ProductList onProductClick={id => { setSelectedId(id); setView('detail'); }} />}
                {view === 'detail' && <ProductDetail productId={selectedId} onBack={() => setView('list')} />}
                {view === 'cart' && <Cart onContinueShopping={() => setView('list')} />}
                {view === 'login' && <LoginForm onSuccess={() => setView('list')} />}
            </div>
        </CartProvider>
        </AuthProvider>
    );
}

export default App;