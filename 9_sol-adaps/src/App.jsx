import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { SolanaWalletProvider } from "./WalletProvider.jsx";

function shorten(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

function WalletPanel() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      return;
    }

    setLoading(true);
    try {
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    fetchBalance();
    if (!publicKey) return;

    const id = connection.onAccountChange(publicKey, (account) => {
      setBalance(account.lamports / LAMPORTS_PER_SOL);
    });

    return () => {
      connection.removeAccountChangeListener(id);
    };
  }, [connection, publicKey, fetchBalance]);

  return (
    <main style={styles.main}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>anza-xyz/wallet-adapter</p>
          <h1 style={styles.title}>Devnet Wallet</h1>
        </div>
        <WalletMultiButton />
      </header>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Connection</h2>
        <dl style={styles.dl}>
          <div style={styles.row}>
            <dt style={styles.dt}>Network</dt>
            <dd style={styles.dd}>Devnet</dd>
          </div>
          <div style={styles.row}>
            <dt style={styles.dt}>Status</dt>
            <dd style={styles.dd}>
              <span
                style={{
                  ...styles.badge,
                  background: connected ? "#166534" : "#475569",
                }}
              >
                {connected ? "Connected" : "Disconnected"}
              </span>
            </dd>
          </div>
          {publicKey && (
            <>
              <div style={styles.row}>
                <dt style={styles.dt}>Address</dt>
                <dd style={styles.ddMono} title={publicKey.toBase58()}>
                  {shorten(publicKey.toBase58(), 6)}
                </dd>
              </div>
              <div style={styles.row}>
                <dt style={styles.dt}>Balance</dt>
                <dd style={styles.dd}>
                  {loading
                    ? "Loading…"
                    : balance !== null
                      ? `${balance.toFixed(4)} SOL`
                      : "—"}
                </dd>
              </div>
            </>
          )}
        </dl>

        {connected && (
          <button type="button" style={styles.refreshBtn} onClick={fetchBalance}>
            Refresh balance
          </button>
        )}

        {!connected && (
          <p style={styles.hint}>
            Connect a Wallet Standard wallet (Phantom, Solflare, etc.) or use the
            Burner Wallet for local devnet testing.
          </p>
        )}
      </section>
    </main>
  );
}

export default function App() {
  return (
    <SolanaWalletProvider>
      <WalletPanel />
    </SolanaWalletProvider>
  );
}

const styles = {
  main: {
    maxWidth: 560,
    margin: "0 auto",
    padding: "2.5rem 1.5rem",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    marginBottom: "2rem",
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#94a3b8",
  },
  title: {
    margin: "0.25rem 0 0",
    fontSize: "1.75rem",
    fontWeight: 600,
  },
  card: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "1.5rem",
    border: "1px solid #334155",
  },
  cardTitle: {
    margin: "0 0 1rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#cbd5e1",
  },
  dl: {
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  },
  dt: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "0.875rem",
  },
  dd: {
    margin: 0,
    fontWeight: 500,
    textAlign: "right",
  },
  ddMono: {
    margin: 0,
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.875rem",
    textAlign: "right",
  },
  badge: {
    display: "inline-block",
    padding: "0.2rem 0.6rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#f8fafc",
  },
  refreshBtn: {
    marginTop: "1.25rem",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#334155",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: "0.875rem",
  },
  hint: {
    margin: "1.25rem 0 0",
    fontSize: "0.875rem",
    color: "#94a3b8",
    lineHeight: 1.5,
  },
};
