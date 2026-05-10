import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTheme } from "@mui/material";

const Topbar = ({ user }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-end gap-2 border-b border-border bg-background/95 backdrop-blur-sm px-4 flex-shrink-0">
            <button
                onClick={colorMode.toggleColorMode}
                className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Toggle theme"
            >
                {theme.palette.mode === "dark"
                    ? <DarkModeOutlinedIcon style={{ fontSize: 18 }} />
                    : <LightModeOutlinedIcon style={{ fontSize: 18 }} />
                }
            </button>

            {user?.email && (
                <div className="flex items-center gap-2">
                    {user.picture && (
                        <img
                            src={user.picture}
                            alt={user.firstName}
                            className="w-7 h-7 rounded-full"
                        />
                    )}
                    <span className="text-sm text-muted-foreground hidden sm:block">
                        {user.firstName}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        aria-label="Logout"
                    >
                        <LogoutIcon style={{ fontSize: 18 }} />
                    </button>
                </div>
            )}
        </header>
    );
};

export default Topbar;
