import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoimg from '../media/mos.svg';

const Navbar = () => {
    const [visible, setVisible] = useState(true);
    const isEmployee = JSON.parse(localStorage.getItem('isEmployee')); // Retrieve the isEmployee flag

    console.log(isEmployee);

    const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        setVisible(currentScrollPos <= 0);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="hover-reveal-area" onMouseOver={() => setVisible(true)}></div>
            <nav className={visible ? 'navbar visible' : 'navbar hidden'}>
                {
                    !isEmployee && <>
                        <Link to="/menu">Menu</Link>
                        <Link to="/home" className="home-link">
                            <img src={logoimg} alt="logo" height="40" width="100" />
                        </Link>
                        <Link to="/customer">Customer</Link>
                    </>
                }
                {isEmployee && <>
                    <Link to="/menu">Menu</Link>
                    <Link to="/customer">Customer</Link>
                    <Link to="/home" className="home-link">
                        <img src={logoimg} alt="logo" height="40" width="100" />
                    </Link>
                    <Link to="/cashier">Cashier</Link>
                    <Link to="/manager">Manager</Link>
                </>}
            </nav>
        </>
    );
};

export default Navbar;
