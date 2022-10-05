import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST,//NOTE: must be updated when docker ig ?
	port: 5432,
	username: "test",
	password: "test",
	database: "bde",
	synchronize: true,
	logging: false,
	entities: ["entity/*.ts"],
	migrations: [],
	subscribers: [],
})
