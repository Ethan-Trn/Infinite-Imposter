console.log("starting...");
import readline from 'readline/promises';
import dotenv from 'dotenv';
import connectDB from './db';
import generateWords from './gemini';
import Category from './models/category'
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const run = async () => {
  await connectDB();
for (;;) {
  const category = await rl.question('Enter a category: ');
  console.log(`You entered: ${category}`);
  if (category == "exit") {
    rl.close();
    process.exit(0);
    return;
  }

  // check if category already exists in MongoDB
  console.log('Checking MongoDB for existing category...');
  const existing = await Category.findOne({ category: category.toLowerCase() });

  if (existing) {
    console.log('Found in database, no need to call Gemini!');
    console.log(existing.words);
  } else {
    console.log('Not found, calling Gemini...');
    const words = await generateWords(category.toLowerCase());

    const newCategory = new Category({
      category: category.toLowerCase(),
      words: words
    });

    await newCategory.save();
    console.log('Saved to MongoDB!');
    console.log(words);
  }
};
}

run();