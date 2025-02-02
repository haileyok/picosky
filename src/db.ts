import SqliteDb from "better-sqlite3";
import {
  Kysely,
  Migrator,
  SqliteDialect,
  Migration,
  MigrationProvider,
} from "kysely";

// Types

export type DatabaseSchema = {
  posts: Post;
  identities: Identity;
};

export type Post = {
  uri: string;
  post: string;
  handle: string;
  indexedAt: number;
};

export type Identity = {
  did: string;
  handle: string;
};

// Migrations

const migrations: Record<string, Migration> = {};

const migrationProvider: MigrationProvider = {
  async getMigrations() {
    return migrations;
  },
};

migrations["001"] = {
  async up(db: Kysely<unknown>) {
    await db.schema
      .createTable("posts")
      .addColumn("uri", "text", (col) => col.primaryKey())
      .addColumn("post", "text", (col) => col.notNull())
      .addColumn("handle", "text")
      .addColumn("indexedAt", "integer", (col) => col.notNull())
      .execute();

    await db.schema
      .createTable("identities")
      .addColumn("did", "text", (col) => col.primaryKey())
      .addColumn("handle", "text", (col) => col.notNull())
      .execute();
  },
  async down(db: Kysely<unknown>) {
    await db.schema.dropTable("posts").execute();
  },
};

// APIs

export const createDb = (location: string): Database => {
  return new Kysely<DatabaseSchema>({
    dialect: new SqliteDialect({
      database: new SqliteDb(location),
    }),
  });
};

export const migrateToLatest = async (db: Database) => {
  const migrator = new Migrator({ db, provider: migrationProvider });
  const { error } = await migrator.migrateToLatest();
  if (error) throw error;
};

export type Database = Kysely<DatabaseSchema>;
