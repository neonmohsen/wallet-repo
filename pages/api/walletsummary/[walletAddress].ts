import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { walletAddress } = req.query;

        // Validate walletAddress
        if (!walletAddress) {
            return res.status(400).json({ error: "walletAddress is required" });
        }

        // Fetch the data from the external API
        const response = await fetch(
            `https://onchain.dextrading.com/walletsummary/${walletAddress}?network=eth`
        );

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(
                `Error fetching data from API: ${response.statusText}`
            );
        }

        const data = await response.json();

        // Return raw data
        res.status(200).json({ data });
    } catch (error) {
        console.error("Error in /api/walletsummary/[walletAddress]:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
