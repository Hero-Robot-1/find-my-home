import { db } from '../models/index.js';
import { verifyGoogleToken } from "../authentication/authentication.client.js";

const User = db.users;

export const signUp = async (req, res) => {
    try {
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);

            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }

            const profile = verificationResponse?.payload;
            const userParams = {
                fullName: profile?.name,
                firstName: profile?.given_name,
                lastName: profile?.family_name,
                picture: profile?.picture,
                email: profile?.email
            };

            User.create(userParams)
                .then(data => {
                    res.send({
                        user: data
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                        err.message
                    });
                });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred. Registration failed.",
        });
    }

};

export const login = async (req, res) => {
    try {
        if (req.body.credential) {
            const verificationResponse = await verifyGoogleToken(req.body.credential);
            if (verificationResponse.error) {
                return res.status(400).json({
                    message: verificationResponse.error,
                });
            }

            const profile = verificationResponse?.payload;
            const condition = profile?.email ? { email: profile.email } : null;

            const existsInDB = User.findOne(({ where: condition }))
                .then(data => {
                    res.send({
                        user: data
                    })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                        err.message
                    });
                });

            if (!existsInDB) {
                return res.status(400).json({
                    message: "You are not registered. Please sign up",
                });
            }
        }
    } catch (error) {
        res.status(500).json({
            message: error?.message || error,
        });
    }
};
