import React, { useEffect, useState } from 'react';
import '../styles/Manager.css';

const Greeting = () => {
    const [greeting, setGreeting] = useState('');
  
    useEffect(() => {
      const getCurrentTime = () => {
        const currentTime = new Date().getHours();
  
        if (currentTime >= 5 && currentTime < 12) {
          setGreeting('Good Morning, Manager!');
        } else if (currentTime >= 12 && currentTime < 18) {
          setGreeting('Good Afternoon, Manager!');
        } else {
          setGreeting('Good Evening, Manager!');
        }
      };
      getCurrentTime();
      const intervalId = setInterval(getCurrentTime, 60000);
      return () => clearInterval(intervalId);
    }, []); 

    return (
      <div>
        <p>{greeting}</p>
      </div>
    );
  };
  
  export default Greeting;