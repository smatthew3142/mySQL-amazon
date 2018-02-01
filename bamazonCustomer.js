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

function start() {

	connection.query('SELECT * FROM products', function(err, res){
	  if(err) throw err;

	  console.log("*******-Bamazon-*******");
	  console.log(" ");

	  for(var i = 0; i < res.length; i++){
	    console.log("#" + res[i].id + " : "   + " | " + "Item: " + res[i].item_name + " | " + "Department: " + res[i].department + " | " + "Price: " + (res[i].price.toFixed(2)) + " | " + "QTY: " + res[i].stock);
	    console.log(" ");
	  }

	  console.log(" ");
	  inquirer
	    .prompt([ 

	    { name: "itemId",
	      type: "input",
	      message: "Input the ID# of the item you wish to purchase.",
	      validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
	    },

	    { 	name: "quantity",
	    	type: "input",
	    	message: "How many units of this product would you like to purchase?",
	    	validate: function(value) {
	          if (isNaN(value) === false) {
	            return true;
	          }
	          return false;
	        }
		}
      
    ])
    
    .then(function(answer) {
    var userItem = (answer.itemId) - 1;
    var userQuantity = parseInt(answer.quantity);
    var totalPurchase = (res[userItem].price)*userQuantity;


    if(res[userItem].stock >= userQuantity){
        
        connection.query("UPDATE products SET ? WHERE ?", [
        
        {stock: (res[userItem].stock - userQuantity)},
        {id: answer.itemId}

        ], 

        function(err, res){
            
            if(err) throw err;
            console.log("**************");
            console.log(" ");
            console.log("You are purchasing: ");
        	console.log(userQuantity + " | " + res[userItem].item_name );
        	console.log("Your total is $" + totalPurchase.toFixed(2));
        	console.log(" ");
        	console.log("**************");
            shopAgain();
        });

        

      } 

      else {

      	console.log("**************");
      	console.log(" ");
        console.log("NOT ENOUGH IN STOCK");
        console.log(" ");
        console.log("**************");

        shopAgain();
      }

      

    });
});

	function shopAgain(){

	  inquirer.prompt([{
	    
	    type: "confirm",
	    name: "restart",
	    message: "Would you like to keep shopping?"

	  }])

	  .then(function(answer){
	    
	    if(answer.restart){
	      
	      start();

	    } 

	    else {
	    	console.log(" ");
	      	console.log("Goodbye!");
	      	console.log(" ");
	      	connection.end();

	    }
	});

	  // start();
	};
};

