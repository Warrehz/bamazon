// necessary dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');
var connection = mysql.createConnection({

  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'ohyeahmysql1!',
  database: 'bamazon'

});

// establish connection
connection.connect(function (err, res) {

  if (err) throw err;

  console.log('Connection established...\n');

});

// display inventory to console
var showInventory = function() {

  connection.query('SELECT * FROM Product_Selection', function(err, res) {

    if (err) throw err;

    for (i = 0; i < res.length; i++) {

      console.log('id: ' + res[i].id + ' | Product Name: ' + res[i].ProductName + ' | Price: ' + res[i].Price + '\n--------------------------------------------------------------------------------');

    }

  // calls the ask_buy function to prompt the user and sends in res to use for updating inventory
    ask_buy(res);

  });

}


var ask_buy = function(res) {

  // prompt user for what they would like to buy and the quantity
  inquirer.prompt([{

    name: 'buy_id',
    type: 'input',
    message: 'Select the (id) of the item you\'d like to buy.'

  }, {

    name:'quantity',
    type: 'input',
    message: 'How many would you like to buy?'

  }])

  .then(function(answers) {

    var item_id = answers.buy_id - 1;
    var quantity = answers.quantity;

    // check if the stockquanity in database has enough for purchase quantity
    if (res[item_id].StockQuantity - quantity > 0) {

      // query the database and update the appropriate product StockQuantity
      connection.query("UPDATE Product_Selection SET StockQuantity='" + (res[item_id].StockQuantity - quantity) + "' WHERE id='" + (item_id + 1) + "'", function(err, res2) {

        if (err) throw err;

        console.log('All right! Great job on your puchase of ' + res[item_id].ProductName + '!' + '\n');

        console.log('Your total cost is: $' + (res[item_id].Price * quantity) + '\n');

        showInventory();

      });

    } else {

      console.log('I\'m sorry, there does not seem to be enough inventory of that item to make that purchase.' + '\n');

      showInventory();

    }

  });

}

showInventory();
