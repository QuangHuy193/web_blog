import mysql from "mysql2/promise";

export async function query<T>(
  sql: string,
  values: unknown[] = []
): Promise<T> {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "blog_app",
  });

  try {
    const [results] = await db.execute(sql, values);
    return results as T;
  } finally {
    await db.end();
  }
}
