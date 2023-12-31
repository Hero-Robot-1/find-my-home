import { ARRAY, DATE, Sequelize, TEXT, JSON, BOOLEAN } from 'sequelize';
import { STRING } from 'sequelize/lib/data-types';
import dotenv from 'dotenv';

dotenv.config();

const Property = (sequelize) => {
    return sequelize.define("property", {
        propertyId: {
            type: STRING,
            primaryKey: true
        },
        propertyDateAdded: {
            type: DATE
        },
        title: {
            type: STRING
        },
        addressLine: {
            type: STRING
        },
        neighborhood: {
            type: STRING
        },
        description: {
            type: TEXT
        },
        price: {
            type: STRING
        },
        street: {
            type: STRING
        },
        coordinates: {
            type: JSON
        },
        rooms: {
            type: STRING
        },
        meters: {
            type: STRING
        },
        floorNumber: {
            type: STRING
        },
        images: {
            type: ARRAY(STRING)
        },
        link: {
            type: STRING
        },
        merchant: {
            type: BOOLEAN
        },
        archived: {
            type: BOOLEAN
        },
        liked: {
            type: BOOLEAN
        },
        call: {
            type: BOOLEAN
        },
        explore: {
            type: BOOLEAN
        }
    })
};

const User = (sequelize) => {
    return sequelize.define("users", {
        fullName: {
            type: STRING
        },
        firstName: {
            type: STRING
        },
        lastName: {
            type: STRING
        },
        picture: {
            type: STRING
        },
        email: {
            type: STRING
        },
    })
};


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "postgres",
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const dbConnector = {};

dbConnector.sequelize = sequelize;
dbConnector.properties = Property(sequelize)
dbConnector.users = User(sequelize)
export const db = dbConnector;
