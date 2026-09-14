import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import styles from '../styles/AuthPage.module.css';

const AuthPage = () => {
    const { setAuth } = useAuth();
    
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
        <div className={styles.authContainer}>
            <h2 className={styles.authTitle}>
                {isLogin ? 'Agency Login' : 'Register New Admin'}
            </h2>
            
            {message && <div className={styles.msgSuccess}>{message}</div>}
            {error && <div className={styles.msgError}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.authForm}>
                {!isLogin && (
                    <div>
                        <label className={styles.formLabel}>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required={!isLogin} 
                            className={styles.formInput}
                        />
                    </div>
                )}
                
                <div>
                    <label className={styles.formLabel}>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className={styles.formInput}
                    />
                </div>
                
                <div>
                    <label className={styles.formLabel}>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className={styles.formInput}
                    />
                </div>
                
                <button type="submit" className={styles.btnSubmit}>
                    {isLogin ? 'Log In' : 'Register Account'}
                </button>
            </form>

            <div className={styles.toggleContainer}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    type="button" 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setMessage('');
                    }}
                    className={styles.btnToggle}
                >
                    {isLogin ? 'Register here' : 'Login here'}
                </button>
            </div>
        </div>
    );
};

export default AuthPage;