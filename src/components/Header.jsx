import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ onLogoClick, onCartClick, onLoginClick }) {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <h1 onClick={onLogoClick}>React Shop</h1>

            <div className="header-actions">
                {user ? (
                    <>
                        <span>Hi, {user.firstName}</span>
                        <button onClick={logout}>Log out</button>
                    </>
                ) : (
                    <button onClick={onLoginClick}>Log in</button>
                )}
                <button className="cart-button" onClick={onCartClick}>
                    🛒 Cart ({totalItems})
                </button>
            </div>
        </header>
    );
}