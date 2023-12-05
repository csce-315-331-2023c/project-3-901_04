// GoogleLog component
import React from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const clientId = process.env.REACT_APP_CLIENTID;


function GoogleLog({ navigate }) { // Accept navigate as a prop

    const onSuccess = async (res) => {
        console.log("LOGIN SUCCESSFUL! Current user:", res.profileObj);
        localStorage.setItem('token', res.tokenId); // Store the token
        localStorage.setItem('user', JSON.stringify(res.profileObj)); // Store the user details

        try {
            const backendURL = process.env.NODE_ENV === 'production'
                ? 'https://mos-irish-server-901-04.vercel.app'
                : 'http://localhost:3001';

            // Check if the user is an employee
            const name = res.profileObj.name; // Email from Google profile
            const response = await axios.get(`${backendURL}/api/isEmployee?name=${name}`);
            localStorage.setItem('isEmployee', response.data.isEmployee);

                            //check if the user is a manager
                            const managerCheckResponse = await axios.get(`${backendURL}/api/isManager?name=${name}`);
                            localStorage.setItem('isManager', managerCheckResponse.data.isManager);

            navigate('/home');
        } catch (error) {
            console.error('Error in employee check', error);
            // Handle the error case
        }
    }

    const onFailure = (res) => {
        console.log("LOGIN FAILED! res:", res);
    }

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default GoogleLog;
