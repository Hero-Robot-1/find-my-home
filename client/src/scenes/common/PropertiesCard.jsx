import * as React from 'react';
import { useState } from 'react';
import api from "../../api";
import ImageCarousel from "./Carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ClearIcon from '@mui/icons-material/Clear';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import RestoreIcon from '@mui/icons-material/Restore';
import CallIcon from '@mui/icons-material/Call';
import ExploreIcon from '@mui/icons-material/Explore';

const ActionButton = ({ onClick, children, variant = "default", title }) => {
    const styles = {
        default: "text-muted-foreground hover:text-foreground hover:bg-accent",
        danger: "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40",
        like: "text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40",
        call: "text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40",
        explore: "text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
    };
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-md transition-colors duration-150 ${styles[variant]}`}
        >
            {children}
        </button>
    );
};

const PropertyCard = ({ mode, item, onDeleteHandler }) => {
    const [id] = useState(item.propertyId);
    const [merchant] = useState(item.merchant);

    const patch = (fields, data) => {
        onDeleteHandler(id);
        api.patch(`/properties/${id}`, { fields, data });
    };

    const renderActions = () => {
        if (mode === 'trash') {
            return (
                <ActionButton
                    onClick={() => patch(['archived', 'liked', 'call', 'explore'], { archived: false, liked: false, call: false, explore: false })}
                    variant="default"
                    title="Restore"
                >
                    <RestoreIcon style={{ fontSize: 18 }} />
                </ActionButton>
            );
        }
        if (mode === 'new') {
            return (
                <>
                    <ActionButton onClick={() => patch(['liked'], { liked: true })} variant="like" title="Like">
                        <FavoriteIcon style={{ fontSize: 18 }} />
                    </ActionButton>
                    <ActionButton onClick={() => patch(['archived'], { archived: true })} variant="danger" title="Archive">
                        <ClearIcon style={{ fontSize: 18 }} />
                    </ActionButton>
                </>
            );
        }
        if (mode === 'liked') {
            return (
                <>
                    <ActionButton onClick={() => patch(['call'], { call: true })} variant="call" title="Reach out">
                        <CallIcon style={{ fontSize: 18 }} />
                    </ActionButton>
                    <ActionButton onClick={() => patch(['archived'], { archived: true })} variant="danger" title="Archive">
                        <ClearIcon style={{ fontSize: 18 }} />
                    </ActionButton>
                </>
            );
        }
        if (mode === 'explore') {
            return (
                <ActionButton onClick={() => patch(['archived'], { archived: true })} variant="danger" title="Archive">
                    <ClearIcon style={{ fontSize: 18 }} />
                </ActionButton>
            );
        }
        return (
            <>
                <ActionButton onClick={() => patch(['explore'], { explore: true })} variant="explore" title="Explore">
                    <ExploreIcon style={{ fontSize: 18 }} />
                </ActionButton>
                <ActionButton onClick={() => patch(['archived'], { archived: true })} variant="danger" title="Archive">
                    <ClearIcon style={{ fontSize: 18 }} />
                </ActionButton>
            </>
        );
    };

    const price = item.price && item.price !== '0'
        ? `₪${parseInt(item.price).toLocaleString()}`
        : null;

    return (
        <div className={`flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${merchant ? 'border-amber-300 dark:border-amber-700' : 'border-border'}`}>
            {/* Image */}
            <div className="relative">
                <ImageCarousel images={item.images} />
                {merchant && (
                    <span className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-medium px-2 py-0.5 rounded-full leading-none">
                        סוכנות
                    </span>
                )}
                <button
                    onClick={() => window.open(item.link, "_blank")}
                    className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/65 text-white rounded-full p-1.5 transition-colors"
                    title="Open on Yad2"
                >
                    <FindInPageIcon style={{ fontSize: 15 }} />
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 gap-1" dir="rtl">
                <h3 className="font-semibold text-card-foreground text-sm leading-snug line-clamp-1">
                    {item.title}
                </h3>
                {item.neighborhood && (
                    <p className="text-muted-foreground text-xs line-clamp-1">{item.neighborhood}</p>
                )}
                {price && (
                    <p className="text-card-foreground font-bold text-base mt-1">{price}</p>
                )}

                {/* Detail chips */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                    {item.rooms && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                            🛏 {item.rooms} חד'
                        </span>
                    )}
                    {item.meters && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                            {item.meters} מ"ר
                        </span>
                    )}
                    {item.floorNumber && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                            קומה {item.floorNumber}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-0.5 px-3 py-2 border-t border-border">
                {renderActions()}
            </div>
        </div>
    );
};

export default PropertyCard;
