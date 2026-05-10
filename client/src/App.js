import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./scenes/global/Sidebar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar";
import NewProperties from "./scenes/new-properties/NewProperties";
import TrashProperties from "./scenes/trash/Trash";
import LikedProperties from "./scenes/liked/LikedProperties";
import ReachOutProperties from "./scenes/reach-out/ReachOutProperties";
import ExploreProperties from "./scenes/explore/ExploreProperties";
import Login from "./scenes/authentication/Login";

function App() {
    const [theme, colorMode] = useMode();
    const [user, setUser] = useState({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const theUser = localStorage.getItem("user");
        if (theUser && !theUser.includes("undefined")) {
            setUser(JSON.parse(theUser));
        }
    }, []);

    useEffect(() => {
        if (theme.palette.mode === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme.palette.mode]);

    if (!user?.email) {
        return <Login />;
    }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Sidebar user={user} onCollapsedChange={setSidebarCollapsed} />
                    <main
                        className="flex flex-col flex-1 min-h-screen transition-all duration-300"
                        style={{ marginLeft: sidebarCollapsed ? 64 : 240 }}
                    >
                        <Topbar user={user} />
                        <div className="flex-1">
                            <Routes>
                                <Route path="/*" element={<NewProperties />} />
                                <Route exact path="/properties" element={<NewProperties />} />
                                <Route path="/properties/liked" element={<LikedProperties />} />
                                <Route path="/properties/reach-out" element={<ReachOutProperties />} />
                                <Route path="/properties/explore" element={<ExploreProperties />} />
                                <Route path="/properties/trash" element={<TrashProperties />} />
                            </Routes>
                        </div>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
