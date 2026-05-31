import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm({ onSuccess }) {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(username, password);
            onSuccess?.();
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <p className="hint">Try <code>emilys</code> / <code>emilyspass</code></p>
            {error && <p className="error">{error}</p>}
            <label>
                Username
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    />
            </label>
            <label>
                Password
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    />
            </label>
            <button type="submit" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Log in'}
            </button>
        </form>
    );
}