import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';

interface Project { id: number; title: string; description: string; }
interface Developer { id: number; name: string; email: string; }
interface AssignedTask { id: number; description: string; status: string; dev_name: string; project_title: string; }

const PmDashboard = () => {
    const { user, clearAuth } = useAuth();
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [assignedTasks, setAssignedTasks] = useState<AssignedTask[]>([]);
    
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedDevId, setSelectedDevId] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [message, setMessage] = useState('');

    const fetchData = useCallback(async () => {
        if (!user?.id) return;
        try {
            const [projectsRes, devsRes, tasksRes] = await Promise.all([
                api.get(`/pm/projects/${user.id}`),
                api.get('/pm/developers'),
                api.get(`/pm/assigned-tasks/${user.id}`)
            ]);
            setProjects(projectsRes.data);
            setDevelopers(devsRes.data);
            setAssignedTasks(tasksRes.data);
        } catch (err) {
            console.error("Failed to load dashboard data");
        }
    }, [user?.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAssignTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/pm/tasks', { projectId: selectedProjectId, devId: selectedDevId, description: taskDescription });
            setMessage('Task assigned successfully!');
            setSelectedProjectId(''); setSelectedDevId(''); setTaskDescription('');
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Project Manager Dashboard</h2>
                <button onClick={clearAuth} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
  
                <div>
                    <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
                        <h3 style={{ marginTop: 0 }}>Assign Task to Dev</h3>
                        {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
                        <form onSubmit={handleAssignTask} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} required style={{ padding: '8px' }}>
                                <option value="" disabled>Choose a project...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                            <select value={selectedDevId} onChange={(e) => setSelectedDevId(e.target.value)} required style={{ padding: '8px' }}>
                                <option value="" disabled>Choose a developer...</option>
                                {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} required rows={3} placeholder="Task description..." style={{ padding: '8px' }} />
                            <button type="submit" style={{ padding: '10px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}>Assign</button>
                        </form>
                    </div>
                </div>

                <div>
                    <h3>Tasks You Have Assigned</h3>
                    {assignedTasks.length === 0 ? <p style={{ color: 'gray' }}>No tasks assigned yet.</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {assignedTasks.map(t => (
                                <div key={t.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px' }}>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{t.description}</h4>
                                    <div style={{ fontSize: '14px', color: '#555' }}>
                                        <strong>Dev:</strong> {t.dev_name} <br/>
                                        <strong>Project:</strong> {t.project_title} <br/>
                                        <strong>Status:</strong> <span style={{ color: t.status === 'PENDING' ? '#cc7700' : 'green' }}>{t.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PmDashboard;