const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Organic Apples', price: 2.50 },
  { id: 2, name: 'Whole Milk', price: 3.00 },
  { id: 3, name: 'Sourdough Bread', price: 4.50 },
];

// GET all products
router.get('/', (req, res) => {
  res.json(products);
});

// AI-POWERED RECOMMENDATION ENDPOINT (Placeholder)
router.get('/recommendations/:userId', (req, res) => {
    // In a real application, you would call a generative AI model (like Gemini) here.
    // The model would take the user's purchase history or profile
    // and generate personalized product recommendations.
    console.log(`Generating recommendations for user ${req.params.userId}`);
    
    // For now, we return a mock response.
    res.json([
        { id: 4, name: 'Avocado', price: 1.75, reason: 'Goes well with bread' },
        { id: 5, name: 'Gourmet Cheese', price: 6.00, reason: 'Complements your recent wine purchase' }
    ]);
});


module.exports = router;
