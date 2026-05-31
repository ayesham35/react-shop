import { useCart } from '../context/CartContext';

export default function Cart({ onContinueShopping }) {
    const { state, dispatch, totalItems, totalPrice } = useCart();

    if (state.items.length === 0) {
        return (
            <div className="cart-empty">
                <h2>Your cart is empty</h2>
                <button onClick={onContinueShopping}>Continue shopping</button>
            </div>
        );
    }

    return (
        <div className="cart">
            <h2>Your Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})</h2>

            <ul className="cart-items">
                {state.items.map(item => (
                    <li key={item.id} className="cart-item">
                        <img src={item.thumbnail} alt={item.title} />
                        <div className="cart-item-info">
                            <h4>{item.title}</h4>
                            <p>${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="cart-item-controls">
                            <button onClick={() => dispatch({ type: 'SET_QUANTITY', id: item.id, quantity: item.quantity - 1})}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => dispatch({ type: 'SET_QUANTITY', id: item.id, quantity: item.quantity + 1 })}>+</button>
                        </div>
                        <div className="cart-item-total">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                            className="remove-btn"
                            onClick={() => dispatch({ type: 'REMOVE', id: item.id})}>✕</button>
                    </li>
                ))}
            </ul>

            <div className="cart-footer">
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <button onClick={() => dispatch({ type: 'CLEAR' })} className="clear-btn">Clear cart</button>
                <button onClick={onContinueShopping}>Continue shopping</button>
            </div>
        </div>
    );
}