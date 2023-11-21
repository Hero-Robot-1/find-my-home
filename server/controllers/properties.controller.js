import { db } from '../models/index.js';
import axios from 'axios';
// import * as yad2Facade from "../facades/properties.facade.js";
import { listItemsFromYad2, yad2ItemToProperty } from "../facades/properties.facade.js";

const Property = db.properties;

export const listProperties = (req, res) => {
    Property.findAll({})
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

export const syncProperties = async (req, res) => {
    const properties = await listItemsFromYad2();
    Property.bulkCreate(properties, { returning: true })
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

export const createProperty = (req, res) => {
    const propertyParams = {
      "recordId":"wlj1cmjr",
      "dateAdded":"2023-11-08 13:33:31",
      "title":"יהודה בורלא",
      "addressLine":"יהודה בורלא",
      "description":"מרפסת מצב הנכס ב למד\nבני=",
      "price":"7,650 ₪",
      "street":"יהודה בורלא",
      "coordinates":{"latitude":32.1083461833333,"longitude":34.7907483333333},
      "rooms":"3 חדרים",
      "meters":"80 מ״ר",
      "floorNumber":"קומה 6",
      "primaryImage":"https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_1_OsYPbrwBvY_20231108.jpeg",
      "images":["https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_1_OsYPbrwBvY_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_2_hMFs4ULTS1_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_3_TpKMoWEmR7_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_4_K2xdn_fgCv_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_5_7mfacnzllQ_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_6_M6lSSmyBSg_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_7_AOYK49ESuU_20231108.jpeg",
          "https://img.yad2.co.il/Pic/202311/08/2_6/o/y2_8_YMIS030zz5_20231108.jpeg"],
      "link":"https://www.yad2.co.il/s/c/wlj1cmjr"
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
//
// export const listTransactions = (req, res) => {
//
//   Transaction.findAll({})
//     .then(data => {
//       res.send({
//         transactions: data
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message
//       });
//     });
// };
//
// export const updateTransaction = (req, res) => {
//   const id = req.params.id;
//
//   Transaction.update(req.body, {
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Transaction was updated successfully."
//         });
//       } else {
//         res.send({
//           message: `Cannot update Transaction with id=${id}`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Transaction with id=" + id
//       });
//     });
//
// };
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

// export const listProperties = (req, res) => {
//       axios.get('https://gw.yad2.co.il/feed-search-legacy/realestate/rent?topArea=2&area=1&city=5000&rooms=3' +
//           '--1&price=4000-9500&parking=1&elevator=1&forceLdLoad=true&limit=4', {
//         headers: {"Content-Type": "application/json; charset=utf-8"}
//       })
//       .then(response => {
//         const items = response.data?.data?.feed?.feed_items
//             .map(yad2ItemToProperty)
//             .filter((item) => !!item.recordId)
//         res.send({ properties: items })
//       })
//       .catch(err => {
//         console.log('Error: ', err.message);
//       });
// };

