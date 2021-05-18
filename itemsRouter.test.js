const app = require('./app.js'); 
const items = require('./fakeDb.js');
const request = require('supertest'); 



beforeEach(function(){
    // make sure this is always the only item added before each test begins
    items.push({name: 'Sword', price: 300}); 
});

afterEach(function(){
    items.length = 0; 
});

describe('test /items/name GET', ()=>{
    test('should retrieve existing item', async ()=>{
        const resp = await request(app).get('/items/Sword'); 

        expect(resp.status).toEqual(200); 
        
        expect(resp.body).toEqual({'name': 'Sword', 'price': 300}); 

    }); 
    test('should return 400 when item does not exit', async ()=>{
        const resp = await request(app).get('/items/dog'); 

        expect(resp.status).toEqual(400); 
    });
});


describe('test /items GET', ()=>{
    test('should retrieve all items', async ()=>{
        items.push({name: 'Dog', price: 3000}); 
        items.push({name: 'Cat', price: 2000});
        
        const resp = await request(app).get('/items'); 

        expect(resp.status).toEqual(200); 

        const dataArray = resp.body.items;  

        for(let i = 0; i < dataArray; i++){
            expect(dataArray[i]).toEqual(items[i]);   
        }

    });
});

describe('test /items POST', ()=>{
    test('test should create valid item', async function(){
        const resp = await request(app)
            .post('/items')
            .send({
                    'name': 'Car', 
                    'price': 40000
                });
        
        expect(resp.status).toEqual(201); 

        expect(resp.body).toEqual({'added': {'name': 'Car', 'price': 40000}});
        expect(items.slice(-1)[0]).toEqual(resp.body.added); 


    });

    test('should return 400 if we try to create an item with the name of an existing item', async ()=>{
        const resp = await request(app).post('/items').send({'name': 'Sword', 'name': 500}); 

        expect(resp.status).toEqual(400);
    });

    test('should return 400 if we try to create an item without a name', async ()=>{
        const resp = await request(app).post('/items').send({'price': 500}); 

        expect(resp.status).toEqual(400);
    });

    test('should return 400 if we try to create an item without a price', async ()=>{
        const resp = await request(app).post('/items').send({'name': 'Lightning'}); 

        expect(resp.status).toEqual(400);
    });


    test('should return 400 if we try to use an invalid value for the price', async ()=>{
        const resp1 = await request(app).post('/items').send({'name': 'PC', price: "alot"});
        const resp2 = await request(app).post('/items').send({'name': 'PC', price: "-1"});
        
        expect([resp1.status, resp2.status]).toEqual([400,400]);

    });
});


describe('test /items/name PATCH', ()=>{
    test('should update existing item as expected', async ()=>{
        const updatedObj = {'name': 'Great Sword', 'price': 5000};
        const resp = await request(app).patch('/items/Sword').send(updatedObj); 
        
        expect(resp.status).toEqual(200); 
        expect(resp.body.updated).toEqual(updatedObj);
        expect(items[0]).toEqual(updatedObj);
    });

    test('should return 400 if item cannot be found', async ()=>{
        const resp = await request(app).patch('/items/dog').send({name:'dog', price:300});

        expect(resp.status).toEqual(400);
    });

    test('should return 400 if no name given to body', async ()=>{
        const resp = await request(app).patch('/items/Sword').send({price: 3333}); 

        expect(resp.status).toEqual(400);
    });


    test('should return 400 if no price given to the body', async() => {
        const resp = await request(app).patch('/items/Sword').send({name: 'Cat'}); 

        expect(resp.status).toEqual(400);
    });
});


describe('test /items/name delete', ()=>{
    test('should delete existing item as expected', async function(){
        const resp = await request(app).delete('/items/Sword'); 

        expect(resp.status).toEqual(200); 
        expect(items.length).toEqual(0); 
    });

    test('should return 400 when item does not exist', async function(){
        const resp = await request(app).delete('/items/dog'); 
        
        expect(resp.status).toEqual(400);
    });
});