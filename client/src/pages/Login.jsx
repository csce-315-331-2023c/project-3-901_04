import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLog from '../components/GoogleLog';
import { gapi } from 'gapi-script';

import '../styles/Login.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
 

    const clientId = process.env.REACT_APP_CLIENTID;

    async function handleLogin(e) {
        e.preventDefault();
        try {
            //http://localhost:3001/login
            //https://mos-irish-server-901-04.vercel.app/login
            const backendURL = process.env.NODE_ENV === 'production'
                ? 'https://mos-irish-server-901-04.vercel.app'
                : 'http://localhost:3001';

            // Then use it in your axios call
            const response = await axios.post(`${backendURL}/login`, { email, password });

            if (response.data.status === 'ok') {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Store the user data
                navigate('/home');
            } else {
                // Handle login failure
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error', error);
        }
    }

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: ""
            })
        };


        gapi.load('client:auth2', start);
    });

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button type="submit">Login</button>
                <GoogleLog navigate={navigate} />
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;
