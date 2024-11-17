/********************************************************************************
* WEB700 – Assignment 5
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Rajan Kamboj Student ID: 113449243 Date: 17-11-2024 (dd-mm-yyyy)
*
********************************************************************************/

class LegoData {
    sets; // Array to hold Lego sets
    themes; // Array to hold themes

    constructor() {
        this.sets = []; // Initialize sets array
        this.themes = []; // Initialize themes array
    }

    // Initialize the Lego data by loading sets and themes
    async initialize() {
        try {
            const setData = require("../data/setData"); // Load set data
            const themeData = require("../data/themeData"); // Load theme data
            this.themes = [...themeData]; // Spread operator to copy themes

            // Map through each set and associate it with its theme
            this.sets = setData.map(eachSet => {
                const theme = themeData.find(theme => theme.id === eachSet.theme_id); // Find the corresponding theme
                if (!theme) {
                    throw { code: 404, message: `Theme not found for set: ${eachSet.name}` }; // Throw error if theme is not found
                }
                return {
                    ...eachSet, // Spread existing set properties
                    theme: theme.name // Assign theme name
                };
            });
        } catch (err) {
            throw { code: 500, message: "Error in initialization: " + err }; // Throw error if initialization fails
        }
    }

    // Get all Lego sets
    async getAllSets() {
        return this.sets; // Return the sets array
    }

    // Get a Lego set by its number
    async getSetByNum(setNum) {
        const setByNum = this.sets.find(eachSet => eachSet.set_num === setNum); // Find the set by number
        if (setByNum) {
            return setByNum; // Return the found set
        } else {
            throw { code: 404, message: "Set not found" }; // Throw error if set not found
        }
    }

    // Get Lego sets by theme
    async getSetsByTheme(theme) {
        const setByTheme = this.sets.filter(eachSet => eachSet.theme.toLowerCase().includes(theme.toLowerCase())); // Filter sets by theme
        if (setByTheme.length > 0) {
            return setByTheme; // Return the filtered sets
        } else {
            throw { code: 404, message: "No sets found with the entered theme" }; // Throw error if no sets found
        }
    }

    // Add a new Lego set
    async addSet(newSet) {
        const existingSet = this.sets.find(set => set.set_num === newSet.set_num); // Check if the set already exists
        if (existingSet) {
            throw { code: 422, message: "Set already exists" }; // Throw error if set already exists
        } else {
            this.sets.push(newSet); // Add the new set to the array
        }
    }

    // Get all themes
    async getAllThemes() {
        return this.themes; // Return the themes array
    }

    // Get a theme by its ID
    async getThemeById(id) {
        const theme = this.themes.find(eachTheme => eachTheme.id === id); // Find the theme by ID
        if (theme) {
            return theme; // Return the found theme
        } else {
            throw { code: 404, message: "Unable to find requested theme" }; // Throw error if theme not found
        }
    }

    // Delete a Lego set by its number
    async deleteSetByNum(setNum) {
        const foundSetIndex = this.sets.findIndex(s => s.set_num == setNum); // Find the index of the set
        if (foundSetIndex !== -1) {
            this.sets.splice(foundSetIndex, 1); // Remove the set from the collection
        } else {
            throw { code: 404, message: "Set not found" }; // Throw error if set not found
        }
    }
}

module.exports = LegoData; // Export the LegoData class