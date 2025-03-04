const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to('db'); // Conectar a la base de datos

    this.on('InsertProduct', async (req) => {
        const {
            p_name,
            p_price,
            p_currency
        } = req.data;

        try {
            await db.run(`CALL InsertProduct(?, ?, ?)`, [p_name, p_price, p_currency]);
            return "Product inserted successfully";
        } catch (err) {
            req.error(500, "Error inserting product: " + err.message);
        }
    });

    this.on('UpdateProduct', async (req) => {
        const {
            p_id,
            p_name,
            p_price,
            p_currency
        } = req.data;
        try {
            await db.run(
                `CALL UpdateProduct(?, ?, ?, ?)`, [p_id, p_name, p_price, p_currency]
            );
            return "Product updated successfully";
        } catch (err) {
            req.error(500, "Error updating product: " + err.message);
        }
    });

    this.on('DeleteProduct', async (req) => {
        const {
            p_id
        } = req.data;
        try {
            await db.run(`CALL DeleteProduct(?)`, [p_id]);
            return "Product deleted successfully";
        } catch (err) {
            req.error(500, "Error deleting product: " + err.message);
        }
    });
});