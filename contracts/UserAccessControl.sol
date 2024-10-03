// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserAccessControl is AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant TRANSPORTER_ROLE = keccak256("TRANSPORTER_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantProducerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PRODUCER_ROLE, account);
    }

    function grantTransporterRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(TRANSPORTER_ROLE, account);
    }

    function grantRetailerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(RETAILER_ROLE, account);
    }

    function hasRole(bytes32 role, address account) public view override returns (bool) {
        return super.hasRole(role, account);
    }
}