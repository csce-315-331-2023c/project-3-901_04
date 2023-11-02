import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <Link to="/menu">Menu</Link>
            <Link to="/customer">Customer</Link>
            <Link to="/">Home</Link>
            <Link to="/cashier">Cashier</Link>
            <Link to="/manager">Manager</Link>
        </nav>
    );
};

export default Navbar;
