import { privateKey, rpcURL, swapRouterAddresses, usdtAddress } from '../config';
import { Contract, JsonRpcProvider, Wallet, formatEther, parseEther, parseUnits } from 'ethers';
import fs from 'fs'

async function main() {
    // Load the address of the deployed proxy from JSON file
    const contractAddress = JSON.parse(fs.readFileSync('deployedAddress.json', 'utf-8'))

    // Initialize provider and wallet using JSON RPC provider and private key
    const provider = new JsonRpcProvider(rpcURL.sepolia);
    const wallet = new Wallet(privateKey, provider);

    // Load contract ABI from local artifact file
    const artifact = JSON.parse(fs.readFileSync('artifacts/contracts/Swapper.sol/Swapper.json', 'utf-8'))
    const abi = artifact.abi

    // Connect to the deployed contract using its address, ABI, and wallet
    const contract = new Contract(contractAddress, abi, wallet);

    // Define parameters for the swap function
    const minAmount = parseUnits("1.0", 18); // Replace with the minimum amount of tokens you want to receive
    const ethAmount = parseEther("0.1"); // Replace with the amount of ETH you want to send

    // Get current gas price from provider
    const gasPrice = (await provider.getFeeData()).gasPrice!

    // Execute the swapEtherToToken function on the contract
    const tx = await contract.swapEtherToToken(usdtAddress.sepolia, minAmount, {
        value: ethAmount,
        gasLimit: 200000, // Optional: specify gas limit
        gasPrice// Optional: specify gas price
    });

    // Wait for transaction receipt
    const receipt = await tx.wait();

    // Log the block number where the transaction was mined
    console.log('Transaction was mined in block', receipt.blockNumber);

    // Calculate gas used and gas fee in wei and ETH
    const gasUsed = receipt.gasUsed;
    const gasFee = BigInt(gasUsed) * BigInt(gasPrice);
    console.log(`Gas Fee: ${gasFee.toString()} wei`);
    console.log(`Gas Fee: ${formatEther(gasFee)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
