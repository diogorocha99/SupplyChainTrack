// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ProductRegistry.sol";
import "./LocationTracker.sol";
import "./UserAccessControl.sol"; // Import your user access control contract

contract SupplyChainController {

    ProductRegistry public productRegistry;
    LocationTracker public locationTracker;
    UserAccessControl public userAccessControl;

    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant TRANSPORTER_ROLE = keccak256("TRANSPORTER_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    constructor(
        address _productRegistry,
        address _locationTracker,
        address _userAccessControl
    ) {
        productRegistry = ProductRegistry(_productRegistry);
        locationTracker = LocationTracker(_locationTracker);
        userAccessControl = UserAccessControl(_userAccessControl);
    }

    // Only producers can add products
    function addProduct(
        string memory _name,
        string memory _origin,
        string memory _details,
        string memory _destination,
        int256 _latitude,
        int256 _longitude
    ) public {
        require(userAccessControl.hasRole(PRODUCER_ROLE, msg.sender), "Only producers can add products.");
        
        bytes32 productId = productRegistry.addProduct(_name, _origin, _details, _destination);
        locationTracker.updateLocation(productId, _latitude, _longitude);
    }

    // Any participant (with producer, transporter, or retailer roles) can update the product's location
    function updateLocation(bytes32 _productId, int256 _latitude, int256 _longitude) public {
        require(
            userAccessControl.hasRole(PRODUCER_ROLE, msg.sender) ||
            userAccessControl.hasRole(TRANSPORTER_ROLE, msg.sender) ||
            userAccessControl.hasRole(RETAILER_ROLE, msg.sender),
            "Only authorized participants can update location."
        );
        locationTracker.updateLocation(_productId, _latitude, _longitude);
    }

    // Retrieve product details
    function getProduct(bytes32 _productId) public view returns (string memory, string memory, string memory, string memory) {
        return productRegistry.getProduct(_productId);
    }

    // Retrieve location history of a product
    function getLocationHistory(bytes32 _productId) public view returns (LocationTracker.Coordinates[] memory) {
        return locationTracker.getLocationHistory(_productId);
    }
}
