// GoogleLog component
import React from 'react';
import { GoogleLogin } from 'react-google-login';


const clientId = process.env.REACT_APP_CLIENTID;


function GoogleLog({ navigate }) { // Accept navigate as a prop

    const onSuccess = (res) => {
        console.log("LOGIN SUCCESSFUL! Current user:", res.profileObj);
        // Store the token and user details in local storage
        localStorage.setItem('token', res.tokenId); // Store the token
        localStorage.setItem('user', JSON.stringify(res.profileObj)); // Store the user details

        // Navigate to the home page
        navigate('/home');
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
