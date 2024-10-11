/********************************************************************************
* WEB700 – Assignment 3
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Rajan Kamboj Student ID: 113449243 Date: 09-10-2024 (dd-mm-yyyy)
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
        reject("Error in initialization "+err);  // if any error comes, reject
    }
  });
  
 }
 //function getAllSets() to  return all the sets
getAllSets(){
  return new Promise((resolve, reject) => { // new Promise initiated
    try {
       resolve(this.sets); // if all sets are returned, resolve
    }catch(err){
      reject("Error in returing all Sets: "+ err); // reject if any error is encountered
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
        console.log("No set found with the entered setNum: " + setNum); // if no set is found, return reject
        resolve(null);
      }
    }catch(err){
      reject("Error caught in getSetByNum for the entered setNum: " + setNum + " ; " + err);  // if error caught, return reject
    }
  });

}
// function getSetByTheme to return the sets where sets.theme match with the theme provided by us
getSetsByTheme(theme){
  return new Promise((resolve,reject) => {  // new Promise initiated
    try{
      const setByTheme = this.sets.filter(eachSet => eachSet.theme.toLowerCase().includes(theme.toLowerCase()));
  if(setByTheme.length>0){
      resolve(setByTheme);  // returing resolve if sets with theme is found, using length to ensure it is not
  }else{
    reject("No set found with the entered theme: " + theme); // returing reject if no set is found
  }
    }catch(error){
      reject("Error in getSetsByTheme for " + theme + " ; " + error); // returing reject if any error is encountered
    }
  });
}
}
module.exports = LegoData;