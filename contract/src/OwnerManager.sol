// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

// ref: Safe::OwnerManager
// the reason of using linked list:
// 1. check an address is in the list: `owners[address] != address(0)`
// 2. traverse the list: `owners[last_owner]` points back to SENTINEL_OWNERS
// 3. insert an address: `owners[new_owner] = last_owner`
// 4. remove an address: `owners[last_owner] = new_owner`
abstract contract OwnerManager {
    // This is used to traverse `owners`
    // 1. `owners[SENTINEL_OWNERS]` contains the first owner
    // 2. `owners[last_owner]` points back to SENTINEL_OWNERS
    address internal constant SENTINEL_OWNERS = address(0x1);

    mapping(address => address) internal owners;
    uint256 internal ownerCount;
    uint256 internal threshold;

    function setupOwners(address[] memory _owners, uint256 _threshold) internal {
        require(_threshold > 0 && _threshold <= _owners.length, "invalid threshold");
        require(_owners.length > 0, "owners are empty");

        address currentOwner = SENTINEL_OWNERS;
        uint256 ownersLength = _owners.length;
        for (uint256 i = 0; i < ownersLength; ++i) {
            address owner = _owners[i];

            // check owner validity
            require(owner != address(0), "owners should not be zero");
            require(owner != SENTINEL_OWNERS, "owners should not be sentinel");
            require(owners[owner] == address(0), "owner already exists"); // default value is addres(0)

            owners[currentOwner] = owner;
            currentOwner = owner;
        }
        owners[currentOwner] = SENTINEL_OWNERS; // pointing the last one back to sentinel
        ownerCount = ownersLength;
        threshold = _threshold;
    }

    // Check if an address is an owner (O(1))
    function isOwner(address account) public view returns (bool) {
        return account != address(0) && account != SENTINEL_OWNERS && owners[account] != address(0);
    }

    // TODO: add maintaining funcitons like addOwner, removeOwner, etc.
}
