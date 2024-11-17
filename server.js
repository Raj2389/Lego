const express = require("express");
const path = require("path");
const LegoData = require("./modules/legoSets");
const legoData = new LegoData();
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Constants for HTTP status codes
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));

// Route to get all Lego sets or filter by theme
app.get('/lego/sets', async (req, res) => {
    const { theme } = req.query; // Destructure theme from query
    console.log("Requested theme:", theme);
    try {
        const sets = theme 
            ? await legoData.getSetsByTheme(theme) 
            : await legoData.getAllSets();

        res.render("sets", { sets: Array.isArray(sets) ? sets : [] });
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(HTTP_STATUS.NOT_FOUND).render("404");
    }
});

// Route to get a single Lego set by set_num
app.get('/lego/sets/:set_num', async (req, res) => {
    const { set_num } = req.params; // Destructure set_num from params
    console.log("Requested set number:", set_num);
    try {
        const setByNum = await legoData.getSetByNum(set_num);
        if (setByNum) {
            res.render("set", { set: setByNum });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).render("404");
        }
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(HTTP_STATUS.NOT_FOUND).render("404");
    }
});

// Route to serve the add Lego set form
app.get('/lego/addSet', async (req, res) => {
    try {
        const themes = await legoData.getAllThemes();
        res.render("addSet", { themes });
    } catch (error) {
        console.error("Error fetching themes:", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
});

// Route to add a new Lego set
app.post('/lego/addSet', async (req, res) => {
    try {
        const foundTheme = await legoData.getThemeById(req.body.theme_id);
        req.body.theme = foundTheme.name;
        await legoData.addSet(req.body);
        res.redirect('/lego/sets');
    } catch (error) {
        console.error("Error adding set:", error);
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send("Internal Server Error");
    }
});

// Route to delete a Lego set
app.get("/lego/deleteSet/:set_num", async (req, res) => {
    const { set_num } = req.params; // Destructure set_num from params
    try {
        await legoData.deleteSetByNum(set_num);
        res.redirect("/lego/sets");
    } catch (err) {
        console.error("Error deleting set:", err);
        res.status(HTTP_STATUS.NOT_FOUND).send("Set not found");
    }
});

// Middleware to handle 404 errors
app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).render("404");
});

// Initialize and start the server
legoData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`Server listening on: ${HTTP_PORT}`);
    });
}).catch(error => {
    console.error("Error initializing LegoData:", error);
});