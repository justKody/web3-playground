import {Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair} from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'));


const publicKeySender = new PublicKey('EkAVw935BARnSiW3XXefpAjCM58TsWeN4SKU4V1U4Kmg');
const publicKeyReceiver = new PublicKey('jpj9KUt1YvL1ci5WCFQQrD3awnerd9uPSj9Luky2TMR')

// create a transaction

const tnx = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: publicKeySender,
        toPubkey: publicKeyReceiver,
        lamports: 0.1 * LAMPORTS_PER_SOL // 0.1 sol
    })
);


// creating a Signer

// create signer from secret key

const signer = Keypair.fromSecretKey(

    new Uint8Array([
  
      192, 12, 20, 232, 165, 203, 202, 146,
  
      35, 253, 149, 255, 22, 89, 68, 221,
  
      131, 183, 181, 181, 165, 187, 146, 248,
  
      221, 181, 208, 54, 142, 186, 149, 15,
  
      204, 54, 165, 45, 20, 249, 226, 213,
  
      122, 153, 95, 77, 54, 223, 87, 148,
  
      10, 12, 251, 97, 48, 231, 161, 59,
  
      33, 202, 133, 250, 14, 37, 15, 79,
  
    ])
  
  );
// send and confirm 
const signature = await sendAndConfirmTransaction(connection, tnx, [signer]);

console.log("Signature", signature, "Transaction", tnx);

