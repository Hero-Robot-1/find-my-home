import axios from 'axios';

export const yad2ItemToProperty = (yad2Item) => {
    return {
        propertyId: yad2Item.id,
        propertyDateAdded: yad2Item.date_added,
        title: yad2Item.title_1,
        addressLine: yad2Item.row_1,
        description: yad2Item.search_text,
        price: yad2Item.price,
        street: yad2Item.street,
        coordinates: {
            latitude: yad2Item.coordinates?.latitude,
            longitude: yad2Item.coordinates?.longitude,
        },
        rooms: !!yad2Item.row_3 && yad2Item.row_3[0],
        meters: !!yad2Item.row_3 && yad2Item.row_3[1],
        floorNumber: !!yad2Item.row_3 && yad2Item.row_3[2],
        primaryImage: !!yad2Item.images_urls && yad2Item.images_urls[0],
        images: yad2Item.images_urls,
        link: `https://www.yad2.co.il/s/c/${yad2Item.id}`,
        merchant: yad2Item.merchant,
        archived: false,
        liked: false,
        call: false,
        explore: false
    }
}

export const getYad2Page = async (pageNumber = 1,
                                  startDate = null,
                                  endDate = Date.now()) => {
    let url = `https://gw.yad2.co.il/feed-search-legacy/realestate/rent?topArea=2&area=1&' +
        'city=5000&rooms=4--1&price=9450-9500&parking=1&elevator=1&forceLdLoad=true&page=${pageNumber}`;

    if (!!startDate) {
        url += `&startDate=${startDate}-${endDate}`
    }

    return axios.get(url, {
        headers: {"Content-Type": "application/json; charset=utf-8"}
    })
        .then(response => {
            const properties = response.data?.data?.feed?.feed_items
                .map(yad2ItemToProperty)
                .filter((item) => !!item.propertyId);
            const pagination = response.data?.data?.pagination;

            return {
                properties,
                pagination
            };
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
};

