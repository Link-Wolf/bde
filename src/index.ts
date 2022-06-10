import { AppDataSource } from "./data-source"
import { Stud } from "./entity/Stud"

AppDataSource.initialize().then(async () => {

	console.log("Inserting a new user into the database...")
	const user = new Stud()
	user.firstname = "Timber"
	user.lastname = "Saw"
	await AppDataSource.manager.save(user)
	console.log("Saved a new user with id: " + user.login)

	console.log("Loading users from the database...")
	const users = await AppDataSource.manager.find(Stud)
	console.log("Loaded users: ", users)

	console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
