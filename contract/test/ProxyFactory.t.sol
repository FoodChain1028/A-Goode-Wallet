// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import {ProxyFactory, UpgradeableProxy} from "../src/ProxyFactory.sol";

interface ICounter {
    function number() external view returns (uint256);
    function setNumber(uint256 newNumber) external;
    function increment() external;
}

contract ProxyFactoryTest is Test {
    Counter public counter;
    ProxyFactory public proxyFactory;
    bytes32 public constant SALT = keccak256("test_salt");

    function setUp() public {
        counter = new Counter();
        proxyFactory = new ProxyFactory();
    }

    function test_deployProxy() public {
        // proxy --> counter
        address proxy = proxyFactory.deployProxy(address(counter), SALT);
        assertTrue(proxy.code.length > 0, "Proxy should have code");

        address computedAddress = proxyFactory.computeProxyAddress(address(counter), SALT);
        assertEq(proxy, computedAddress, "Deployed address should match computed address");
    }

    function test_proxyDelegation() public {
        address proxy = proxyFactory.deployProxy(address(counter), SALT);
        ICounter proxiedCounter = ICounter(proxy);

        assertEq(proxiedCounter.number(), 0, "Initial counter value should be 0");
        proxiedCounter.setNumber(42);
        assertEq(proxiedCounter.number(), 42, "Counter value should be updated to 42");

        proxiedCounter.increment();
        assertEq(proxiedCounter.number(), 43, "Counter value should be incremented to 43");

        // the counter state should not be changed
        assertEq(counter.number(), 0, "Original counter should remain unchanged");
    }

    function test_predictableAddress() public {
        // compute the address before deployment
        address predictedAddress = proxyFactory.computeProxyAddress(address(counter), SALT);

        // deploy the proxy
        address actualAddress = proxyFactory.deployProxy(address(counter), SALT);

        // verify the addresses match
        assertEq(actualAddress, predictedAddress, "Actual address should match predicted address");

        // try to use a different salt
        bytes32 newSalt = keccak256("different_salt");
        address newPredictedAddress = proxyFactory.computeProxyAddress(address(counter), newSalt);

        // verify the new address is different
        assertTrue(newPredictedAddress != predictedAddress, "Different salt should yield different address");
    }

    function testFuzz_ProxySetNumber(uint256 x) public {
        address proxy = proxyFactory.deployProxy(address(counter), SALT);
        ICounter proxiedCounter = ICounter(proxy);

        proxiedCounter.setNumber(x);

        assertEq(proxiedCounter.number(), x, "Counter value should match input");

        // bc fuzz runs edge cases, need to check overflow here
        if (x < type(uint256).max) {
            proxiedCounter.increment();
            assertEq(proxiedCounter.number(), x + 1, "Counter value should be incremented");
        }
    }

    // Test that the same salt and implementation always produces the same address
    function test_deterministicAddress() public {
        // deploy first proxy
        address proxy1 = proxyFactory.deployProxy(address(counter), SALT);

        // create a new Counter instance
        Counter newCounter = new Counter();

        // deploy a proxy with the same salt but different implementation
        address proxy2 = proxyFactory.deployProxy(address(newCounter), SALT);

        // verify the addresses are different
        assertTrue(proxy1 != proxy2, "Different implementations with same salt should yield different addresses");

        // verify computed addresses match
        assertEq(proxy1, proxyFactory.computeProxyAddress(address(counter), SALT));
        assertEq(proxy2, proxyFactory.computeProxyAddress(address(newCounter), SALT));
    }
}
