// A base class is defined using the new reserved 'class' keyword


// This function takes in the items from a warehouse and returns all subsets 
// which are all the option routes we could take.
var subsets = function(nums) {
    var result = [[]];
    for(var i = 0; i<nums.length; i++) {
        var x = result.length;
        for(var j = 0; j < x; j++) {
            var temp = result[j].slice();
            temp.push(nums[i]);
            result.push(temp);
        }
    }
    return result;
};
module.exports = class InventoryAllocator {

  //Empty Constructor for now
  constructor() {
  }

  // Main function of InventoryAllocator takes in two parameter 
  // itemsRequested is a object
  // warehouses is also an object refereing to items in indiviudual warehouses
  calculatePossibleShipments(itemsRequested, warehouses) {
 // Grab keys for both objects
    var items = Object.keys(itemsRequested);
    var locations = Object.keys(warehouses);
    if(items.length === 0 || warehouses.length === 0) {
      return [];
    }
    //This object will keep track of if an item needs to be split or is not available
    var availability = {};

    //Check if we can meet requirements of itemsRequested
    for(let item of items) {
      //false represents if any single warehouse has the correct quantity of items
      //0 represents the total amount of an item in all warehouses
      availability[item] = [false,0];
    }
    //Calculate total quantity of items in warehouses and also if any of the items
    // requested need to be split
    for(let location of locations) {
      for(let item of items) {
        if((warehouses[location])[item] !== undefined) {
          availability[item][1] += (warehouses[location])[item];
          if((warehouses[location])[item] >= itemsRequested[item]){
            availability[item][0] = true;
          }
        }
      }
    }
    //If any of the itemsRequested dont exist or meet the quantity in our warehouses
    //return an empty array
    for(let item of items) {
      if(availability[item][1] < itemsRequested[item]){
        return [];
      }
    }
    
    //This function checks all the current options being fed into it
    //with the current amount of items that still need to be satisfied
    //Options is a array of items or item
    //Location is a integer that refers to the loction from the locations array
    //Function returns 3 options, 2 if we have meet all items, 1 if some items are still left, 0 if the option passed in is not possible
    var checkOptions = (option, location) => {
      //Here we copy the current amount of items left to be able to check
      //if the option fed in is possible or not
      let myCopy = Object.create(itemsRequested);
      for(var i = 0; i < option.length; i++) {
        // If any of the options is not a item requested and or if the option
        // is already satisfied return 0
        if( myCopy[option[i]] !== undefined && myCopy[option[i]] > 0){
          // If the warehouse item is greater than the item requested or if the item
          // needs to be split go ahead and subtract from items requested otherwise
          // return 0 for not possible
          if ( (warehouses[locations[location]])[option[i]] >= myCopy[option[i]] || !(availability[option[i]][0]) ) {
            myCopy[option[i]] = myCopy[option[i]] - (warehouses[locations[location]])[option[i]];
          } else {
            // This option does not work
            return 0;
          }
        } else {
          // This option does not work
          return 0;
        }
      }
      // go through the copy of item and see if any items still need to be satisfied
      // if so return 1 otherwise we have found a solution
      for(let item of items) {
        if(myCopy[item] > 0) {
          // all items are not satisfied
          return 1;
        }
      }
      // Solution found
      return 2;
    };
    // Small function to create an object with items from a warehouse that will satisfy a solution
    var addInto = (options, location) => {
      var obj={};
      var items = {};
      for (var i = 0; i < options.length; i++) {
        items[options[i]] = itemsRequested[options[i]];
      }
      obj[locations[location]] = items;
      return obj;
    };

    
    //If we can meet the requirments than find all possible solutions
    // With availbility caculated we now know that all items requested
    // are available and wether or not they need to be grabbed from different warehouses
    
    //Keep track of all results
    var results = [];
    
    
    var recursionCheck = (location, current) => {
      var options = subsets(Object.keys(warehouses[locations[location]]));

      for(let option = 1; option < options.length; option++) {
        // console.log(itemsRequested)
        // console.log(locations[location]);
        // console.log(options[option]);
        var check = checkOptions(options[option], location);
        if(check === 2) {
          current.push(addInto(options[option], location, current));
          var temp = current.slice();
          results.push(temp);
          current.pop();
          // console.log('Works');
        } else if (check === 1) {
          // add stuff into current and continue on the warehouses
          
          var obj={};
          var items = {};
          var op = options[option];
          for (let i = 0; i < op.length; i++) {
            if(itemsRequested[op[i]]>(warehouses[locations[location]])[op[i]]){
              items[op[i]] = (warehouses[locations[location]])[op[i]];
              itemsRequested[op[i]] = itemsRequested[op[i]] - (warehouses[locations[location]])[op[i]];
            } else if (itemsRequested[op[i]]<=(warehouses[locations[location]])[op[i]]) {
              items[op[i]] = itemsRequested[op[i]];
              itemsRequested[op[i]] = 0;
            } 
          }
          obj[locations[location]] = items;
          current.push(obj);
          //for loop
          for(let i = location+1; i < locations.length; i++) {
            recursionCheck(i, current);
          }
          current.pop();
          for (let i = 0; i < op.length; i++) {
            itemsRequested[op[i]] += items[op[i]];
          }
          
          // console.log('hello', items);
          // console.log('This option work but needs more');
          
        } else {
          // console.log('Does not work');
          // this else was used for debugging purposes
        }
         
      }

    };
    // Initial start
    for(let location = 0; location<locations.length; location++) {
      recursionCheck(location,[]);
    }

    //Print results Testing Purposes
    // for (let i of results) {
    //   console.log(i);
    // }
    return results;
  }

}

