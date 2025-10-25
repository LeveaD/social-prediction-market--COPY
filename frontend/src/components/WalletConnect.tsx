import React, { useEffect, useState } from 'react';
// Note: you need to install hashconnect in the frontend: `npm install hashconnect`
// This component implements a simple HashConnect flow and a login-by-signature
// It is intentionally light on error handling; adjust for production use.
import { HashConnect } from 'hashconnect';

const WalletConnect: React.FC = () => {
  const [hashConnect, setHashConnect] = useState<any>(null);
  const [pairedAccount, setPairedAccount] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('idle');

  useEffect(() => {
    return () => {
      // cleanup
      if (hashConnect && hashConnect.disconnect) hashConnect.disconnect();
    };
  }, [hashConnect]);

  async function connectWallet() {
    setStatus('initializing');
    try {
      const hc = new HashConnect();
      const initData = await hc.init();
      const { pairingString, appMetadata } = await hc.connect();

      // pairingString should be shown as a QR or deep link. HashPack/HashConnect wallets will respond.
      // For a simple flow we attempt to get available pairings and use the first.
      const pairings = hc.pairings || [];
      if (pairings.length > 0) {
        const acct = pairings[0].accountIds?.[0] || null;
        setPairedAccount(acct);
        // Try to derive the public key (wallet may provide it via pairing metadata)
        setPublicKey(pairings[0].publicKey || null);
      }

      setHashConnect(hc);
      setStatus('connected');
    } catch (err: any) {
      console.error('connect error', err);
      setStatus('error');
    }
  }

  async function signAndLogin() {
    if (!pairedAccount) return setStatus('no-account');
    try {
      setStatus('requesting-nonce');
      const nonceResp = await fetch(`http://localhost:5001/api/auth/nonce?accountId=${encodeURIComponent(pairedAccount)}`);
      const { nonce } = await nonceResp.json();

      setStatus('signing');
      // HashConnect provides methods to request signatures. Exact API may vary by version.
      // We'll use the requestSignature method if present, otherwise instruct the user.
      if (!hashConnect) return setStatus('no-hashconnect');

      // Construct the data to sign (we ask the wallet to sign the raw nonce bytes)
      const data = Buffer.from(nonce).toString('hex');

      // The following API call may differ depending on HashConnect version. Adjust as needed.
      // Example using `requestSignature`:
      const topic = hashConnect.pairings?.[0]?.topic;
      const account = pairedAccount;
      const signatureResponse = await hashConnect.requestSign({
        topic,
        byteArray: Buffer.from(nonce),
        signingAccount: account,
      });

      // signatureResponse should contain {signature: <hex>, publicKey: <hex>}
      const signatureHex = signatureResponse?.signature || signatureResponse?.sig || null;
      const pubKeyHex = signatureResponse?.publicKey || signatureResponse?.pubKey || publicKey;

      if (!signatureHex) {
        setStatus('signature-failed');
        return;
      }

      setStatus('verifying');
      const verifyResp = await fetch('http://localhost:5001/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: pairedAccount, publicKey: pubKeyHex, signature: signatureHex, nonce }),
      });

      const verifyJson = await verifyResp.json();
      if (verifyResp.ok && verifyJson.ok) {
        setStatus('logged-in');
        // store session token if provided
        if (verifyJson.sessionToken) localStorage.setItem('sessionToken', verifyJson.sessionToken);
      } else {
        setStatus('verify-failed');
        console.error('verify failed', verifyJson);
      }

    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  return (
    <div>
      {!pairedAccount ? (
        <button onClick={connectWallet} className="w-full btn-primary">
          Connect Hedera Wallet
        </button>
      ) : (
        <div className="space-y-2">
          <div>Connected: {pairedAccount}</div>
          <div>Public Key: {publicKey || 'unknown'}</div>
          <div className="flex gap-2">
            <button onClick={signAndLogin} className="btn-primary">Sign & Login</button>
            <button onClick={() => { setPairedAccount(null); setHashConnect(null); setStatus('idle'); }} className="btn-ghost">Disconnect</button>
          </div>
        </div>
      )}
      <div className="text-xs text-muted">Status: {status}</div>
    </div>
  );
};

export default WalletConnect;
