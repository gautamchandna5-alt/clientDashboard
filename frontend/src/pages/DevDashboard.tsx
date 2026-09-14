import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';

interface Task {
    id: number;
    description: string;
    status: string;
    project_title: string;
    created_at: string;
}

const DevDashboard = () => {
    const { user, clearAuth } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState('');

    const fetchTasks = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await api.get(`/dev/tasks/${user.id}`);
            setTasks(response.data);
        } catch (err) {
            console.error("Failed to load tasks", err);
            setError('Could not load your assigned tasks.');
        }
    }, [user?.id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCompleteTask = async (taskId: number) => {
        try {
            await api.patch(`/dev/tasks/${taskId}/complete`);
            fetchTasks(); // Instantly refresh the UI to show the new status
        } catch (err) {
            console.error("Failed to update task", err);
            setError('Could not update task status.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Developer Dashboard</h2>
                    <p style={{ color: 'gray', margin: '5px 0 0 0' }}>Welcome back, {user?.name}</p>
                </div>
                <button 
                    onClick={clearAuth} 
                    style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                    Logout
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}

            <h3>Your Task Backlog</h3>
            
            {tasks.length === 0 ? (
                <p style={{ color: 'gray', padding: '20px', border: '1px dashed #ccc', textAlign: 'center' }}>
                    No tasks currently assigned to you.
                </p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {tasks.map((task) => (
                        <div key={task.id} style={{ 
                            border: '1px solid #ddd', 
                            padding: '15px', 
                            borderRadius: '6px', 
                            backgroundColor: task.status === 'COMPLETED' ? '#f0fff0' : '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0' }}>{task.description}</h4>
                                <small style={{ color: 'gray' }}>Project: {task.project_title}</small>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ marginBottom: '8px', fontWeight: 'bold', color: task.status === 'COMPLETED' ? 'green' : '#cc7700' }}>
                                    {task.status}
                                </div>
                                {task.status !== 'COMPLETED' && (
                                    <button 
                                        onClick={() => handleCompleteTask(task.id)}
                                        style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Mark as Done
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DevDashboard;