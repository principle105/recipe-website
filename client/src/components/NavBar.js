import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import { LoginContext } from "../context/LoginContext";

import logo from "../assets/logo.png";

import { url } from "../config";

import styles from "../styles/components/Navbar.module.scss";

const NavItem = ({ name, link, click }) => {
    return (
        <li>
            <NavLink
                to={link}
                className={({ isActive }) =>
                    isActive ? styles.active : undefined
                }
                onClick={click}
            >
                {name}
            </NavLink>
        </li>
    );
};

const Dropdown = ({ close, innerRef }) => {
    return (
        <div className={styles.dropdown} ref={innerRef}>
            <ul>
                <NavItem name="Dashboard" link="/dashboard" click={close} />
                <NavItem name="Settings" link="/settings" click={close} />
                <li>
                    <button
                        onClick={() =>
                            (window.location.href = `${url}/auth/logout`)
                        }
                        className={styles.logout}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

const Navbar = () => {
    const { user, fetched } = useContext(LoginContext);

    const [dropdown, setDropdown] = useState(false);

    const dropdownRef = useRef();
    const imgRef = useRef();

    const handleClickOutside = (e) => {
        if (
            dropdown &&
            !dropdownRef.current.contains(e.target) &&
            !imgRef.current.contains(e.target)
        ) {
            setDropdown(false);
        }
    };

    const close = () => {
        setDropdown(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    });

    return (
        <header>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src={logo} alt="recipe logo" />
                    <h3>Recipe Website</h3>
                </Link>

                <nav className={styles.links}>
                    <ul>
                        {fetched ? (
                            <>
                                <NavItem name="Browse" link="/browse" />
                                {user ? (
                                    <>
                                        <NavItem name="Create" link="/create" />
                                        <img
                                            className={styles.avatar}
                                            onClick={() =>
                                                setDropdown(!dropdown)
                                            }
                                            ref={imgRef}
                                            src={user.avatar}
                                            alt="User avatar"
                                        />
                                        {dropdown ? (
                                            <Dropdown
                                                innerRef={dropdownRef}
                                                close={close}
                                            />
                                        ) : null}
                                    </>
                                ) : (
                                    <li>
                                        <button
                                            onClick={() =>
                                                (window.location.href = `${url}/auth/login`)
                                            }
                                            className={styles.login}
                                        >
                                            Login
                                        </button>
                                    </li>
                                )}
                            </>
                        ) : null}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
