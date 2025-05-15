// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MultiSigWallet} from "../src/MultiSigWallet.sol";
import {ProxyFactory} from "../src/ProxyFactory.sol";

contract DeployImplementation is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MultiSigWallet implementation = new MultiSigWallet();
        console.log("MultiSigWallet implementation deployed at: https://sepolia.etherscan.io/address/", address(implementation));

        ProxyFactory proxyFactory = new ProxyFactory();
        console.log("ProxyFactory deployed at: https://sepolia.etherscan.io/address/", address(proxyFactory));

        vm.stopBroadcast();
    }
}
