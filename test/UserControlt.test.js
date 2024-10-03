const UserAccessControl = artifacts.require("UserAccessControl");

contract("UserAccessControl", accounts => {
    const [admin, producer, transporter, retailer] = accounts;
    let userAccessControl;

    beforeEach(async () => {
        userAccessControl = await UserAccessControl.new({ from: admin });
    });

    it("Admin should have DEFAULT_ADMIN_ROLE", async () => {
        const DEFAULT_ADMIN_ROLE = await userAccessControl.DEFAULT_ADMIN_ROLE();
        const hasAdminRole = await userAccessControl.hasRole(DEFAULT_ADMIN_ROLE, admin);
        assert.equal(hasAdminRole, true, "Admin should have the default admin role");
    });

    it("Admin should be able to grant PRODUCER_ROLE", async () => {
        const PRODUCER_ROLE = await userAccessControl.PRODUCER_ROLE();
        await userAccessControl.grantProducerRole(producer, { from: admin });
        const hasProducerRole = await userAccessControl.hasRole(PRODUCER_ROLE, producer);
        assert.equal(hasProducerRole, true, "Producer should have the PRODUCER_ROLE");
    });

    it("Admin should be able to grant TRANSPORTER_ROLE", async () => {
        const TRANSPORTER_ROLE = await userAccessControl.TRANSPORTER_ROLE();
        await userAccessControl.grantTransporterRole(transporter, { from: admin });
        const hasTransporterRole = await userAccessControl.hasRole(TRANSPORTER_ROLE, transporter);
        assert.equal(hasTransporterRole, true, "Transporter should have the TRANSPORTER_ROLE");
    });

    it("Admin should be able to grant RETAILER_ROLE", async () => {
        const RETAILER_ROLE = await userAccessControl.RETAILER_ROLE();
        await userAccessControl.grantRetailerRole(retailer, { from: admin });
        const hasRetailerRole = await userAccessControl.hasRole(RETAILER_ROLE, retailer);
        assert.equal(hasRetailerRole, true, "Retailer should have the RETAILER_ROLE");
    });
});
