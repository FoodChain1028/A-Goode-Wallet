// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./OwnerManager.sol";
import "./SignatureDecoder.sol";
import "./SafeMath.sol";

/// @dev This is a minimal multi-sig wallet without other security and refund functionality
contract MultiSigWallet is OwnerManager, SignatureDecoder {
    using SafeMath for uint256;

    uint256 public nonce; // to prevent replay attacks

    struct Tx {
        address to;
        uint256 value;
        bytes data;
        uint8 numYes;
        bool executed;
    }

    event ExecutionSuccess(bytes32 indexed txHash);
    event ExecutionFailure(bytes32 indexed txHash, bytes reason);

    constructor() payable {
        threshold = 1;
    }

    function setup(address[] memory _owners, uint256 _threshold) public {
        setupOwners(_owners, _threshold);
    }

    function execTransaction(address to, uint256 value, bytes calldata data, bytes memory signatures) public payable {
        bytes32 txHash = getTransactionHash(to, value, data, nonce++);
        checkSignatures(txHash, signatures);

        (bool success, bytes memory result) = to.call{value: value}(data);
        if (success) {
            emit ExecutionSuccess(txHash);
        } else {
            emit ExecutionFailure(txHash, result);
            require(success, "Transaction execution failed");
        }
    }

    function getTransactionHash(address to, uint256 value, bytes calldata data, uint256 _nonce)
        public
        view
        returns (bytes32)
    {
        // from, chainid, to, value, data, nonce
        return keccak256(abi.encodePacked(address(this), block.chainid, to, value, keccak256(data), _nonce));
    }

    function checkSignatures(bytes32 dataHash, bytes memory signatures) public view {
        uint256 _threshold = threshold;
        require(_threshold > 0, "threshold should not be zero");
        checkNSignatures(dataHash, signatures, _threshold);
    }

    function checkNSignatures(bytes32 dataHash, bytes memory signatures, uint256 requiredSignatures) public view {
        // each signature.length == 65
        require(signatures.length >= requiredSignatures.mul(65), "not enough signatures");

        address lastOwner = address(0);
        address currentOwner;
        uint256 v;
        bytes32 r;
        bytes32 s;
        uint256 i;
        for (i = 0; i < requiredSignatures; ++i) {
            // get the signature of the i-th signer
            (v, r, s) = signatureSplit(signatures, i);

            // just check the default signature
            // avoid contract signature (EIP-1271)
            currentOwner = ecrecover(dataHash, uint8(v), r, s);
            require(isOwner(currentOwner), "signer not in owners || invalid signature");
            require(currentOwner > lastOwner, "signers are not in ascending order");
            lastOwner = currentOwner;
        }
    }
}
