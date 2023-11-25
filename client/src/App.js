import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Home, Login, SignUp } from "./scenes/authentication";
import Topbar from "./scenes/global/Topbar";
import NewProperties from "./scenes/new-properties/NewProperties";
import TrashProperties from "./scenes/trash/Trash";
import LikedProperties from "./scenes/liked/LikedProperties";
import ReachOutProperties from "./scenes/reach-out/ReachOutProperties";
import ExploreProperties from "./scenes/explore/ExploreProperties";

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
                    <Sidebar className="sidebar" user={ user }/>
                    <main className="content">
                        <Topbar user={ user }/>
                        <Routes>
                            <Route path="/" element={ <NewProperties/> }/>
                            <Route path="/signup" element={ user?.email ? <NewProperties user={ user }/> : <SignUp/> }/>
                            <Route path="/login" element={ user?.email ? <NewProperties user={ user }/> : <Login/> }/>
                            <Route path="/properties" element={ user?.email ? <NewProperties user={ user }/> : <SignUp/> }/>
                            <Route path="/properties/liked" element={ user?.email ? <LikedProperties user={ user }/> : <SignUp/> }/>
                            <Route path="/properties/reach-out" element={ user?.email ? <ReachOutProperties user={ user }/> : <SignUp/> }/>
                            <Route path="/properties/explore" element={ user?.email ? <ExploreProperties user={ user }/> : <SignUp/> }/>
                            <Route path="/properties/trash" element={ user?.email ? <TrashProperties user={ user }/> : <SignUp/> }/>
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
