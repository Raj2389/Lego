/********************************************************************************
* WEB700 – Assignment 4
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Rajan Kamboj Student ID: 113449243 Date: 01-11-2024 (dd-mm-yyyy)
*
********************************************************************************/

class LegoData{
 sets;
 constructor(){
  this.sets = [];
 }
 // function initialize to create the arrays using 'require' and use .forEach and .find() to compare both the arrays to add theme name to the final format of sets
 initialize(){
  return new Promise((resolve, reject) => { // new Promise initiated
    try {
      const setData = require("../data/setData");
      const themeData = require("../data/themeData");
      setData.forEach((eachSet) =>{
        const theme = themeData.find((theme) => theme.id === eachSet.theme_id); // using .find() to find the set where theme.id of themeData is equal to set.theme_id of setData array

        // creating a new set object with theme name(setData+theme)
        this.sets.push({
          ...eachSet, // this will bring all the existing fields in the set that already exists
          theme: theme.name // creating a field name theme in the set object and assigning the value of theme
        })
      });
      resolve(); // if all setData is pushed to Sets successfully with theme add, resolve
      //console.log(this.sets);
    }catch(err){
        reject({ code: 500, message: "Error in initialization " + err });  // if any error comes, reject with code
    }
  });
  
 }
 //function getAllSets() to  return all the sets
getAllSets(){
  return new Promise((resolve, reject) => { // new Promise initiated
    try {
       resolve(this.sets); // if all sets are returned, resolve
    }catch(err){
      reject({ code: 500, message: "Error in returing all Sets: " + err }); // reject if any error is encountered
    }
});
   
}
// function getSetByNum to return the sets where sets.set_num match with the setNum provided by us
getSetByNum(setNum){
  return new Promise((resolve,reject) => {  // new Promise initiated
    try{
      const setByNum = this.sets.find((eachSet) => eachSet.set_num === setNum);
      if(setByNum){
        resolve(setByNum); // if setByNum is found, return resolve
      }
      else{
        // Custom 404 error response
        reject({ code: 404, message: "Set not found", file: "/views/404.html" }); // if no set is found, return reject with 404
      }
    }catch(err){
      reject({ code: 500, message: "Error caught in getSetByNum for the entered setNum: " + setNum + " ; " + err });  // if error caught, return reject
    }
  });

}
// function getSetByTheme to return the sets where sets.theme match with the theme provided by us
getSetsByTheme(theme){
  return new Promise((resolve,reject) => {  // new Promise initiated
    try{
      const setByTheme = this.sets.filter(eachSet => eachSet.theme.toLowerCase().includes(theme.toLowerCase()));
      if(setByTheme.length > 0){
        resolve(setByTheme);  // returning resolve if sets with theme is found
      }else{
        // Custom 404 error response
        reject({ code: 404, message: "No sets found with the entered theme", file: "/views/404.html" }); // returning reject with 404 if no set is found
      }
    }catch(error){
      reject({ code: 500, message: "Error in getSetsByTheme for " + theme + " ; " + error }); // returning reject if any error is encountered
    }
  });
}

// Method to add a new Lego set
addSet(newSet) {
  return new Promise((resolve, reject) => {
    try {
      // Check if the set_num already exists
      const existingSet = this.sets.find(set => set.set_num === newSet.set_num);
      if (existingSet) {
        reject({ code: 422, message: "Set already exists" }); // Reject if the set already exists
      } else {
        this.sets.push(newSet); // Add the new set to the array
        resolve(); // Resolve the promise
      }
    } catch (err) {
      reject({ code: 422, message: "Error adding new set: " + err }); // Reject if any error occurs
    }
  });
}
}
module.exports = LegoData;