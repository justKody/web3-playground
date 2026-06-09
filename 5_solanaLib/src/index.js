import {Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL} from '@solana/web3.js'; // bassically like a bank 


const connection = new Connection(clusterApiUrl('devnet'));
// or connection = new Connection('https://api.devnet.solana.com'); // any RPC server


const publicKey = new PublicKey('EkAVw935BARnSiW3XXefpAjCM58TsWeN4SKU4V1U4Kmg');

const balance = await connection.getBalance(publicKey);

console.log(balance, 'lamports');
console.log("Actual balance", balance / LAMPORTS_PER_SOL);