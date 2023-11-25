import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountMenu from "./AccountMenu";

const Topbar = ({ user }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    return (
        <Box display="flex" justifyContent="space-between" p={ 2 }>
            <Box display="flex" />

            <Box display="flex">
                <IconButton onClick={ colorMode.toggleColorMode }>
                    { theme.palette.mode === "dark" ? (
                        <DarkModeOutlinedIcon/>
                    ) : (
                        <LightModeOutlinedIcon/>
                    ) }
                </IconButton>

                <AccountMenu user={ user }/>
            </Box>
        </Box>
    );
};

export default Topbar;
