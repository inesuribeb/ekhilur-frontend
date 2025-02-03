/* import { getAllUsers } from '../../utils/apiController'; */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Users.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                if (response.success) {
                    setUsers(response.data);
                } else {
                    setError(response.message || 'Error al cargar los usuarios');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error al cargar los usuarios');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (error) {
        return (
            <div className="users-container">
                <h2>Usuarios</h2>
                <div className="error-message">
                    {error}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="users-container">
                <h2>Usuarios</h2>
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <div className="users-container">
            <h2>Usuarios</h2>
            {users.length === 0 ? (
                <p>No hay usuarios para mostrar</p>
            ) : (
                <ul className="users-list">
                    {users.map(user => (
                        <li key={user.id} className="user-item">
                            <Link to={`/erabiltzaileak/${user.id}`}>
                                <div className="user-info">
                                    <span className="user-id">ID: {user.id}</span>
                                    {user.name && <span className="user-name">Nombre: {user.name}</span>}
                                    {user.email && <span className="user-email">Email: {user.email}</span>}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Users;