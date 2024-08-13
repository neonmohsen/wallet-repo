import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { page = 1, limit = 5 } = req.query;

    const response = await fetch(
        `https://onchain.dextrading.com/valuable_wallets?network=eth&page=${page}&limit=${limit}`
    );
    const wallets = await response.json();

    res.status(200).json({ wallets });
}
