const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const express = require("express");
const app = express();
const path = require("path");
const HTTP_PORT = process.env.PORT || 8080;
app.use(express.static(__dirname + '/public'));
// Serve static files from the "public" directory
//app.use(express.static('public'));
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

app.get("/", (req, res) => {
    // res.send("Hello World!!!!!");
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res) => {
    // res.send("About!")
    res.sendFile(path.join(__dirname, "views/about.html"));
});

// Route to get all Lego sets or filter by theme
app.get('/lego/sets', async (req, res) => {
    const theme = req.query.theme;
    console.log("Requested theme:", theme); // Log the requested theme
    try {
        if (theme) {
            const setByTheme = await legoData.getSetsByTheme(theme); // Await the result of the method
            console.log("Filtered sets:", setByTheme); // Log the filtered sets
            res.json(setByTheme); // Return the filtered sets as JSON
        } else {
            res.json(legoData); // Return all Lego sets if no theme is provided
        }
    } catch (error) {
        console.error("Error occurred:", error); // Log the error
        // Serve the 404.html file on error
        const filePath = path.join(__dirname, 'views', '404.html'); // Define the file path
        res.status(404).sendFile(filePath); // Send the 404.html file with status 404
    }
});

// Route to get a single Lego set by set_num
app.get('/lego/sets/:set_num', async (req, res) => {
    const setNum = req.params.set_num;
    console.log("Requested set number:", setNum); // Log the requested set number
    try {
        const setByNum = await legoData.getSetByNum(setNum); // Await the result of the method
        // Check if the set is found
        if (setByNum) {
            console.log("Found set:", setByNum); // Log the found set
            res.json(setByNum); // Return the found set
        } else {
            // If no set is found, serve the 404.html file
            const filePath = path.join(__dirname, 'views', '404.html'); // Define the file path
            res.status(404).sendFile(filePath); // Send the 404.html file with status 404
        }
    } catch (error) {
        console.error("Error occurred:", error); // Log the error
        // Serve the 404.html file on error
        const filePath = path.join(__dirname, 'views', '404.html'); // Define the file path
        res.status(404).sendFile(filePath); // Send the 404.html file with status 404
    }
});

// Route to add a test Lego set
app.get('/lego/add-test', (req, res) => {
  let testSet = {
    set_num: "123",
    name: "testSet name",
    year: "2024",
    theme_id: "366",
    num_parts: "123",
    img_url: "https://fakeimg.pl/375x375?text=[+Lego+]"
  };

  legoData.addSet(testSet)
    .then(() => {
      res.redirect('/lego/sets'); // Redirect on success
    })
    .catch((error) => {
      res.status(422).send(error); // Send error with status 422
    });
});

// Route to serve the add Lego set form
app.get('/lego/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addLegoSet.html')); // Serve the addLegoSet.html file
});

// Route to add a new Lego set
app.post('/lego/add', (req, res) => {
    const newSet = req.body; // Expecting the new set data in the request body

    legoData.addSet(newSet)
        .then(() => {
            res.status(200).send("Set added successfully"); // Respond with success message
        })
        .catch((error) => {
            res.status(422).send({ error: error }); // Send error with status 422
        });
});

// Middleware to handle 404 errors
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); // Serve 404.html
});

legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
});