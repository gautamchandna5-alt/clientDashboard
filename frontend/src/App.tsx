import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import PmDashboard from './pages/PmDashboard'; // Import the new dashboard

const App = () => {
    const { user } = useAuth();

    if (!user) {
        return <AuthPage />;
    }

    if (user.role === 'ADMIN') {
        return <AdminDashboard />;
    }

    if (user.role === 'PROJECT_MANAGER') {
        return <PmDashboard />; 
    }

    // Fallback for Developers
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
            <h2>Welcome, {user.name}</h2>
            <p>Your {user.role} dashboard is under construction.</p>
        </div>
    );
};

export default App;