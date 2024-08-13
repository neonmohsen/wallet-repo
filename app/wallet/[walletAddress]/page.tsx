"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import styles from "./page.module.css";

interface WalletSummary {
    date: string;
    buyVolume: number;
    sellVolume: number;
    buyCount: number;
    sellCount: number;
    totalTransactions: number;
    absoluteDifference: number; // Absolute difference of buyVolume and sellVolume
    isProfit: boolean; // Whether it's a profit (buyVolume > sellVolume)
}

export default function WalletPage({
    params,
}: {
    params: { walletAddress: string };
}) {
    const { walletAddress } = params;
    const [summary, setSummary] = useState<WalletSummary[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);

            try {
                const response = await axios.get(
                    `/api/walletsummary/${walletAddress}?network=eth`
                );

                const rawData = response.data.data;
                const parsedData: WalletSummary[] = [];

                // Parsing data for weeks
                const totalBuyAmounts = rawData.totalBuyAmounts.week || {};
                const totalSellAmounts = rawData.totalSellAmounts.week || {};
                const totalBuySellTimes = rawData.totalBuySellTimes.week || {};

                for (const week in totalBuyAmounts) {
                    const buyVolume = parseFloat(
                        (totalBuyAmounts[week] as string) || "0"
                    );
                    const sellVolume = parseFloat(
                        (totalSellAmounts[week] as string) || "0"
                    );
                    const totalTransactions = parseInt(
                        (totalBuySellTimes[week] as string) || "0"
                    );

                    parsedData.push({
                        date: week, // Displaying week
                        buyVolume,
                        sellVolume,
                        buyCount: 0, // Assuming buyCount is part of the data
                        sellCount: 0, // Assuming sellCount is part of the data
                        totalTransactions, // Total transactions (buy + sell)
                        absoluteDifference: Math.abs(buyVolume - sellVolume), // Absolute difference for display
                        isProfit: buyVolume > sellVolume, // Determine if profit or loss
                    });
                }

                setSummary(parsedData);
            } catch (error) {
                console.error("Error fetching wallet summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [walletAddress]); // Run only when walletAddress changes

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1 className={styles.header}>
                    Wallet Summary for
                    <span className={styles.walletAddress}>
                        {walletAddress}
                    </span>
                </h1>
                <Link href="/" className={styles.backLink}>
                    ← Back to Wallets List
                </Link>
                {loading ? (
                    <div className={styles.loader}>Loading...</div>
                ) : (
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={500}>
                            <ComposedChart data={summary}>
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: "#fff", fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tickFormatter={(value) =>
                                        `$${value / 1000000}M`
                                    }
                                    tick={{ fill: "#fff", fontSize: 12 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fill: "#fff", fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#333",
                                        border: "none",
                                        borderRadius: "10px",
                                    }}
                                    labelStyle={{ color: "#fff" }}
                                />
                                <Legend wrapperStyle={{ color: "#fff" }} />
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#444"
                                />

                                {/* Bar Chart for Volume Difference */}
                                <Bar
                                    yAxisId="left"
                                    dataKey="absoluteDifference"
                                    barSize={30}
                                    radius={[10, 10, 0, 0]}
                                >
                                    {summary.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                entry.isProfit
                                                    ? "#00c853" // Green for profit (buyVolume > sellVolume)
                                                    : "#d32f2f" // Red for loss (buyVolume < sellVolume)
                                            }
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="absoluteDifference"
                                        position="top"
                                        formatter={(value: any) =>
                                            `$${(value / 1000000).toFixed(2)}M`
                                        }
                                        fill="#fff"
                                        style={{ fontSize: "12px" }}
                                    />
                                </Bar>

                                {/* Line Chart for Total Transactions */}
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="totalTransactions"
                                    stroke="#ffeb3b"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
