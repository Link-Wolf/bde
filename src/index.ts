import { AppDataSource } from "./data-source"
import { Stud } from "./entity/Stud"

AppDataSource.initialize().then(async () => {
}).catch(error => console.log(error))
