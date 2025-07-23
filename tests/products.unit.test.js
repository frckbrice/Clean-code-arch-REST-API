/* eslint-env jest */
const {
    createProductController,
    findAllProductController,
    findOneProductController,
    updateProductController,
    deleteProductController,
} = require('../interface-adapters/controllers/products/product-controller');

describe('Product Controller Unit Tests', () => {
    it('should create a product (mocked)', async () => {
        const createProductUseCaseHandler = jest.fn().mockResolvedValue({ id: '123', name: 'Test' });
        const dbProductHandler = { createProductDbHandler: jest.fn() };
        const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
        const logEvents = jest.fn();
        const handler = createProductController({
            createProductUseCaseHandler,
            dbProductHandler,
            errorHandlers,
            logEvents,
        });
        const httpRequest = { body: { name: 'Test' } };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(201);
        expect(response.data).toEqual({ createdProduct: { id: '123', name: 'Test' } });
    });

    it('should return 400 if no product data provided', async () => {
        const createProductUseCaseHandler = jest.fn();
        const dbProductHandler = { createProductDbHandler: jest.fn() };
        const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
        const logEvents = jest.fn();
        const handler = createProductController({
            createProductUseCaseHandler,
            dbProductHandler,
            errorHandlers,
            logEvents,
        });
        const httpRequest = { body: {} };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(400);
        expect(response.errorMessage).toBe('No product data provided');
    });

    it('should get all products (mocked)', async () => {
        const findAllProductUseCaseHandler = jest.fn().mockResolvedValue([{ id: '1' }, { id: '2' }]);
        const dbProductHandler = { findAllProductsDbHandler: jest.fn() };
        const logEvents = jest.fn();
        const handler = findAllProductController({
            dbProductHandler,
            findAllProductUseCaseHandler,
            logEvents,
        });
        const httpRequest = { query: {} };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.data.products)).toBe(true);
    });

    it('should get a product by id (mocked)', async () => {
        const findOneProductUseCaseHandler = jest.fn().mockResolvedValue({ id: '1', name: 'Test' });
        const dbProductHandler = { findOneProductDbHandler: jest.fn() };
        const logEvents = jest.fn();
        const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
        const handler = findOneProductController({
            dbProductHandler,
            findOneProductUseCaseHandler,
            logEvents,
            errorHandlers,
        });
        const httpRequest = { params: { productId: '1' } };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(201);
        expect(response.data.product).toEqual({ id: '1', name: 'Test' });
    });

    it('should update a product (mocked)', async () => {
        const updateProductUseCaseHandler = jest.fn().mockResolvedValue({ id: '1', name: 'Updated' });
        const dbProductHandler = { findOneProductDbHandler: jest.fn(), updateProductDbHandler: jest.fn() };
        const logEvents = jest.fn();
        const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
        const handler = updateProductController({
            dbProductHandler,
            updateProductUseCaseHandler,
            logEvents,
            errorHandlers,
        });
        const httpRequest = { params: { productId: '1' }, body: { name: 'Updated' } };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(201);
        expect(response.data).toContain('Updated');
    });

    it('should delete a product (mocked)', async () => {
        const deleteProductUseCaseHandler = jest.fn().mockResolvedValue({ deletedCount: 1 });
        const dbProductHandler = { findOneProductDbHandler: jest.fn(), deleteProductDbHandler: jest.fn() };
        const logEvents = jest.fn();
        const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
        const handler = deleteProductController({
            dbProductHandler,
            deleteProductUseCaseHandler,
            logEvents,
            errorHandlers,
        });
        const httpRequest = { params: { productId: '1' } };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(201);
        expect(response.data.deletedCount).toBe(1);
    });

    it('should handle DB error on create', async () => {
        const createProductUseCaseHandler = jest.fn().mockRejectedValue(new Error('DB error'));
        const dbProductHandler = { createProductDbHandler: jest.fn() };
        const errorHandlers = { UniqueConstraintError: Error, InvalidPropertyError: Error };
        const logEvents = jest.fn();
        const handler = createProductController({
            createProductUseCaseHandler,
            dbProductHandler,
            errorHandlers,
            logEvents,
        });
        const httpRequest = { body: { name: 'Test' } };
        const response = await handler(httpRequest);
        expect(response.statusCode).toBe(500);
        expect(response.errorMessage).toBe('DB error');
    });
}); 