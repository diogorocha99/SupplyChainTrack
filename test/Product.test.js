const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", accounts => {
    const [producer, transporter, retailer, participant] = accounts;

    let supplyChain;

    beforeEach(async () => {
        supplyChain = await SupplyChain.new(producer, transporter, retailer, participant);
    });

    it("Creation of the product", async () => {
        const productId = await supplyChain.generateProductId("Product A", "Origin A");
        await supplyChain.addProduct("Product A", "Origin A", "Details of Product A", "Destination A", 123456, 654321, { from: producer });
        
        const product = await supplyChain.products(productId);
        assert.equal(product.name, "Product A");
        assert.equal(product.origin, "Origin A");
        assert.equal(product.details, "Details of Product A");
        assert.equal(product.state.toString(), "0"); // State.Created
        assert.equal(product.destination, "Destination A");
        assert.equal(product.currentLocation.latitude.toString(), "123456");
        assert.equal(product.currentLocation.longitude.toString(), "654321");
    });

    it("Should update the information of the product", async () => {
        const productId = await supplyChain.generateProductId("Product A", "Origin A");
        await supplyChain.addProduct("Product A", "Origin A", "Details of Product A", "Destination A", 123456, 654321, { from: producer });
        
        await supplyChain.updateProductState(productId, 1, 223456, 754321, { from: transporter }); // State.Shipped

        const product = await supplyChain.products(productId);
        assert.equal(product.state.toString(), "1"); // State.Shipped
        assert.equal(product.currentLocation.latitude.toString(), "223456");
        assert.equal(product.currentLocation.longitude.toString(), "754321");
        
        const history = await supplyChain.getLocationHistory(productId);
        assert.equal(history[2].toString(), "223456"); // Latitude na terceira posição
        assert.equal(history[3].toString(), "754321"); // Longitude na quarta posição
    });

    it("Should return the current location of the product after creation", async () => {
        const productId = await supplyChain.generateProductId("Product A", "Origin A");
        await supplyChain.addProduct("Product A", "Origin A", "Details of Product A", "Destination A", 123456, 654321, { from: producer });
    
        // Retrieve the product information directly from the contract
        const product = await supplyChain.products(productId);
    
        // Log the current location to check its values
        console.log("Current Location:", product.currentLocation.latitude.toString(), product.currentLocation.longitude.toString());
    
        // Assertions to ensure the current location is correct
        assert.equal(product.currentLocation.latitude.toString(), "123456");
        assert.equal(product.currentLocation.longitude.toString(), "654321");
    });

    it("Should return the product information correctly", async () => {
        const productId = await supplyChain.generateProductId("Product A", "Origin A");
        await supplyChain.addProduct("Product A", "Origin A", "Details of Product A", "Destination A", 123456, 654321, { from: producer });
    
        const result = await supplyChain.products(productId);
        console.log(result); // Log the result for debugging
    
        // Destructure the result
        const name = result.name;
        const origin = result.origin;
        const details = result.details;
        const state = result.state.toNumber(); // Convert state to number
        const destination = result.destination; // Capture the destination
        const currentLatitude = result.currentLocation.latitude.toString();
        const currentLongitude = result.currentLocation.longitude.toString();
        const locationHistory = [];
        for (let i = 0; i < result[6].length; i++) {
            locationHistory.push(parseInt(result[6][i].toString())); // Convert location history to numbers
        }
    
        // Assertions
        assert.equal(name, "Product A");
        assert.equal(origin, "Origin A");
        assert.equal(details, "Details of Product A");
        assert.equal(state, 0); // State.Created
        assert.equal(currentLatitude.toString(), "123456");
        assert.equal(currentLongitude.toString(), "654321");
        assert.equal(destination, "Destination A"); // Adding check for destination
        assert.isAbove(locationHistory.length, 0);
    });

    it("Should udpdate the location of the product", async () => {
        const productId = await supplyChain.generateProductId("Product A", "Origin A");
        await supplyChain.addProduct("Product A", "Origin A", "Details of Product A", "Destination A", 123456, 654321, { from: producer });

        await supplyChain.updateCurrentLocation(productId, 333456, 854321, { from: transporter });

        const product = await supplyChain.products(productId);
        assert.equal(product.currentLocation.latitude.toString(), "333456");
        assert.equal(product.currentLocation.longitude.toString(), "854321");
    });
});
