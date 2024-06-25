import { ethers, upgrades } from 'hardhat';
import { JsonRpcProvider, TransactionReceipt, formatEther } from 'ethers';
import fs from 'fs';
import { rpcURL, swapRouterAddresses } from '../config'; // Assuming you have a config file with these constants

async function main() {
    // Initialize ethers provider and get signer
    const provider = ethers.provider
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Check account balance before deployment
    const balance = await provider.getBalance(deployer.address);
    console.log("Account balance:", formatEther(balance), "ETH");

    // Load the Swapper contract factory
    const Swapper = await ethers.getContractFactory("Swapper");

    // Specify the Uniswap V2 Router address (replace with actual address)
    const swapRouterAddress = swapRouterAddresses.sepolia;

    // Deploy the upgradable proxy contract
    const swapper = await upgrades.deployProxy(Swapper, [swapRouterAddress], { initializer: 'initialize' });

    // Retrieve and log the deployed contract address
    const address = await swapper.getAddress();
    console.log("Swapper deployed to:", address);

    // Write deployed contract address to a JSON file
    fs.writeFileSync('deployedAddress.json', JSON.stringify(address, null, 4));

    // Obtain the deployment transaction
    const deployTx = swapper.deploymentTransaction()

    // Retrieve transaction hash
    const deployTransactionHash = deployTx?.hash!
    console.log('deployTransactionHash', deployTransactionHash)

    // Wait for transaction receipt to get gas used
    const customProvider = new JsonRpcProvider(rpcURL.sepolia);
    let deployTransactionReceipt: TransactionReceipt | null = null

    // Retry until transaction receipt is available (not recommended for production)
    while (!deployTransactionReceipt) deployTransactionReceipt = await customProvider.getTransactionReceipt(deployTransactionHash);

    // Extract gas used and gas price from the transaction receipt
    const deployGasUsed = deployTransactionReceipt?.gasUsed!;
    const deployGasPrice = deployTx?.gasPrice!;

    // Calculate deployment fee in wei and ETH
    const deployFee = BigInt(deployGasPrice) * BigInt(deployGasUsed)
    console.log(`Gas Fee: ${deployFee.toString()} wei`);
    console.log(`Gas Fee: ${formatEther(deployFee)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
