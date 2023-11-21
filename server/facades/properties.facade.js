import axios from "axios";

export const yad2ItemToProperty = (yad2Item) => {
    return {
        recordId: yad2Item.id,
        dateAdded: yad2Item.date_added,
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
        link: `https://www.yad2.co.il/s/c/${yad2Item.id}`
    }
}

export const listItemsFromYad2 = async () => {
    return axios.get('https://gw.yad2.co.il/feed-search-legacy/realestate/rent?topArea=2&area=1&city=5000&rooms=3' +
        '--1&price=4000-9500&parking=1&elevator=1&forceLdLoad=true&limit=4', {
        headers: {"Content-Type": "application/json; charset=utf-8"}
    })
        .then(response => {
            return response.data?.data?.feed?.feed_items
                .map(yad2ItemToProperty)
                .filter((item) => !!item.recordId);
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
};
