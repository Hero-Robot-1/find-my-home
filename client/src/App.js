import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Home, Login, SignUp } from "./scenes/authentication";
import PropertiesGrid from "./scenes/properties";
import Topbar from "./scenes/global/Topbar";

function App() {
    const [theme, colorMode] = useMode();
    const [user, setUser] = useState({});

    useEffect(() => {
        const theUser = localStorage.getItem("user");

        if (theUser && !theUser.includes("undefined")) {
            setUser(JSON.parse(theUser));
        }
    }, []);

    return (
        <ColorModeContext.Provider value={ colorMode }>
            <ThemeProvider theme={ theme }>
                <CssBaseline/>
                <div className="app">
                    <Sidebar user={ user }/>
                    <main className="content">
                        <Topbar user={ user }/>
                        <Routes>
                            <Route path="/" element={ <Home/> }/>
                            <Route path="/home" element={ <Home/> }/>
                            <Route path="/signup" element={ user?.email ? <Home user={ user }/> : <SignUp/> }/>
                            <Route path="/login" element={ user?.email ? <Home user={ user }/> : <Login/> }/>
                            <Route path="/properties" element={ <PropertiesGrid/> }/>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
