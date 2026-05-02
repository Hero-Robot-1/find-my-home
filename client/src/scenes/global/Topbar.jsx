import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useTheme } from "@mui/material";

const Topbar = ({ user }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-end border-b border-border bg-background/95 backdrop-blur-sm px-4 flex-shrink-0">
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
        </header>
    );
};

export default Topbar;
