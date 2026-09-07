import prisma from '../configs/prisma.js';

// Add Shipping Address
export const addAddress = async (req, res) => {
    try {
        const addressData = req.body.address || req.body;
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = addressData;

        if (!firstName || !lastName || !street || !city || !state || !phone) {
            return res.json({ success: false, message: "Missing required address fields" });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: req.userId,
                firstName,
                lastName,
                email: email || '',
                street,
                city,
                state,
                zipcode: zipcode ? parseInt(zipcode) : 100001,
                country: country || 'Nigeria',
                phone
            }
        });

        res.json({ success: true, message: "Address added successfully", address: newAddress });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get All Saved Addresses for Logged-In User
export const getAddress = async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: req.userId },
            orderBy: { id: 'desc' }
        });

        res.json({ success: true, addresses });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Delete an Address 
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.address.deleteMany({
            where: {
                id: id,
                userId: req.userId
            }
        });

        res.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
};