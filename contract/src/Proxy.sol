// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// This is a generic proxy contract that allows to execute arbitrary code
abstract contract Proxy {
    /// @dev Delegates the current call to `implementation`.
    function _delegate(address implementation) internal virtual {
        assembly {
            // copy the msg.data to memory
            calldatacopy(0, 0, calldatasize())

            // call the implemntation
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)

            // copy the return data to memry
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    /// @dev A virtual function that should be overriden so it returns the address to which the fallback function and {_fallback} should delegate.
    function _implementation() internal view virtual returns (address);

    /// @dev delegates the call to the `_implementation()`
    function _fallback() internal virtual {
        _delegate(_implementation());
    }

    fallback() external payable virtual {
        _fallback();
    }
}
