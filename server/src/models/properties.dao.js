import {db} from './index.js';

const Property = db.properties;

export const listProperties = (req, res) => {
    Property.findAll({ where: { archived: false }})
        .then(data => {
            res.send({
                properties: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message
            });
        });
};

export const bulkCreateProperties = async (properties) => {
    await Property.bulkCreate(properties, { returning: true })
        .then(data => {
            return {
                properties: data
            };
        })
        .catch(err => {
            throw new Error(JSON.stringify(err.message));
        });
};

export const createProperty = (req, res) => {
    const propertyParams = {
        "propertyId": "wlj1c2jr",
        "dateAdded": "2023-11-08 13:33:31",
        "title": "יהודה בורלא",
        "addressLine": "יהודה בורלא",
        "description": "מרפסת מצב הנכס ב למד\nבני=",
        "price": "7,650 ₪",
        "street": "יהודה בורלא",
        "coordinates": {"latitude": 32.1083461833333, "longitude": 34.7907483333333},
        "rooms": "3 חדרים",
        "meters": "80 מ״ר",
        "floorNumber": "קומה 6",
        "primaryImage": "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_1_OsYPbrwBvY_20231108.jpeg",
        "images": ["https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_1_OsYPbrwBvY_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_2_hMFs4ULTS1_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_3_TpKMoWEmR7_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_4_K2xdn_fgCv_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_5_7mfacnzllQ_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_6_M6lSSmyBSg_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_7_AOYK49ESuU_20231108.jpeg",
            "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_8_YMIS030zz5_20231108.jpeg"],
        "link": "https://www.yad2.co.il/s/c/wlj1cmjr",
        "merchant": false,
        "archived": false,
        "liked": false
    }

    Property.create(propertyParams)
        .then(data => {
            res.send({
                property: data
            })
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message
            });
        });

};

export const updateProperty = (req, res) => {
    const id = req.params.id;
    const fields = req.body.fields;
    const data = req.body.data;

    const dataToUpdate = fields.reduce((acc, field) => {
        const fieldValue = data[field];
        return {...acc, [field]: fieldValue};
    }, {});

    Property.update(dataToUpdate, {
        where: { propertyId: id },
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Property was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Property with id=${id}`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Property with id=" + id
            });
        });
};
//
// export const deleteTransaction = (req, res) => {
//   const id = req.params.id;
//
//   Transaction.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Transaction was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Transaction with id=${id}`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Transaction with id=" + id
//       });
//     });
// };
