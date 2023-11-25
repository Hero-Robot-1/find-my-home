import { useState } from "react";
import { Menu, MenuItem, ProSidebar } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CallIcon from "@mui/icons-material/Call";
import ExploreIcon from '@mui/icons-material/Explore';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <MenuItem
            active={ selected === title }
            style={ {
                color: colors.grey[100]
                ,
            } }
            onClick={ () => setSelected(title) }
            icon={ icon }
        >
            <Typography>{ title }</Typography>
            <Link to={ to }/>
        </MenuItem>
    );
};

const Sidebar = ({ user }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Home");

    return (
        <Box
            sx={ {
                "& .pro-sidebar-inner": {
                    background: `${ colors.primary[400] } !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
            } }
        >
            <ProSidebar collapsed={ isCollapsed } width={ 240 } style={ { maxWidth: 250, position: "fixed" } }>
                <Menu iconShape="square">
                    <MenuItem
                        onClick={ () => setIsCollapsed(!isCollapsed) }
                        icon={ isCollapsed ? <MenuOutlinedIcon/> : undefined }
                        style={ {
                            margin: "10px 0 20px 0",
                            color: colors.grey[100],
                        } }
                    >
                        { !isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="2px"
                            >
                                <Typography variant="h3" color={ colors.grey[100] }>
                                    Find My Home
                                </Typography>
                                <IconButton onClick={ () => setIsCollapsed(!isCollapsed) }>
                                    <MenuOutlinedIcon/>
                                </IconButton>
                            </Box>
                        ) }
                    </MenuItem>

                    <Box paddingLeft={ isCollapsed ? undefined : "1%" }>
                        {/*<Item*/ }
                        {/*    title="Dashboard"*/ }
                        {/*    to="/"*/ }
                        {/*    icon={ <HomeOutlinedIcon/> }*/ }
                        {/*    selected={ selected }*/ }
                        {/*    setSelected={ setSelected }*/ }
                        {/*/>*/ }
                        <Item
                            title="New Properties"
                            to="/properties"
                            icon={ <ReceiptOutlinedIcon/> }
                            selected={ selected }
                            setSelected={ setSelected }
                        />
                        <Item
                            title="Liked Properties"
                            to="/properties/liked"
                            icon={ <FavoriteIcon/> }
                            selected={ selected }
                            setSelected={ setSelected }
                        />
                        <Item
                            title="Reach out"
                            to="/properties/reach-out"
                            icon={ <CallIcon/> }
                            selected={ selected }
                            setSelected={ setSelected }
                        />
                        <Item
                            title="Explore"
                            to="/properties/explore"
                            icon={ <ExploreIcon/> }
                            selected={ selected }
                            setSelected={ setSelected }
                        />
                        <Item
                            title="Trash"
                            to="/properties/trash"
                            icon={ <DeleteIcon/> }
                            selected={ selected }
                            setSelected={ setSelected }
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
