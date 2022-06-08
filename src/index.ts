import { AppDataSource } from "./data-source"
import { Stud } from "./entity/Stud"

AppDataSource.initialize().then(async () => {

	console.log("Inserting a new stud into the database...")
	const stud = new Stud()
	stud.firstname = "Timber"
	stud.lastname = "Saw"
	await AppDataSource.manager.save(stud)
	console.log("Saved a new stud with id: " + stud.login)

	console.log("Loading studs from the database...")
	const studs = await AppDataSource.manager.find(Stud)
	console.log("Loaded studs: ", studs)

	console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
