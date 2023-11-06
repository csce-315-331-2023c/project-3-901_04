import React from 'react';
import { Link } from 'react-router-dom';

import logoimg from '../media/mos.svg';

const Navbar = () => {
    return (
        <nav>
            <Link to="/menu">Menu</Link>
            <Link to="/customer">Customer</Link>
            <Link to="/" Home>
                <img src={logoimg} height="40" width="100" />
            </Link>
            <Link to="/cashier">Cashier</Link>
            <Link to="/manager">Manager</Link>
        </nav>
    );
};

export default Navbar;