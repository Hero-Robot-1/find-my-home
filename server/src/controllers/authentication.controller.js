import { db } from '../models/index.js';
import { verifyGoogleToken } from "../authentication/authentication.client.js";

const User = db.users;

export const login = async (req, res) => {
    try {
        if (!req.body.credential) {
            return res.status(400).json({ message: "Credential is required" });
        }

        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
            return res.status(400).json({ message: verificationResponse.error });
        }

        const profile = verificationResponse.payload;
        const [user] = await User.findOrCreate({
            where: { email: profile.email },
            defaults: {
                fullName: profile.name,
                firstName: profile.given_name,
                lastName: profile.family_name,
                picture: profile.picture,
                email: profile.email,
            }
        });

        res.send({ user });
    } catch (error) {
        res.status(500).json({ message: error?.message || "Login failed" });
    }
};
