// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Proxy.sol";

/**
 * @title ProxyFactory
 * @dev Factory contract for deploying Proxy contracts with CREATE2
 */
contract ProxyFactory {
    /**
     * @dev Deploys a new Proxy contract with CREATE2
     * @param implementation The address that the proxy will delegate calls to
     * @param salt A value to create a deterministic address
     * @return proxy The address of the deployed proxy
     */
    function deployProxy(address implementation, bytes32 salt) external returns (address proxy) {
        bytes memory bytecode = abi.encodePacked(type(UpgradeableProxy).creationCode, abi.encode(implementation));

        assembly {
            proxy := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(proxy)) { revert(0, 0) }
        }

        return proxy;
    }

    /**
     * @dev Computes the address where a proxy will be deployed using CREATE2
     * @param implementation The address that the proxy will delegate calls to
     * @param salt A value to create a deterministic address
     * @return The address where the proxy will be deployed
     */
    function computeProxyAddress(address implementation, bytes32 salt) external view returns (address) {
        bytes memory bytecode = abi.encodePacked(type(UpgradeableProxy).creationCode, abi.encode(implementation));

        bytes32 bytecodeHash = keccak256(bytecode);

        return address(uint160(uint256(keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, bytecodeHash)))));
    }
}

/**
 * @title UpgradeableProxy
 * @dev Concrete implementation of Proxy with a fixed implementation address
 */
contract UpgradeableProxy is Proxy {
    // The implementation address is immutable to save on gas
    address private immutable _implementationAddress;

    /**
     * @dev Constructor that sets the implementation address
     * @param implementation Address of the implementation
     */
    constructor(address implementation) {
        require(implementation != address(0), "Implementation cannot be zero address");
        _implementationAddress = implementation;
    }

    /**
     * @dev Returns the implementation address
     */
    function _implementation() internal view override returns (address) {
        return _implementationAddress;
    }

    /**
     * @dev Allows receiving ETH
     */
    receive() external payable {}
}
