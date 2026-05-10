This is purely bc i don't know anything about webdev and should know a bit despite not wanting to go into web dev
Express: Creates the backend server and allows you to do the get and post for mongodb
Router: It's the one that sends the computer to the right link or what depending on what they ask for. Like a traffic manager
- router.get('/:name', async (req, res) =>  if someone sends a Get request for 

req = information coming IN like the input or what comes after the /categories
res = information going OUT

res.json({ 
        source: 'database', 
        words: existing.words });

creates a json which is a javascript object
contains two objects similar to variable 
a variable called source which stores : 'database'
and a variable which acts as an array storing all the existing words

**const { category } = req.body;** 

For POST requests, frontend can send extra data.

Example frontend request:

fetch('/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    category: 'animals'
  })
})
'
req.body gets category: 'animals'

Fun fact for express return is not what sends the output whatever res.json is 