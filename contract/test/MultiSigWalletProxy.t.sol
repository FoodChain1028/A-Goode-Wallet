// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {ProxyFactory, UpgradeableProxy} from "../src/ProxyFactory.sol";
import {MultiSigWallet} from "../src/MultiSigWallet.sol";
import {Counter} from "../src/Counter.sol";
import {Utils} from "./Utils.sol";

interface IMultiSigWallet {
    function setup(address[] memory _owners, uint256 _threshold) external;
    function execTransaction(address to, uint256 value, bytes calldata data, bytes memory signatures)
        external
        payable;
    function getTransactionHash(address to, uint256 value, bytes calldata data, uint256 _nonce)
        external
        view
        returns (bytes32);
    function nonce() external view returns (uint256);
}

contract MultiSigWalletProxyTest is Test {
    ProxyFactory public proxyFactory;
    MultiSigWallet public walletImpl;
    Counter public counter;
    bytes32 public constant SALT = keccak256("msw_proxy_test_salt");

    address[] public owners;
    uint256 public threshold = 1; // for simplicity

    uint256 public pk1 = 0x123;
    uint256 public pk2 = 0x456;
    uint256 public pk3 = 0x789;

    address public user1;
    address public user2;
    address public user3;

    function setUp() public {
        proxyFactory = new ProxyFactory();
        walletImpl = new MultiSigWallet();
        counter = new Counter();

        user1 = vm.addr(pk1);
        user2 = vm.addr(pk2);
        user3 = vm.addr(pk3);

        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
        vm.deal(user3, 1 ether);
        owners.push(user1);
        owners.push(user2);
        owners.push(user3);
    }

    function test_DeployAndSetupProxy() public {
        // Deploy proxy pointing to implementation
        address proxy = proxyFactory.deployProxy(address(walletImpl), SALT);
        assertTrue(proxy.code.length > 0, "Proxy should have code");
        console.log("Proxy deployed at: ", proxy);

        // Setup the proxy wallet via delegatecall
        IMultiSigWallet msw = IMultiSigWallet(proxy);
        msw.setup(owners, threshold);
        assertEq(msw.nonce(), 0, "Nonce should be 0 after setup");
    }

    function test_ProxyExecTransaction() public {
        address proxy = proxyFactory.deployProxy(address(walletImpl), SALT);
        IMultiSigWallet msw = IMultiSigWallet(proxy);
        msw.setup(owners, threshold);

        // send ETH from proxy to user2
        address to = user2;
        uint256 value = 1 ether;
        bytes memory data = "";
        uint256 nonce = msw.nonce();
        bytes32 txHash = msw.getTransactionHash(to, value, data, nonce);

        address[] memory signers = new address[](1);
        signers[0] = user1;

        uint256[] memory pks = new uint256[](1);
        pks[0] = pk1;

        bytes memory signatures = Utils._getSortedSignatures(txHash, signers, pks, vm);

        // Fund the proxy with ETH
        vm.deal(proxy, 2 ether);
        uint256 balanceBefore = user2.balance;

        // Execute the transaction via proxy multisig wallet
        vm.prank(user1);
        msw.execTransaction{value: value}(to, value, data, signatures);

        assertEq(user2.balance, balanceBefore + value, "user2 should receive ETH");
        assertEq(msw.nonce(), nonce + 1, "Nonce should increment");
    }

    function test_ProxyExecTransaction_ContractCall() public {
        address proxy = proxyFactory.deployProxy(address(walletImpl), SALT);
        IMultiSigWallet msw = IMultiSigWallet(proxy);
        msw.setup(owners, threshold);

        vm.deal(proxy, 1 ether);

        uint256 value = 0;
        bytes memory data = abi.encodeWithSignature("increment()");
        uint256 nonce = msw.nonce();

        bytes32 txHash = msw.getTransactionHash(address(counter), value, data, nonce);

        address[] memory signers = new address[](2);

        signers[0] = user1;
        signers[1] = user2;

        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = pk2;

        bytes memory signatures = Utils._getSortedSignatures(txHash, signers, pks, vm);

        vm.prank(user1);
        msw.execTransaction(address(counter), value, data, signatures);

        assertEq(counter.number(), 1);
        assertEq(msw.nonce(), nonce + 1);
    }
}
