// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";

library Utils {
    function _signHash(bytes32 txHash, uint256 privateKey, Vm vm) internal pure returns (bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, txHash);
        return abi.encodePacked(r, s, v);
    }

    function _getSortedSignatures(bytes32 txHash, address[] memory signers, uint256[] memory privateKeys, Vm vm)
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
            signatures = abi.encodePacked(signatures, _signHash(txHash, privateKeys[i], vm));
        }
    }
}
