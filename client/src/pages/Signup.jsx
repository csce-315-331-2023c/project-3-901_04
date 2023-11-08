import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Signup.css';

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSignup(e) {
        e.preventDefault();
        try {
            //http://localhost:3001/signup
            //https://mos-irish-server-901-04.vercel.app/signup
            const backendURL = process.env.NODE_ENV === 'production'
                ? 'https://mos-irish-server-901-04.vercel.app'
                : 'http://localhost:3001';

            // Then use it in your axios call
            const response = await axios.post(`${backendURL}/signup`, { name, email, password });

            if (response.data.status === 'ok') {
                // Handle signup success
                navigate('/');
            } else {
                // Handle signup failure
                alert('Signup failed');
            }
        } catch (error) {
            console.error('Signup error', error);
        }
    }

    return (
        <div className="signup">
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Signup</button>
            </form>
            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>
        </div>
    );
}

export default Signup;
