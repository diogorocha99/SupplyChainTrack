// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProductRegistry {
    function productExists(bytes32 _productId) external view returns (bool);
}

contract LocationTracker {
    
    IProductRegistry public productRegistry;

    struct Coordinates {
        int256 latitude;
        int256 longitude;
    }

    mapping(bytes32 => Coordinates[]) public productLocations;
    
    event LocationUpdated(bytes32 productId, int256 latitude, int256 longitude);

    constructor(address _productRegistry) {
        productRegistry = IProductRegistry(_productRegistry);
    }

    function updateLocation(bytes32 _productId, int256 _latitude, int256 _longitude) public {
        require(productRegistry.productExists(_productId), "Product does not exist");

        Coordinates memory newCoordinates = Coordinates({latitude: _latitude, longitude: _longitude});
        productLocations[_productId].push(newCoordinates);

        emit LocationUpdated(_productId, _latitude, _longitude);
    }

    function getLocationHistory(bytes32 _productId) public view returns (Coordinates[] memory) {
        return productLocations[_productId];
    }
}