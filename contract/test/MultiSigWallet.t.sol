// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/MultiSigWallet.sol";
import "../src/OwnerManager.sol";
import "../src/SignatureDecoder.sol";
import "../src/SafeMath.sol";

// A simple contract to test interactions with MultiSigWallet
contract Counter {
    uint256 public count;

    event Incremented(uint256 newCount);

    function increment() public {
        count++;
        emit Incremented(count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}

contract MultiSigWalletTest is Test {
    MultiSigWallet wallet;
    Counter counter;

    address owner1 = vm.addr(0x12345);
    address owner2 = vm.addr(0x67890);
    address owner3 = vm.addr(0xabcde);
    address nonOwner = vm.addr(0x4);

    uint256 pk1 = 0x12345;
    uint256 pk2 = 0x67890;
    uint256 pk3 = 0xabcde;
    uint256 nonOwnerPk = 0x4;

    address[] owners;
    uint256 threshold = 2;

    function setUp() public {
        vm.label(owner1, "Owner1");
        vm.label(owner2, "Owner2");
        vm.label(owner3, "Owner3");
        vm.label(nonOwner, "NonOwner");

        wallet = new MultiSigWallet();
        counter = new Counter();

        owners.push(owner1);
        owners.push(owner2);
        owners.push(owner3);
        wallet.setup(owners, threshold);

        vm.deal(owner1, 1 ether);
        vm.deal(owner2, 1 ether);
        vm.deal(owner3, 1 ether);
        vm.deal(address(wallet), 10 ether);
    }

    function _signHash(bytes32 txHash, uint256 privateKey) internal pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, txHash);
        return abi.encodePacked(r, s, v);
    }

    function _getSortedSignatures(bytes32 txHash, address[] memory signers, uint256[] memory privateKeys)
        internal
        pure
        returns (bytes memory signatures)
    {
        require(signers.length == privateKeys.length, "Mismatch array length");
        for (uint256 i = 0; i < signers.length; i++) {
            for (uint256 j = i + 1; j < signers.length; j++) {
                if (signers[i] > signers[j]) {
                    (signers[i], signers[j]) = (signers[j], signers[i]);
                    (privateKeys[i], privateKeys[j]) = (privateKeys[j], privateKeys[i]);
                }
            }
        }
        for (uint256 i = 0; i < signers.length; i++) {
            signatures = abi.encodePacked(signatures, _signHash(txHash, privateKeys[i]));
        }
    }

    function test_ExecTransaction_ValueTransfer_Success() public {
        address recipient = address(0xdead);
        uint256 value = 1 ether;
        bytes memory data = "";
        uint256 nonce = wallet.nonce();

        bytes32 txHash = wallet.getTransactionHash(recipient, value, data, nonce);

        address[] memory signers = new address[](2);
        signers[0] = owner1;
        signers[1] = owner2;
        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = pk2;
        bytes memory signatures = _getSortedSignatures(txHash, signers, pks);

        vm.expectEmit(true, true, true, true, address(wallet));
        emit MultiSigWallet.ExecutionSuccess(txHash);

        uint256 balanceBefore = recipient.balance;
        wallet.execTransaction(recipient, value, data, signatures);
        uint256 balanceAfter = recipient.balance;

        assertEq(balanceAfter, balanceBefore + value);
        assertEq(wallet.nonce(), nonce + 1);
    }

    function test_ExecTransaction_ContractCall_Success() public {
        address targetContract = address(counter);
        uint256 value = 0;
        bytes memory data = abi.encodeWithSignature("increment()");
        uint256 nonce = wallet.nonce();

        bytes32 txHash = wallet.getTransactionHash(targetContract, value, data, nonce);

        address[] memory signers = new address[](2);
        signers[0] = owner1;
        signers[1] = owner3;
        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = pk3;
        bytes memory signatures = _getSortedSignatures(txHash, signers, pks);

        vm.expectEmit(true, true, false, false, address(wallet));
        emit MultiSigWallet.ExecutionSuccess(txHash);

        uint256 beforeCount = counter.getCount();
        wallet.execTransaction(targetContract, value, data, signatures);
        uint256 afterCount = counter.getCount();

        assertEq(afterCount, beforeCount + 1);
        assertEq(wallet.nonce(), nonce + 1);
    }

    function test_ExecTransaction_Revert_NotEnoughSignatures() public {
        address recipient = address(0xbeef);
        uint256 value = 0.5 ether;
        bytes memory data = "";
        uint256 nonce = wallet.nonce();

        bytes32 txHash = wallet.getTransactionHash(recipient, value, data, nonce);

        address[] memory signers = new address[](1);
        signers[0] = owner1;
        uint256[] memory pks = new uint256[](1);
        pks[0] = pk1;
        bytes memory signatures = _getSortedSignatures(txHash, signers, pks);

        vm.expectRevert("not enough signatures");
        wallet.execTransaction(recipient, value, data, signatures);
    }

    function test_ExecTransaction_Revert_UnsortedSignatures() public {
        address recipient = address(0x1234);
        uint256 value = 0.1 ether;
        bytes memory data = "";
        uint256 nonce = wallet.nonce();

        bytes32 txHash = wallet.getTransactionHash(recipient, value, data, nonce);

        (uint8 v1, bytes32 r1, bytes32 s1) = vm.sign(pk1, txHash);
        bytes memory sig1 = abi.encodePacked(r1, s1, v1);
        (uint8 v3, bytes32 r3, bytes32 s3) = vm.sign(pk3, txHash);
        bytes memory sig3 = abi.encodePacked(r3, s3, v3);

        bytes memory signatures = abi.encodePacked(sig1, sig3);

        vm.expectRevert("signers are not in ascending order");
        wallet.execTransaction(recipient, value, data, signatures);
    }

    function test_ExecTransaction_Revert_NonceReplay() public {
        address recipient = address(0xfeed);
        uint256 value = 0.01 ether;
        bytes memory data = "";
        uint256 nonce = wallet.nonce();

        bytes32 txHash = wallet.getTransactionHash(recipient, value, data, nonce);

        address[] memory signers = new address[](2);
        signers[0] = owner1;
        signers[1] = owner2;
        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = pk2;
        bytes memory signatures = _getSortedSignatures(txHash, signers, pks);

        wallet.execTransaction(recipient, value, data, signatures);
        assertEq(wallet.nonce(), nonce + 1);

        vm.expectRevert("signer not in owners || invalid signature");
        wallet.execTransaction(recipient, value, data, signatures);
    }

    function test_ExecTransaction_Revert_InvalidSignatureData() public {
        address recipient = address(0x1234);
        uint256 value = 0.1 ether;
        bytes memory data = "";

        bytes32 txHashWrong = keccak256(abi.encodePacked("wrong data"));

        address[] memory signers = new address[](2);
        signers[0] = owner1;
        signers[1] = owner2;
        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = pk2;
        bytes memory signaturesWrong = _getSortedSignatures(txHashWrong, signers, pks);

        vm.expectRevert("signer not in owners || invalid signature");
        wallet.execTransaction(recipient, value, data, signaturesWrong);
    }

    function test_ExecTransaction_Revert_NotOwner() public {
        address recipient = address(0x1234);
        uint256 value = 0.1 ether;
        bytes memory data = "";

        bytes32 txHash = wallet.getTransactionHash(recipient, value, data, wallet.nonce());

        address[] memory signers = new address[](2);
        signers[0] = owner1;
        signers[1] = nonOwner;
        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = nonOwnerPk;
        bytes memory signatures = _getSortedSignatures(txHash, signers, pks);

        vm.expectRevert("signer not in owners || invalid signature");
        wallet.execTransaction(recipient, value, data, signatures);
    }

    function test_ExecTransaction_TargetRevert() public {
        RevertingContract target = new RevertingContract();
        address targetAddress = address(target);
        uint256 value = 0;
        bytes memory data = abi.encodeWithSignature("doRevert()");
        uint256 nonce = wallet.nonce();

        bytes32 txHash = wallet.getTransactionHash(targetAddress, value, data, nonce);

        address[] memory signers = new address[](2);
        signers[0] = owner1;
        signers[1] = owner2;
        uint256[] memory pks = new uint256[](2);
        pks[0] = pk1;
        pks[1] = pk2;
        bytes memory signatures = _getSortedSignatures(txHash, signers, pks);

        vm.expectEmit(true, true, false, true, address(wallet));
        emit MultiSigWallet.ExecutionFailure(txHash, abi.encodeWithSignature("Error(string)", "Target reverted"));

        vm.expectRevert("Transaction execution failed");
        wallet.execTransaction(targetAddress, value, data, signatures);

        assertEq(wallet.nonce(), nonce);
    }
}

contract RevertingContract {
    function doRevert() public pure {
        revert("Target reverted");
    }
}
