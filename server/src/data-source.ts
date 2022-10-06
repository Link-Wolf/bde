import "reflect-metadata"
import { DataSource } from "typeorm"

const { host } = require('../config.json')


export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.PWD === "/server/app" ? host.docker.postgres : host.local.postgres,
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
