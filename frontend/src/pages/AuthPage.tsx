import { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api/axios.ts';

const AuthPage = () => {
    const { user, setAuth, clearAuth } = useAuth();
    
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (user) {
        return (
            <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h2>Welcome, {user.name}</h2>
                <h4 style={{ color: 'gray' }}>Role: {user.role}</h4>
                <button 
                    onClick={clearAuth}
                    style={{ marginTop: '20px', padding: '8px 16px', cursor: 'pointer' }}
                >
                    Logout
                </button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            if (isLogin) {
                const response = await api.post('/auth/login', { email, password });
                const { user, accessToken } = response.data;
                setAuth(user, accessToken); 
            } else {
                await api.post('/auth/register', { name, email, password });
                setMessage('Registration successful! Please log in.');
                setPassword('');
                setIsLogin(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>
                {isLogin ? 'Agency Login' : 'Register New Admin'}
            </h2>
            
            {message && <div style={{ color: 'green', marginBottom: '10px', textAlign: 'center' }}>{message}</div>}
            {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {!isLogin && (
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required={!isLogin} 
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                )}
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                
                <button type="submit" style={{ padding: '10px', cursor: 'pointer', marginTop: '5px' }}>
                    {isLogin ? 'Log In' : 'Register Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    type="button" 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setMessage('');
                    }}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#0066cc', 
                        cursor: 'pointer', 
                        textDecoration: 'underline',
                        padding: 0
                    }}
                >
                    {isLogin ? 'Register here' : 'Login here'}
                </button>
            </p>
        </div>
    );
};

export default AuthPage;