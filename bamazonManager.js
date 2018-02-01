var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  
  user: "root",

  
  password: "",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  
  start();
});

function start(){

	inquirer.prompt([

    {
      name: "managerPrompt",
      type: "list",
      message: "Manager Options",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
      
    }

  ])

  .then(function(res){

  	switch (res.managerPrompt) {

	  case "View Products for Sale":
	    viewProducts();
	    break;

	  case "View Low Inventory":
	    viewLow();
	    break;

	  case "Add to Inventory":
	    addInventory();
	    break;

	  case "Add New Product":
	    addProduct();
	    break;

	    case "Exit":
	    end();
	    break;
	}

  })
}

function viewProducts(){

	connection.query('SELECT * FROM products', function(err, res){
		  if(err) throw err;
		console.log(" ");  
		console.log("**************");
		console.log(" ");
		console.log("PRODUCT LIST");
		console.log(" ");

		  for(var i = 0; i < res.length; i++){
		    console.log("#" + res[i].id + " : "   + " | " + "Item: " + res[i].item_name + " | " + "Department: " + res[i].department + " | " + "Price: " + (res[i].price.toFixed(2)) + " | " + "QTY: " + res[i].stock);
		    console.log(" ");
		  }

		  console.log(" ");
		  console.log("**************");
		  start();
	})

	  
}

function viewLow(){

	connection.query('SELECT * FROM products', function(err, res){
		  if(err) throw err;
		
		console.log(" ");
		console.log("**************");
		console.log(" ");
		console.log("PRODUCTS LOW IN STOCK");
		console.log(" ");

		  for(var i = 0; i < res.length; i++){
		  	if (res[i].stock <= 15 ) {
		    console.log("#" + res[i].id + " : "   + " | " + "Item: " + res[i].item_name + " | " + "QTY: " + res[i].stock);
		    console.log(" ");
		  }
		}

		console.log(" ");
		console.log("**************");
		start();
	})

}

function addInventory(){

	connection.query('SELECT * FROM products', function(err, res){
		  
		  if(err) throw err;
		  
		  var productList = [];

		  for(var i = 0; i < res.length; i++) {

		  	productList.push(res[i].item_name);
		  }

		  inquirer.prompt([

		    {
				name: "itemToReplenish",
				type: "list",
				message: "Which item would you like to replenish?",
				choices: productList
		    },

		    {
		    	name: "units",
		    	type: "input",
		    	message: "How many units?",
		    	validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }

		    }]).then(function(promptRes){

		    	var stockNow;

		    	for (var i = 0; i < res.length; i++) {

		    		if (res[i].item_name === promptRes.itemToReplenish){

		    			stockNow = res[i].stock;
		    			
		    		}
		    	}

		    	connection.query("UPDATE products SET ? WHERE ?", [
        
        			{stock: stockNow + parseInt(promptRes.units)},
        			{item_name: promptRes.itemToReplenish}

        		], function(err, res){

        			if(err) throw err;
        			console.log(" ");
        			console.log("******* UPDATE *******");
        			console.log(" ");
        			console.log(promptRes.itemToReplenish + " | " + (stockNow + parseInt(promptRes.units)));
        			console.log("**************");
        			start();
        		})
		    })
		})	

}

function addProduct(){

	var departmentList = [];

	connection.query("SELECT * FROM departmentTable", function(err, res){

		if(err) throw err;
		for(var i = 0; i < res.length; i++){

			departmentList.push(res[i].dept_name);
		}

	})

	inquirer.prompt([

		    {
				name: "newItem",
				type: "input",
				message: "NEW ITEM:",
				validate: function(value) {
		          if (value) {
		            return true;
		          }
		          return false;
		        }
		    },

		    {
				name: "newDepartment",
				type: "list",
				message: "DEPARTMENT:",
				choices: departmentList
				
		    },

		    {
		    	name: "newPrice",
		    	type: "input",
		    	message: "PRICE:",
		    	validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }
		    },

		    {

		    	name: "newStock",
		    	type: "input",
		    	message: "QTY:",
		    	validate: function(value) {
		          if (isNaN(value) === false) {
		            return true;
		          }
		          return false;
		        }

		    }]).then(function(promptRes) {

		    	connection.query("INSERT INTO products SET ?",
		    	{ 
		    		item_name: promptRes.newItem,
		    		department: promptRes.newDepartment,
		    		price: promptRes.newPrice,
		    		stock: promptRes.newStock
		    	},

		    	function(err, res){

		    		if(err) throw err;
		    		console.log(" ");
		    		console.log("******* UPDATE *******");
        			console.log(" ");
        			console.log("NEW ITEM ADDED");
        			console.log(" ");
        			console.log("**************");
        			start();
		    	})

		    })

}

function end(){

	connection.end();

}