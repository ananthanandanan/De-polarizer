import React, { useState, useContext } from 'react'
import './Nav.css'

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';
import { AuthContext } from "../Context/AuthContext.js"

function Nav() {

    const [menutoggle, setMenutoggle] = useState(false)
    const { user } = useContext(AuthContext)

    const Toggle = () => {
        setMenutoggle(!menutoggle)
        console.log(menutoggle)
    }

    const closeMenu = () => {
        setMenutoggle(false)
    }

    const logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <div className="header">
            <div className="logo-nav">
                <a className='left-logo' href="#home" onClick={() => { closeMenu() }}>DePolarizer</a>
                <div className='right-navigations'>
                    <div className={menutoggle ? "nav-options active" : "nav-options"}>
                        <Link to='/'>
                            <a onClick={() => { closeMenu() }}>Home</a>
                        </Link>
                        <Link to={user ? '/signin' : '/'}>
                            <a onClick={() => { closeMenu() }}>{user ? user.username : `${<PersonIcon />}Sign In`}</a>
                        </Link>
                        {
                            user ?
                                <a onClick={() => logout()}>Log out</a>
                                : null
                        }
                    </div>
                </div>
            </div>
            <div className="mobile-nav">
                <div className='mobile-menu'>
                    <div onClick={() => { Toggle() }}>
                        {menutoggle ? (
                            <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                        ) : (
                            <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav
