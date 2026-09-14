import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface ProjectManager { id: number; name: string; email: string; }
interface ProjectOverview { id: number; title: string; pm_name: string; created_at: string; }
interface TaskOverview { id: number; description: string; status: string; dev_name: string; project_title: string; pm_name: string; }

const AdminDashboard = () => {
    const { clearAuth, accessToken } = useAuth();
    
    // Existing State
    const [pms, setPms] = useState<ProjectManager[]>([]);
    const [projects, setProjects] = useState<ProjectOverview[]>([]);
    const [tasks, setTasks] = useState<TaskOverview[]>([]);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedPm, setSelectedPm] = useState('');
    const [message, setMessage] = useState('');

    // User Creation State
    const [createName, setCreateName] = useState('');
    const [createEmail, setCreateEmail] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [createRole, setCreateRole] = useState('DEVELOPER'); 
    const [userMessage, setUserMessage] = useState('');
    const [userError, setUserError] = useState('');

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

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserMessage('');
        setUserError('');

        try {
            await api.post('/admin/create-user', 
                { name: createName, email: createEmail, password: createPassword, role: createRole },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            
            setUserMessage(`${createRole} created successfully!`);
            setCreateName('');
            setCreateEmail('');
            setCreatePassword('');
            setCreateRole('DEVELOPER');
            
            if (createRole === 'PROJECT_MANAGER') {
                fetchData(); 
            }
        } catch (err: any) {
            setUserError(err.response?.data?.message || 'Failed to create team member.');
        }
    };

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

    const handleDeleteProject = async (projectId: number) => {
        if (!window.confirm('Are you sure? This will delete the project and ALL associated tasks.')) return;
        
        try {
            await api.delete(`/admin/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            fetchData(); 
        } catch (err) {
            console.error('Failed to delete project', err);
            alert('Failed to delete project');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        
        try {
            await api.delete(`/admin/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            fetchData(); 
        } catch (err) {
            console.error('Failed to delete task', err);
            alert('Failed to delete task');
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>Admin Global Dashboard</h2>
                <button onClick={clearAuth} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                {/* Form: Create Team Member */}
                <div style={{ backgroundColor: '#e9ecef', padding: '20px', borderRadius: '6px' }}>
                    <h3 style={{ marginTop: 0 }}>Create Team Member</h3>
                    {userMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{userMessage}</div>}
                    {userError && <div style={{ color: 'red', marginBottom: '10px' }}>{userError}</div>}
                    
                    <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Full Name" required style={{ padding: '8px' }}/>
                        <input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} placeholder="Email Address" required style={{ padding: '8px' }}/>
                        <input type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} placeholder="Temporary Password" required style={{ padding: '8px' }}/>
                        
                        <select value={createRole} onChange={(e) => setCreateRole(e.target.value)} required style={{ padding: '8px' }}>
                            <option value="DEVELOPER">Developer</option>
                            <option value="PROJECT_MANAGER">Project Manager</option>
                        </select>
                        
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Create User
                        </button>
                    </form>
                </div>

                {/* Form: Assign Project */}
                <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '6px' }}>
                    <h3 style={{ marginTop: 0 }}>Assign New Project</h3>
                    {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
                    
                    <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" required style={{ padding: '8px' }}/>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Project Description (Optional)" rows={2} style={{ padding: '8px' }}/>
                        
                        <select value={selectedPm} onChange={(e) => setSelectedPm(e.target.value)} required style={{ padding: '8px' }}>
                            <option value="" disabled>Select a PM...</option>
                            {pms.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
                        </select>
                        
                        <button type="submit" style={{ padding: '10px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Assign Project
                        </button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                {/* Project List */}
                <div>
                    <h3>All Assigned Projects</h3>
                    {projects.map(p => (
                        <div key={p.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{p.title}</strong><br/>
                                <small style={{ color: 'gray' }}>Assigned to: {p.pm_name}</small>
                            </div>
                            <button 
                                onClick={() => handleDeleteProject(p.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Task List */}
                <div>
                    <h3>Global Dev Tasks</h3>
                    {tasks.map(t => (
                        <div key={t.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <strong>{t.description}</strong> ({t.status})<br/>
                                <small style={{ color: 'gray' }}>Dev: {t.dev_name} | PM: {t.pm_name}</small><br/>
                                <small style={{ color: 'gray' }}>Project: {t.project_title}</small>
                            </div>
                            <button 
                                onClick={() => handleDeleteTask(t.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;