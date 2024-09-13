import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useUser from '../hooks/useUser';

export default function Home() {
    const { user } = useAuth();
    const getUser = useUser();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                await getUser();
            } catch (err) {
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [getUser]);

    const { email, wallet_address, balance } = user || {};

    const formatBalance = (balance) => {
        return parseFloat(balance).toFixed(4);
    };

    const truncateAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (!email) {
        return <div className="container mt-3">Please login first</div>;
    }

    return (
        <div className="container mt-3">
            <h2>Welcome to Your Dashboard</h2>

            <div className="row">
                <div className="col-md-12">
                    {wallet_address ? (
                        <p>
                            <strong>Your Ethereum Wallet Address: </strong>
                            <span className="text-monospace">{truncateAddress(wallet_address)}</span>
                        </p>
                    ) : (
                        <p>No wallet address available.</p>
                    )}

                    {loading ? (
                        <p>Loading balance...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : balance !== null ? (
                        <p>
                            <strong>Your Ethereum Balance: </strong>
                            {formatBalance(balance)} ETH
                        </p>
                    ) : (
                        <p>Balance not available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
