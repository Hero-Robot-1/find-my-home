import * as React from 'react';
import PropertyCard from "./PropertiesCard";

const PropertiesGrid = ({ mode, data, onDeleteHandler }) => {
    if (!data?.length) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No properties found</p>
                <p className="text-sm mt-1">Try syncing or changing the filter</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {data.map(item => (
                <PropertyCard
                    key={item.propertyId}
                    item={item}
                    mode={mode}
                    onDeleteHandler={onDeleteHandler}
                />
            ))}
        </div>
    );
};

export default PropertiesGrid;
