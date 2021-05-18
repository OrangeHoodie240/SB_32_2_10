const express = require('express');
const router = new express.Router();
const items = require('./fakeDb');
const utility = require('./utility');
const ExpressError = require('./expressError');


router.get('/', (req, res) => {
    return res.json(items);
});

router.post('/', (req, res, next) => {

    const item = {
        'name': req.body.name,
        'price': Number(req.body.price)
    };

    const shouldBeNegative = items.findIndex(b => b.name === item.name); 

    if (!item.name) {
        return next(new ExpressError('Errorr: Invalid item name', 400));
    }
    else if (!utility.validPrice(item.price)) {
        return next(new ExpressError('Error: Invalid price', 400));
    }
    else if(shouldBeNegative >= 0){
        return next(new ExpressError('Error: Item Exists', 400));
    }


    items.push(item);
    return res.status(201).json({ 'added': item });
});


router.get('/:name', (req, res, next) => {
    const name = req.params.name;
    const item = items.find(b=>b.name === name); 
    
    if(!item){
        return next(new ExpressError(`Error: No Item Named ${name}`, 400)); 
    }

    return res.json(item);
});

router.patch('/:name', (req, res, next)=>{
    const itemIndex = items.findIndex(b=>b.name === req.params.name); 
    const name = req.body.name; 
    const price = Number(req.body.price); 


    if(itemIndex < 0){
        return next(new ExpressError(`Error: No Item Named ${name}`, 400)); 
    }
    else if(!name){
        return next(new ExpressError(`Error: No Item Named ${name}`, 400)); 
    }
    else if(!utility.validPrice(price)){
        return next(new ExpressError(`Error: Invalid Price`, 400)); 
    }

    const item = {name, price};
    items[itemIndex] = item; 

    return res.json({"updated": item}); 
});


router.delete('/:name', (req, res, next)=>{
    const itemIndex = items.findIndex(b=>b.name === req.params.name); 
    
    if(itemIndex < 0){
        return next(new ExpressError(`Error: No Item Named ${req.params.name}`, 400)); 
    }

    items.splice(itemIndex, 1); 
    return res.json({'message': 'Deleted'}); 
});

module.exports = router;