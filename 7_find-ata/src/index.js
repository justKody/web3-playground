const {getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID} = require("@solana/spl-token")
const {PublicKey} = require("@solana/web3.js")


async function main () {

    // PDA deterministically find
    const address = await getAssociatedTokenAddress(
        new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), //usdc mint
        new PublicKey("EkAVw935BARnSiW3XXefpAjCM58TsWeN4SKU4V1U4Kmg") // my solana address
    )

    // any programm with set of seeds
    const [address2] = await PublicKey.findProgramAddress(
        [   new PublicKey("EkAVw935BARnSiW3XXefpAjCM58TsWeN4SKU4V1U4Kmg").toBuffer(), // solana address
            TOKEN_PROGRAM_ID.toBuffer(), // program id address
            new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v").toBuffer() //Mint
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID, // associated program id address
    );

    console.log(address.toBase58())
    console.log(address2.toBase58())

}


main()