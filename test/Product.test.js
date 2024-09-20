const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", accounts => {
    const [owner, producer, transporter, retailer] = accounts;

    let supplyChain;

    beforeEach(async () => {
        supplyChain = await SupplyChain.new(producer, transporter, retailer);
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

    it("Should return product information correctly", async () => {
        const productId = await supplyChain.generateProductId("Product A", "Origin A");
        await supplyChain.addProduct("Product A", "Origin A", "Details of Product A", "Destination A", 123, 653, { from: producer });

        const result = await supplyChain.getProduct(productId);
        console.log(result);

        const [name, origin, details, state, destination, currentLocation, locationHistory] = result;

        assert.equal(name, "Product A");
        assert.equal(origin, "Origin A");
        assert.equal(details, "Details of Product A");
        assert.equal(state.toString(), "0"); // State.Created
        assert.equal(destination, "Destination A");
        assert.equal(currentLocation.latitude.toString(), "123456");
        assert.equal(currentLocation.longitude.toString(), "654321");
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
