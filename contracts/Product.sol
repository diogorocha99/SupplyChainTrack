// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {

    address public owner;
    address public producer;
    address public transporter;
    address public retailer;

    enum State { Created, Shipped, InTransit, Delivered }

    struct Coordinates {
        int256 latitude;   // Latitude
        int256 longitude;  // Longitude
    }
    
    struct Product {
        bytes32 id;
        string name;
        string origin;
        string details;
        State state;
        string destination; // Campo para o destino
        Coordinates currentLocation; // Armazena a localização atual
        Coordinates[] locationHistory; // Array para histórico de localizações
    }

    mapping(bytes32 => Product) public products;

    event ProductCreated(bytes32 productId, string name, string origin, string details, string destination);
    event ProductStateUpdated(bytes32 productId, State state, int256 latitude, int256 longitude);

    modifier onlyProducer() {
        require(msg.sender == producer, "Only producer can call this function.");
        _;
    }

    modifier onlyTransporter() {
        require(msg.sender == transporter, "Only transporter can call this function.");
        _;
    }

    modifier onlyRetailer() {
        require(msg.sender == retailer, "Only retailer can call this function.");
        _;
    }

    modifier onlyParticipant() {
        require(msg.sender == producer || msg.sender == transporter || msg.sender == retailer, "Only authorized participants can call this function.");
        _;
    }

    constructor(address _producer, address _transporter, address _retailer) {
        owner = msg.sender;
        producer = _producer;
        transporter = _transporter;
        retailer = _retailer;
    }

    function generateProductId(string memory _name, string memory _origin) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _origin));
    }

    function addProduct(string memory _name, string memory _origin, string memory _details, string memory _destination, int256 _latitude, int256 _longitude) public onlyProducer {
        bytes32 productId = generateProductId(_name, _origin);
        Product storage product = products[productId];

        product.id = productId;
        product.name = _name;
        product.origin = _origin;
        product.details = _details;
        product.destination = _destination;
        product.state = State.Created;
        product.currentLocation = Coordinates({ latitude: _latitude, longitude: _longitude });

        product.locationHistory.push(Coordinates({ latitude: _latitude, longitude: _longitude }));

        emit ProductCreated(productId, _name, _origin, _details, _destination);
    }

    function updateProductState(bytes32 _productId, State _state, int256 _latitude, int256 _longitude) public onlyParticipant {
        Product storage product = products[_productId];
        product.state = _state;
        product.currentLocation = Coordinates({ latitude: _latitude, longitude: _longitude });

        // Adiciona nova localização ao histórico
        product.locationHistory.push(product.currentLocation);

        emit ProductStateUpdated(_productId, _state, _latitude, _longitude);
    }

    function getProduct(bytes32 _productId) public view returns (
        string memory name, 
        string memory origin, 
        string memory details, 
        State state, 
        string memory destination, 
        int256 currentLatitude,
        int256 currentLongitude,
        int256[] memory locationHistory
        ) {
        Product memory product = products[_productId];

        // Convertendo latitude e longitude para strings
        currentLatitude = product.currentLocation.latitude;
        currentLongitude = product.currentLocation.longitude;

        int256[] memory history = new int256[](product.locationHistory.length * 2);

        for (uint256 i = 0; i < product.locationHistory.length; i++) {
            history[i * 2] = product.locationHistory[i].latitude;
            history[i * 2 + 1] = product.locationHistory[i].longitude;
        }

        return (product.name, product.origin, product.details, product.state, product.destination, currentLatitude, currentLongitude, history);
    }
    
    function getLocationHistory(bytes32 _productId) public view returns (int256[] memory) {
        Coordinates[] storage locations = products[_productId].locationHistory;
        int256[] memory locationInts = new int256[](locations.length * 2);

        for (uint256 i = 0; i < locations.length; i++) {
            locationInts[i * 2] = locations[i].latitude;
            locationInts[i * 2 + 1] = locations[i].longitude;
        }

        return locationInts;
    }

    function updateCurrentLocation(bytes32 _productId, int256 _latitude, int256 _longitude) public onlyParticipant {
        products[_productId].currentLocation = Coordinates({
            latitude: _latitude,
            longitude: _longitude
        });
    }
}
