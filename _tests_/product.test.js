const mongoose = require('mongoose');
const request = require('supertest');

let server;

beforeAll((done) => {
    const app = require('../app');
    server = app.listen(3000, done);
});

afterAll(async () => {
    await mongoose.connection.close();  // Cierra la conexión a MongoDB
    server.close();
});

describe('Product API', () => {
    let productId;

    beforeEach(async () => {
        const response = await request(server)
            .post('/products')
            .send({
                title: 'Test Product',
                description: 'This is a test product',
                price: 19.99,
                image: '61IBBVJvSDL._AC_SY879_.jpg'
            });
        productId = response.body._id;
    });

    afterEach(async () => {
        await request(server).delete(`/products/${productId}`);
    });

    it('should get all products', async () => {
        const response = await request(server).get('/products');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get a single product', async () => {
        const response = await request(server).get(`/products/${productId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('title', 'Test Product');
    });

    it('should update a product', async () => {
        const response = await request(server)
          .put(`/products/${productId}`)
          .send({
            title: 'Updated Test Product',
            description: 'This is an updated test product',
            price: 29.99,
            image: '61IBBVJvSDL._AC_SY879_.jpg',
            category: 'Electronics',
            rating: { rate: 4.5, count: 10 }
          });
        
        console.log('Update Product Response:', response.body);  // Mensaje de depuración
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('title', 'Updated Test Product');
      });
      

    it('should not update a product with invalid data', async () => {
        const response = await request(server)
            .put(`/products/${productId}`)
            .send({
                title: '',  // Invalid title
                description: 'This is an updated test product',
                price: -10,  // Invalid price
                image: '61IBBVJvSDL._AC_SY879_.jpg'
            });
        expect(response.statusCode).toBe(400);  // Expect 400 Bad Request
    });

    it('should delete a product', async () => {
        const response = await request(server).delete(`/products/${productId}`);
        expect(response.statusCode).toBe(204);  // Expect 204 No Content
    });

    it('should return 404 if product does not exist', async () => {
        const nonExistentId = '64d2e0fbf70d4b2912345678';
        const response = await request(server).get(`/products/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    });

    it('should return 404 when deleting a non-existent product', async () => {
        const nonExistentId = '64d2e0fbf70d4b2912345678';
        const response = await request(server).delete(`/products/${nonExistentId}`);
        expect(response.statusCode).toBe(404);
    });
});
