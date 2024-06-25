import { formatEther } from "ethers";
import { ethers, upgrades } from "hardhat";
import fs from 'fs'

async function main() {
    // Initialize ethers provider and get signer
    const provider = ethers.provider
    const [deployer] = await ethers.getSigners();

    console.log("Upgrading contracts with the account:", deployer.address);

    // Check account balance before upgrade
    const balance = await provider.getBalance(deployer.address)
    console.log("Account balance:", formatEther(balance), "ETH");

    // Load the address of the deployed proxy from JSON file
    const proxyAddress = JSON.parse(fs.readFileSync('deployedAddress.json', 'utf-8')); // Replace with the address of the deployed proxy

    // Load the new implementation contract (SwapperV2)
    const SwapperV2 = await ethers.getContractFactory("Swapper");

    // Upgrade the proxy to the new implementation (SwapperV2)
    const upgraded = await upgrades.upgradeProxy(proxyAddress, SwapperV2);

    // Log the address of the upgraded contract
    console.log("Swapper upgraded to SwapperV2 at:", await upgraded.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
