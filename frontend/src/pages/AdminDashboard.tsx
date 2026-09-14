import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface ProjectManager { id: number; name: string; email: string; }
interface ProjectOverview { id: number; title: string; pm_name: string; created_at: string; }
interface TaskOverview { id: number; description: string; status: string; dev_name: string; project_title: string; pm_name: string; }

const AdminDashboard = () => {
    const { clearAuth } = useAuth();
    const [pms, setPms] = useState<ProjectManager[]>([]);
    const [projects, setProjects] = useState<ProjectOverview[]>([]);
    const [tasks, setTasks] = useState<TaskOverview[]>([]);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPm, setSelectedPm] = useState('');
    const [message, setMessage] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const [pmsRes, overviewRes] = await Promise.all([
                api.get('/admin/pms'),
                api.get('/admin/overview')
            ]);
            setPms(pmsRes.data);
            setProjects(overviewRes.data.projects);
            setTasks(overviewRes.data.tasks);
        } catch (err) {
            console.error("Failed to load dashboard data");
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            await api.post('/admin/projects', { title, description, pmId: selectedPm });
            setMessage('Project assigned successfully!');
            setTitle(''); setDescription(''); setSelectedPm('');
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Admin Global Dashboard</h2>
                <button onClick={clearAuth} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Logout</button>
            </div>

            <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '6px', marginBottom: '40px' }}>
                <h3>Assign New Project</h3>
                {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
                <form onSubmit={handleCreateProject} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" required style={{ flex: 1, padding: '8px' }}/>
                    <select value={selectedPm} onChange={(e) => setSelectedPm(e.target.value)} required style={{ flex: 1, padding: '8px' }}>
                        <option value="" disabled>Select a PM...</option>
                        {pms.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
                    </select>
                    <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}>Assign</button>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>

                <div>
                    <h3>All Assigned Projects</h3>
                    {projects.map(p => (
                        <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                            <strong>{p.title}</strong><br/>
                            <small style={{ color: 'gray' }}>Assigned to: {p.pm_name}</small>
                        </div>
                    ))}
                </div>

                <div>
                    <h3>Global Dev Tasks</h3>
                    {tasks.map(t => (
                        <div key={t.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
                            <strong>{t.description}</strong> ({t.status})<br/>
                            <small style={{ color: 'gray' }}>Dev: {t.dev_name} | PM: {t.pm_name}</small><br/>
                            <small style={{ color: 'gray' }}>Project: {t.project_title}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard;