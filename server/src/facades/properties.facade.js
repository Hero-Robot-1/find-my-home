import axios from 'axios';

const BASE_URL = 'https://gw.yad2.co.il/realestate-feed/forsale/map' +
    '?city=5000&area=1&region=3&maxPrice=6000000&minRooms=3&maxRooms=5&parking=1';

// 4×4 grid covering all of Tel Aviv (16 parallel queries)
const LAT = [32.025, 32.055, 32.085, 32.115, 32.145];
const LON = [34.740, 34.768, 34.796, 34.823, 34.850];
const GRID_BBOXES = LAT.slice(0, -1).flatMap((minLat, i) =>
    LON.slice(0, -1).map((minLon, j) =>
        `${minLat},${minLon},${LAT[i + 1]},${LON[j + 1]}`
    )
);

export const yad2ItemToProperty = (yad2Item) => {
    const street = yad2Item.address?.street?.text || '';
    const houseNumber = yad2Item.address?.house?.number || '';
    const propertyType = yad2Item.additionalDetails?.property?.text || '';
    return {
        propertyId: yad2Item.token,
        propertyDateAdded: null,
        title: `${propertyType} ${street} ${houseNumber}`.trim(),
        addressLine: `${street} ${houseNumber}`.trim(),
        neighborhood: yad2Item.address?.neighborhood?.text,
        description: null,
        price: yad2Item.price?.toString(),
        street,
        coordinates: {
            latitude: yad2Item.address?.coords?.lat,
            longitude: yad2Item.address?.coords?.lon,
        },
        rooms: yad2Item.additionalDetails?.roomsCount?.toString(),
        meters: yad2Item.additionalDetails?.squareMeter?.toString(),
        floorNumber: yad2Item.address?.house?.floor?.toString(),
        images: yad2Item.metaData?.images,
        link: `https://www.yad2.co.il/s/c/${yad2Item.token}`,
        merchant: yad2Item.adType !== 'private',
        archived: false,
        liked: false,
        call: false,
        explore: false
    };
};

export const getYad2Page = async (bBox, pageNumber = 1) => {
    const url = `${BASE_URL}&bBox=${bBox}&zoom=12&page=${pageNumber}`;
    return axios.get(url, {
        proxy: {
            host: process.env.PROXY_HOST,
            port: parseInt(process.env.PROXY_PORT),
            auth: { username: process.env.PROXY_USER, password: process.env.PROXY_PASS },
            protocol: 'http',
        }
    })
        .then(response => {
            const properties = (response.data?.data?.markers || [])
                .map(yad2ItemToProperty)
                .filter(item => !!item.propertyId)
                .filter(item => item.images?.length > 0);
            const pagination = response.data?.data?.pagination || { last_page: 1 };
            return { properties, pagination };
        })
        .catch(err => {
            console.log(`Error fetching bBox ${bBox}:`, err.message);
            return { properties: [], pagination: { last_page: 1 } };
        });
};

export const getYad2AllProperties = async () => {
    console.log(`Querying ${GRID_BBOXES.length} grid areas in parallel...`);
    const results = await Promise.all(GRID_BBOXES.map(bBox => getYad2Page(bBox)));

    const seen = new Set();
    const properties = [];
    for (const { properties: batch } of results) {
        for (const prop of batch) {
            if (!seen.has(prop.propertyId)) {
                seen.add(prop.propertyId);
                properties.push(prop);
            }
        }
    }
    console.log(`Found ${properties.length} unique properties across ${GRID_BBOXES.length} areas`);
    return { properties };
};
