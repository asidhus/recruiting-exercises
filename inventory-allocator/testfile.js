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
 
 
 
 function calculatePossibleShipments(itemsRequested, warehouses) {
    // Grab keys for both objects
    var items = Object.keys(itemsRequested);
    var locations = Object.keys(warehouses);
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
    
    
    var checkOptions = (option, location) => {
      let myCopy = JSON.parse(JSON.stringify(itemsRequested));
      for(var i = 0; i < option.length; i++) {
        if( myCopy[option[i]] !== undefined && myCopy[option[i]] > 0){
          if ( (warehouses[locations[location]])[option[i]] >= myCopy[option[i]] || !(availability[option[i]][0]) ) {
            myCopy[option[i]] = myCopy[option[i]] - (warehouses[locations[location]])[option[i]];
          }
          else {
            return 0;
          }
        } else {
          return 0;
        }
      }
      for(let item of items) {
        if(myCopy[item] > 0) {
          return 1;
        }
      }
      return 2;
    };
    var addInto = (options, location) => {
      var obj={};
      var items = {};
      for (var i = 0; i < options.length; i++) {
        items[options[i]] = itemsRequested[options[i]];
      }
      obj[locations[location]] = items;
      console.log('hello', obj);
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
        console.log(itemsRequested)
        console.log(locations[location]);
        console.log(options[option]);
        var check = checkOptions(options[option], location);
        if(check === 2) {
          current.push(addInto(options[option], location, current));
          var temp = current.slice();
          results.push(temp);
          current.pop();
          console.log('Works');
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
          
          console.log('hello', items);
          console.log('This option work but needs more');
          
        } else {
          console.log('Does not work');
        }
         
      }

    };
    
    for(let location = 0; location<locations.length; location++) {
      recursionCheck(location,[]);
    }
    
    for (let i of results) {
      console.log(i);
    }
    return results.length;

  }
  calculatePossibleShipments({ apple: 5, banana: 5, orange: 5 }, { owd: { apple: 5, orange: 5 }, dm: { banana: 5, orange: 5, apple: 5} });