import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { fetchUserData } from "./utils/db";

import "./styles/index.scss";

import { LoginContext } from "./context/LoginContext";

// Importing components
import NavBar from "./components/NavBar";

// Importing pages
const Landing = lazy(() => import("./pages/Landing"));
const Browse = lazy(() => import("./pages/Browse"));
const Create = lazy(() => import("./pages/Create"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Recipe = lazy(() => import("./pages/Recipe"));

const App = () => {
    const [user, setUser] = useState(null);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        fetchUserData().then((res) => {
            setUser(res);
            setFetched(true);
        });
    }, []);

    return (
        <LoginContext.Provider value={{ user, setUser, fetched }}>
            <NavBar />
            <main>
                <Suspense fallback={<div></div>}>
                    <Routes>
                        <Route index element={<Landing />} path="/" />1
                        <Route element={<Create />} path="/create" />
                        <Route element={<Dashboard />} path="/dashboard" />
                        <Route element={<Browse />} path="/browse" />
                        <Route element={<Recipe />} path="/recipe/:id"></Route>
                    </Routes>
                </Suspense>
            </main>
        </LoginContext.Provider>
    );
};

export default App;
