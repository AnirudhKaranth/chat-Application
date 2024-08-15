import { db } from "./drizzle.config.js"

import { migrate } from "drizzle-orm/postgres-js/migrator";

await migrate(db, { migrationsFolder: "db/migrations" })
    .then(() => {
        console.log('Migrations completed!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('Migrations failed!', err)
        process.exit(1)
    })