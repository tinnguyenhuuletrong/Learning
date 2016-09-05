var DB = require("./models/index.js")
const User = DB["User"]
const Todo = DB["Todo"]

DB.sequelize
	.authenticate()
	.then(function(err) {
		console.log('Connection has been established successfully.');

		//create Fake Data
		// User.create({
		// 	"email": "email2@abc.com"
		// }).then( model => {
		// 	console.log(model)
		// })

		User.findOne({
			where: {
				email: 'email2@abc.com'
			}
		}).then(obj => {
			console.log(obj.toJSON())

			// Todo.create({
			// 	title: "task2"
			// }).then((item) => {
			// 	obj.addTodo(item).then(console.log)
			// })

			// obj.getTodos({}).then(datas => {
			// 	console.log(JSON.stringify(datas))
			// })

			// Todo.findById(7).then(data => {
			// 	console.log(data.toJSON())
			// 	data.getUser().then(usr => {
			// 		console.log(usr)
			// 	})
			// })

		})

	})
	.catch(function(err) {
		console.log('Unable to connect to the database:', err);
	});