import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CallIcon from "@mui/icons-material/Call";
import ExploreIcon from "@mui/icons-material/Explore";

const navItems = [
    { title: "New Properties", to: "/properties", icon: <ReceiptOutlinedIcon style={{ fontSize: 18 }} /> },
    { title: "Liked", to: "/properties/liked", icon: <FavoriteIcon style={{ fontSize: 18 }} /> },
    { title: "Reach Out", to: "/properties/reach-out", icon: <CallIcon style={{ fontSize: 18 }} /> },
    { title: "Explore", to: "/properties/explore", icon: <ExploreIcon style={{ fontSize: 18 }} /> },
    { title: "Trash", to: "/properties/trash", icon: <DeleteIcon style={{ fontSize: 18 }} /> },
];

const NavItem = ({ title, to, icon, isCollapsed, isActive }) => (
    <Link
        to={to}
        title={isCollapsed ? title : undefined}
        className={[
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
            isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        ].join(" ")}
    >
        <span className="flex-shrink-0">{icon}</span>
        {!isCollapsed && <span className="truncate">{title}</span>}
    </Link>
);

const Sidebar = ({ onCollapsedChange }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggle = () => {
        const next = !isCollapsed;
        setIsCollapsed(next);
        onCollapsedChange?.(next);
    };

    const isActive = (to) => {
        if (to === "/properties") {
            return location.pathname === "/properties" || location.pathname === "/" || location.pathname === "";
        }
        return location.pathname === to;
    };

    return (
        <aside
            className="fixed left-0 top-0 h-full bg-card border-r border-border flex flex-col z-50 transition-all duration-300"
            style={{ width: isCollapsed ? 64 : 240 }}
        >
            {/* Header */}
            <div
                className={[
                    "flex items-center h-14 border-b border-border px-3 flex-shrink-0",
                    isCollapsed ? "justify-center" : "justify-between",
                ].join(" ")}
            >
                {!isCollapsed && (
                    <span className="font-semibold text-foreground text-sm tracking-tight">
                        Find My Home
                    </span>
                )}
                <button
                    onClick={toggle}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <MenuOutlinedIcon style={{ fontSize: 18 }} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        {...item}
                        isCollapsed={isCollapsed}
                        isActive={isActive(item.to)}
                    />
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
