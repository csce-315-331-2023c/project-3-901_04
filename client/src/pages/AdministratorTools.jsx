import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdministratorTools.css';

const backendBaseURL = process.env.NODE_ENV === 'production'
    ? 'https://mos-irish-server-901-04.vercel.app/api'
    : 'http://localhost:3001/api';

const AdministratorTools = () => {
    const [users, setUsers] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

    const openEditModal = (user) => {
        setCurrentUserToEdit(user);
        setIsEditModalOpen(true);
    };

    const updateUser = () => {
        handleEditUser();
    };


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch users from the MongoDB
                const usersResponse = await axios.get(`${backendBaseURL}/users`);
                const fetchedUsers = usersResponse.data;

                // Map over the fetched users and enrich them with employee status from PostgreSQL
                const usersWithEmployeeStatus = await Promise.all(fetchedUsers.map(async (user) => {
                    try {
                        // Fetch employee status from PostgreSQL
                        const employeeStatusResponse = await axios.get(`${backendBaseURL}/employeeStatus/${user.name}`);
                        const employeeStatus = employeeStatusResponse.data;

                        // Combine user info with employee status
                        return {
                            ...user,
                            isEmployee: employeeStatus.isEmployee,
                            isManager: employeeStatus.isManager,
                            isClockedIn: employeeStatus.isClockedIn
                        };
                    } catch (error) {
                        console.error(`Error fetching employee status for ${user.name}:`, error);
                        return {
                            ...user,
                            isEmployee: false,
                            isManager: false,
                            isClockedIn: false
                        };
                    }
                }));

                // Update state with enriched user information
                setUsers(usersWithEmployeeStatus);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await axios.delete(`${backendBaseURL}/users/${userId}`);
                if (response.data.success) {
                    setUsers(users.filter(user => user._id !== userId)); // Update local state to remove the user
                    alert("User deleted successfully");
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user.');
            }
        }
    };

    const handleEditUser = async () => {
        // Assuming currentUserToEdit has been updated with the new status values via the modal's form elements
        try {
            // Update status in the PostgreSQL database
            const response = await axios.post(`${backendBaseURL}/updateEmployeeStatus`, {
                name: currentUserToEdit.name,
                isEmployee: currentUserToEdit.isEmployee,
                isManager: currentUserToEdit.isManager,
                isClockedIn: currentUserToEdit.isClockedIn
            });

            if (response.data.success) {
                // Update the user state
                setUsers(users.map((u) => {
                    if (u._id === currentUserToEdit._id) {
                        return { ...u, ...currentUserToEdit };
                    }
                    return u;
                }));

                // Close the modal
                setIsEditModalOpen(false);

                alert('User updated successfully');
            } else {
                alert('Failed to update the user.');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Error updating user.');
        }
    };


    return (
        <div className="administrator-tools">
            {isEditModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsEditModalOpen(false)}>
                            &times;
                        </span>
                        <h2>Edit User: {currentUserToEdit?.name}</h2>
                        <div className="custom-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentUserToEdit?.isEmployee}
                                    onChange={(e) =>
                                        setCurrentUserToEdit({
                                            ...currentUserToEdit,
                                            isEmployee: e.target.checked,
                                        })
                                    }
                                />
                                <span className="checkmark"></span>
                                Is Employee
                            </label>
                        </div>

                        <div className="custom-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentUserToEdit?.isManager}
                                    onChange={(e) =>
                                        setCurrentUserToEdit({
                                            ...currentUserToEdit,
                                            isManager: e.target.checked,
                                        })
                                    }
                                />
                                <span className="checkmark"></span>
                                Is Manager
                            </label>
                        </div>

                        <div className="custom-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={currentUserToEdit?.isClockedIn}
                                    onChange={(e) =>
                                        setCurrentUserToEdit({
                                            ...currentUserToEdit,
                                            isClockedIn: e.target.checked,
                                        })
                                    }
                                />
                                <span className="checkmark"></span>
                                Is Clocked In
                            </label>
                        </div>
                        <button onClick={updateUser}>Update User</button>
                    </div>
                </div>
            )}
            <div className='adminToolsLink'><Link to="/manager"><b>Return Manager</b></Link></div>
            <div className="user-management-container">
                <h1>User Management</h1>
            </div>
            <div className="user-cards-container">
                {users.map((user) => (
                    <div key={user._id} className="user-card">
                        <h2>{user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Employee: {user.isEmployee ? 'Yes' : 'No'}</p>
                        <p>Manager: {user.isManager ? 'Yes' : 'No'}</p>
                        <p>Clocked In: {user.isClockedIn ? 'Yes' : 'No'}</p>
                        <div className="user-card-actions">
                            <button onClick={() => openEditModal(user)} className="edit-user-button">Edit</button>
                            <button onClick={() => handleDeleteUser(user._id)} className="delete-user-button">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdministratorTools;
