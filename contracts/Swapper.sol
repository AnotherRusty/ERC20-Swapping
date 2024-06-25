// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import necessary OpenZeppelin libraries for access control, upgradeability, and reentrancy protection
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Import Uniswap V2 Router interface
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

// Import ERC20 interface for token operations
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interface/IERC20Swapper.sol";

/// @title Swapper Contract
/// @dev This contract facilitates swapping ETH for tokens using Uniswap V2 Router.
contract Swapper is
    ERC20Swapper,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    // ---------------- Event ----------------

    event TokensSwapped(
        address indexed user,
        address indexed token,
        uint amount
    );

    // ---------------- Variables ----------------

    IUniswapV2Router02 private swapRouter;
    mapping(address => bool) private authorizedUsers;

    // ---------------- Initializer ----------------

    /// @dev Initializes the contract with the address of the Uniswap V2 Router.
    /// @param _swapRouterAddr The address of the Uniswap V2 Router contract.
    function initialize(address _swapRouterAddr) external initializer {
        require(_swapRouterAddr != address(0), "Invalid router address");
        __Ownable_init(msg.sender); // Initialize the OwnableUpgradeable contract
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        swapRouter = IUniswapV2Router02(_swapRouterAddr);
        authorizedUsers[msg.sender] = true; // Add owner to authorized users
    }

    // ---------------- Modifiers ----------------

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Not an authorized user");
        _;
    }
    // ---------------- User functions ----------------

    /// @dev Swaps ETH for tokens using Uniswap V2 Router.
    /// @param token The token address to swap ETH for.
    /// @param minAmount The minimum amount of tokens to receive.
    /// @return amount amount of tokens received.
    function swapEtherToToken(
        address token,
        uint minAmount
    ) external payable nonReentrant returns (uint amount) {
        // Ensure ETH is sent with the transaction
        require(msg.value > 0, "Must send Ether to swap");

        // Validate the token address
        require(token != address(0), "Invalid token address");
        require(IERC20(token).totalSupply() > 0, "Not a valid ERC20 token");

        // Define the token swap path, from ETH to the specified token
        address[] memory path = new address[](2);
        path[0] = swapRouter.WETH(); // WETH address
        path[1] = token; // Target token address

        // Execute the swap using Uniswap V2 Router
        try
            swapRouter.swapExactETHForTokens{value: msg.value}(
                minAmount,
                path,
                address(this),
                block.timestamp
            )
        returns (uint[] memory amounts) {
            // Ensure the received amount of tokens meets the minimum required
            require(
                amounts[1] >= minAmount,
                "Received less tokens than expected"
            );
            amount = amounts[1];

            // Emit an event indicating tokens were swapped
            emit TokensSwapped(msg.sender, token, amount);
        } catch {
            revert("Token swap failed");
        }
    }

    // ---------------- Owner functions ----------------

    /// @dev Updates the Uniswap V2 Router address. Can only be called by the contract owner.
    /// @param _swapRouterAddr The new Uniswap V2 Router address.
    function updateUniswapRouter(address _swapRouterAddr) external onlyOwner {
        // Validate the provided router address is not zero
        require(_swapRouterAddr != address(0), "Invalid router address");

        // Update the Uniswap V2 Router address
        swapRouter = IUniswapV2Router02(_swapRouterAddr);
    }

    /// @dev Withdraws all ETH held by the contract to the owner's address.
    function withdrawAllETH() external onlyOwner {
        // Transfer all ETH held by the contract to the owner's address
        payable(owner()).transfer(address(this).balance);
    }

    /// @dev Withdraws tokens of a specified ERC20 contract to the owner's address.
    /// @param token The ERC20 token address to withdraw.
    /// @param amount The amount of tokens to withdraw.
    function withdrawTokens(address token, uint amount) external onlyOwner {
        // Validate the token address and amount are valid
        require(token != address(0), "Invalid token address");
        require(amount > 0, "Invalid amount");

        // Transfer the specified amount of tokens to the owner's address
        IERC20(token).transfer(owner(), amount);
    }

    /// @dev Function required by UUPSUpgradeable to authorize upgrades.
    /// @param newImplementation The address of the new implementation contract.
    function _authorizeUpgrade(
        address newImplementation
    ) internal view override onlyOwner {
        // Ensure the new implementation address is not zero
        require(
            newImplementation != address(0),
            "Invalid implementation address"
        );
    }

    /// @dev Fallback function to receive ETH.
    receive() external payable {}
}
