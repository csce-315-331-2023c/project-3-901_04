import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import GoogleLog from '../components/GoogleLog';
import { gapi } from 'gapi-script';
import CookieConsent from "react-cookie-consent";
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

                const user = JSON.parse(localStorage.getItem('user'));

                // Check if the user is an employee
                const employeeCheckResponse = await axios.get(`${backendURL}/api/isEmployee?name=${user.name}`);
                localStorage.setItem('isEmployee', employeeCheckResponse.data.isEmployee);

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
            <CookieConsent
                location="top"
                buttonText="I understand"
                cookieName="myAwesomeCookieName2"
                style={{ background: "#2B373B", padding: "10px" }}
                buttonStyle={{ color: "#FFFFFF", fontSize: "16px", backgroundColor: "#4e503b", border: "none", padding: "10px 20px", borderRadius: "5px", margin: "10px 0" }}
                contentStyle={{ color: "#FFFFFF", fontSize: "14px" }}
                expires={150}
                debug={false}
            >
                
                <span style={{ fontSize: "14px", display: "block" }}>This website requires cookies to enhance the user experience.{" "}</span>
            </CookieConsent>
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
