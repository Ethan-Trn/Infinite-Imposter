import express from 'express';
import generateWords from '../gemini';
import Category from '../models/category';

//This creates the traffic controller for the category endpoint. It has two routes: GET and POST. The GET route checks if the category exists in the database and returns the words if it does. The POST route generates new words for a category using Gemini, saves it to the database, and returns the words.
const categoryRouter = express.Router();

// GET - check if category exists and return words
categoryRouter.get('/:name', async (req, res) => {
  try {
    const existing = await Category.findOne({ category: req.params.name.toLowerCase() });
    
    if (existing) {
      res.json({ 
        source: 'database', 
        words: existing.words });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - generate and save new category
categoryRouter.post('/', async (req, res) => {
  try {
    const category  = req.body.category;
    
    //if we already have it fade it
    const existing = await Category.findOne({ category: category.toLowerCase() });
    if (existing) {
      //this is the actual content
      res.json({ source: 'database', words: existing.words });
      //return just ends the thing, so we don't have to do an else statement for the rest of the code
      return
    }

    const words = await generateWords(category.toLowerCase());
    //Creates a new category document and saves it to MongoDB, then returns the generated words in the response. If the category already exists, it returns the existing words without calling Gemini.
    const newCategory = new Category({ 
        category: category.toLowerCase(), 
        words });
    await newCategory.save();
    res.json({ source: 'gemini', 
        words });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default categoryRouter;