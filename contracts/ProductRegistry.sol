// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProductRegistry {

    enum State { Created, Shipped, InTransit, Delivered }

    struct Product {
        bytes32 id;
        string name;
        string origin;
        string details;
        State state;
        string destination;
    }

    mapping(bytes32 => Product) public products;

    event ProductCreated(bytes32 productId, string name, string origin, string details, string destination);

    function generateProductId(string memory _name, string memory _origin) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _origin));
    }

    function addProduct(string memory _name, string memory _origin, string memory _details, string memory _destination) public returns (bytes32) {
        bytes32 productId = generateProductId(_name, _origin);
        products[productId] = Product({
            id: productId,
            name: _name,
            origin: _origin,
            details: _details,
            state: State.Created,
            destination: _destination
        });

        emit ProductCreated(productId, _name, _origin, _details, _destination);
        return productId;
    }

    function productExists(bytes32 _productId) public view returns (bool) {
        return products[_productId].id != bytes32(0);
    }

    function getProduct(bytes32 _productId) public view returns (string memory, string memory, string memory, string memory) {
        Product memory product = products[_productId];
        return (product.name, product.origin, product.details, product.destination);
    }
}