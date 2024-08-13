"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface Wallet {
    walletAddress: string;
    netProfit: number;
}

export default function HomePage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10); 
    const [sortKey, setSortKey] = useState<"walletAddress" | "netProfit">(
        "netProfit"
    );
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const fetchWallets = async () => {
            const response = await fetch(
                `/api/wallets?page=${currentPage}&limit=5` 
            );
            const data = await response.json();
            setWallets(data.wallets);
           
        };
        fetchWallets();
    }, [currentPage]);

    const handleSort = (key: "walletAddress" | "netProfit") => {
        setSortKey(key);
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        setCurrentPage(1); // Reset to first page on sort
    };

    const sortedWallets = [...wallets].sort((a, b) => {
        const valueA =
            sortKey === "walletAddress" ? a.walletAddress : a.netProfit;
        const valueB =
            sortKey === "walletAddress" ? b.walletAddress : b.netProfit;
        return sortOrder === "asc"
            ? valueA > valueB
                ? 1
                : -1
            : valueA < valueB
            ? 1
            : -1;
    });

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <h1 className={styles.header}>Valuable Wallets</h1>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("walletAddress")}>
                                Wallet Address{" "}
                                {sortKey === "walletAddress"
                                    ? sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </th>
                            <th onClick={() => handleSort("netProfit")}>
                                Net Profit{" "}
                                {sortKey === "netProfit"
                                    ? sortOrder === "asc"
                                        ? "↑"
                                        : "↓"
                                    : ""}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedWallets.map((wallet) => (
                            <tr key={wallet.walletAddress}>
                                <td>
                                    <Link
                                        href={`/wallet/${wallet.walletAddress}`}
                                    >
                                        {wallet.walletAddress}
                                    </Link>
                                </td>
                                <td>{wallet.netProfit.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pagination}>
                    <button
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className={styles.paginationButton}
                    >
                        Previous
                    </button>
                    <span className={styles.pageInfo}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className={styles.paginationButton}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
