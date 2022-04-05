import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import { LoginContext } from "../context/LoginContext";

import logo from "../assets/logo.webp";

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

const NavItems = ({ user, fetched }) => {
    const [showMenu, setShowMenu] = useState(false);

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

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    });

    return (
        <nav className={styles.links}>
            <div className={showMenu ? null : styles.off}>
                {fetched ? (
                    <>
                        {showMenu ? (
                            <i
                                className="fas fa-times"
                                onClick={() => setShowMenu(false)}
                            ></i>
                        ) : (
                            <i
                                className="fas fa-bars"
                                onClick={() => setShowMenu(true)}
                            ></i>
                        )}

                        <ul className={styles.nav_items}>
                            <NavItem
                                name="Browse"
                                link="/browse"
                                click={() => setShowMenu(false)}
                            />
                            {user ? (
                                <NavItem
                                    name="Create"
                                    link="/create"
                                    click={() => setShowMenu(false)}
                                />
                            ) : null}
                        </ul>

                        {user ? (
                            <img
                                className={styles.avatar}
                                onClick={() => setDropdown(!dropdown)}
                                ref={imgRef}
                                src={user.avatar}
                                alt="User avatar"
                                width={50}
                                height={50}
                            />
                        ) : (
                            <button
                                onClick={() =>
                                    (window.location.href = `${url}/auth/login`)
                                }
                                className={styles.login}
                            >
                                Login
                            </button>
                        )}
                    </>
                ) : null}
            </div>
            {dropdown ? (
                <Dropdown
                    innerRef={dropdownRef}
                    close={() => setDropdown(false)}
                />
            ) : null}
        </nav>
    );
};

const Navbar = () => {
    const { user, fetched } = useContext(LoginContext);

    return (
        <header>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    <img src={logo} alt="Recipe logo" width={52} height={52} />
                    <h3>Recipe Website</h3>
                </Link>

                <NavItems {...{ user, fetched }} />
            </div>
        </header>
    );
};

export default Navbar;
