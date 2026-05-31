import { createContext, useContext, useEffect, useReducer } from 'react';

// the context object = think of it as the "tunnel" between provider and consumers
const CartContext = createContext(null);

const initialState = {
    items: [], // [{ id, title, price, thumbnail, quantity }]
};

// the reducer - one place that handles ALL cart state changes
function cartReducer(state, action) {
    switch (action.type) {

        case 'ADD': {
            // if item already in cart, just increase quantity
            const existing = state.items.find(i => i.id === action.product.id);
            if (existing) {
                return {
                    ...state,
                    items: state.items.map(i =>
                    i.id === action.product.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                    ),
                };
            }

            //otherwise add it as a new item with quantity 1
            return {
                ...state,
                items: [...state.items, {...action.product, quantity: 1}],
            };
        }

        case 'REMOVE':
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.id),
            };

        case 'SET_QUANTITY': {
            // if quantity drops below 1, remove the item entirely
            if (action.quantity < 1) {
                return {...state, items: state.items.filter(i => i.id !== action.id)};
            }
            return {
                ...state,
                items: state.items.map(i => i.id === action.id ? {...i, quantity: action.quantity} : i
                ),
            };
        }

        case 'CLEAR':
            return initialState;

        default:
            throw new Error(`Unknown cart action: ${action.type}`);
    }
}

const STORAGE_KEY = 'react-shop-cart-v1';

// the provider - wraps the app and makes cart state available everywhere
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState, () => {
        // lazy initializer - runs once on mount, reads from localStorage
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : initialState;
        } catch {
            return initialState;
        }
    });

    // whenever cart state changes, save it to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (err) {
            console.error('Failed to save cart:', err);
        }
    }, [state]);

    // derived values - calculated from state, not stored
    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    return (
        <CartContext.Provider value={{state, dispatch, totalItems, totalPrice}}>
            {children}
        </CartContext.Provider>
    );
}

// custom hook - the clean way for components to access the cart
export function useCart() {
    const ctx = useContext(CartContext);

    if (ctx === null) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return ctx;
}

