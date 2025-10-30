import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

type CategorySeed = {
  id: string;
  items: string[];
};

const CATEGORY_POOL: CategorySeed[] = [
  {
    id: "electronics",
    items: ["Laptop", "Bluetooth Speaker", "Tablet", "Desktop Monitor", "Headphones"],
  },
  {
    id: "furniture",
    items: ["Office Chair", "Bookshelf", "Coffee Table", "Lamp", "Storage Cabinet"],
  },
  {
    id: "clothing",
    items: ["Winter Coat", "Denim Jacket", "Sneakers", "Backpack", "Rain Boots"],
  },
  {
    id: "sports",
    items: ["Tennis Racket", "Basketball", "Yoga Mat", "Road Bike Helmet", "Football"],
  },
  {
    id: "books",
    items: ["Novel Set", "Cookbook", "Textbook", "Children's Story Collection", "Travel Guide"],
  },
  {
    id: "kitchen",
    items: ["Blender", "Cookware Set", "Air Fryer", "Stand Mixer", "Coffee Maker"],
  },
  {
    id: "toys",
    items: ["Building Blocks", "Board Game", "Puzzle Set", "RC Car", "Stuffed Animal"],
  },
  {
    id: "garden",
    items: ["Planter Box", "Garden Tools", "Watering Can", "Outdoor Bench", "Compost Bin"],
  },
  {
    id: "tools",
    items: ["Cordless Drill", "Hand Tool Set", "Circular Saw", "Ladder", "Toolbox"],
  },
  {
    id: "other",
    items: ["Pet Carrier", "Art Supplies Kit", "Musical Keyboard", "Luggage", "Projector"],
  },
];

const CONDITIONS = ["new", "like-new", "gently-used", "used", "well-worn"] as const;

const PLACEHOLDER_IMAGES = [
  "/banner_school.jpg",
  "/banner_tech.jpg",
  "/rackets.png",
  "/logo.svg",
  "/window.svg",
  "/globe.svg",
  "/file.svg",
];

const STREET_NAMES = [
  "Maple Avenue",
  "Oak Street",
  "Sunset Boulevard",
  "River Road",
  "Cedar Lane",
  "Pine Street",
  "Lakeview Drive",
  "Elm Street",
  "Willow Way",
  "Highland Avenue",
];

const CITY_NAMES = [
  "Brookfield",
  "Hillcrest",
  "Riverton",
  "Lakeside",
  "Cedar Falls",
  "Foxridge",
  "Mapleton",
  "Silverton",
  "Northwood",
  "Westfield",
];

const ADJECTIVES = [
  "Gently Used",
  "Solid",
  "Reliable",
  "Community",
  "Clean",
  "Sturdy",
  "Practical",
  "Cozy",
  "Compact",
  "Lightweight",
];

const SENTENCES = [
  "Great for someone who needs a quick replacement without cost.",
  "Stored indoors and ready for immediate pickup.",
  "We are decluttering and hope this finds a good home.",
  "First come, first served—please message before heading over.",
  "Minor cosmetic wear but fully functional.",
  "Includes the original accessories where applicable.",
  "Pickup near public transit and easy parking nearby.",
  "Happy to coordinate evening pickup times.",
];

const INSTRUCTIONS = [
  "Text 15 minutes before arrival.",
  "Ring the doorbell and ask for Alex.",
  "Pickup from the front porch—will be labeled.",
  "Call when you arrive and I'll bring it out.",
  "Please bring help for heavy lifting.",
  "Leave a note if you arrive early.",
];

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const pickOne = <T,>(items: readonly T[]): T =>
  items[randomInt(0, items.length - 1)];

const pickSome = <T,>(items: readonly T[], count: number): T[] => {
  const pool = [...items];
  const selection: T[] = [];
  const actualCount = Math.min(count, pool.length);

  for (let i = 0; i < actualCount; i++) {
    const index = randomInt(0, pool.length - 1);
    selection.push(pool.splice(index, 1)[0]);
  }

  return selection;
};

const generateTitle = (itemName: string) => `${pickOne(ADJECTIVES)} ${itemName}`;

const generateDescription = (title: string) => {
  const sentences = pickSome(SENTENCES, 3);
  return `${title} available for pickup. ${sentences.join(" ")}`;
};

const generateAddress = () => {
  const streetNumber = randomInt(100, 999);
  const street = pickOne(STREET_NAMES);
  const city = pickOne(CITY_NAMES);
  return `${streetNumber} ${street}, ${city}`;
};

const escapeSql = (value: string) => value.replace(/'/g, "''");

const sqlValue = (value: string | null) =>
  value === null ? "NULL" : `'${escapeSql(value)}'`;

const serializeJson = (value: unknown) => sqlValue(JSON.stringify(value));

const buildSqlScript = () => {
  const statements = [
    "PRAGMA foreign_keys = OFF;",
    "BEGIN TRANSACTION;",
    `CREATE TABLE IF NOT EXISTS "Listing" (
      "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      "title" text NOT NULL,
      "category" text NOT NULL,
      "condition" text NOT NULL,
      "description" text NOT NULL,
      "images" text DEFAULT '["/window.svg"]' NOT NULL,
      "pickupAddress" text NOT NULL,
      "pickupInstructions" text,
      "createdBy" integer
    );`,
    'DELETE FROM "Listing";',
  ];

  for (let index = 0; index < 100; index++) {
    const category = pickOne(CATEGORY_POOL);
    const itemName = pickOne(category.items);
    const title = generateTitle(itemName);
    const condition = pickOne(CONDITIONS);
    const description = generateDescription(title);
    const pickupAddress = generateAddress();
    const pickupInstructions = Math.random() < 0.6 ? pickOne(INSTRUCTIONS) : null;
    // Always include at least one image, defaulting to /window.svg
    const images = Math.random() < 0.85 ? [pickOne(PLACEHOLDER_IMAGES)] : ["/window.svg"];

    const insertValues = [
      sqlValue(title),
      sqlValue(category.id),
      sqlValue(condition),
      sqlValue(description),
      serializeJson(images),
      sqlValue(pickupAddress),
      sqlValue(pickupInstructions),
    ].join(", ");

    statements.push(
      `INSERT INTO "Listing" (
        "title",
        "category",
        "condition",
        "description",
        "images",
        "pickupAddress",
        "pickupInstructions"
      ) VALUES (${insertValues});`
    );
  }

  statements.push("COMMIT;");

  return statements.join("\n");
};

const runSqlite = (sqlScript: string) => {
  const dbPath = join(process.cwd(), "drizzle", "local.sqlite");
  if (!existsSync(dbPath)) {
    console.error(`Local SQLite database not found at ${dbPath}. Run migrations first.`);
    process.exit(1);
  }

  const result = spawnSync("sqlite3", [dbPath], {
    input: sqlScript,
    stdio: ["pipe", "inherit", "inherit"],
  });

  if (result.error) {
    console.error("Failed to execute sqlite3:", result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`sqlite3 exited with status ${result.status}.`);
    process.exit(result.status ?? 1);
  }

  console.log("Seeded 100 listings into drizzle/local.sqlite.");
};

const resolveWranglerBin = () => {
  const localBin = join(process.cwd(), "node_modules", ".bin", "wrangler");
  if (existsSync(localBin)) {
    return localBin;
  }
  return "wrangler";
};

const runD1 = (sqlScript: string) => {
  const dbName = process.env.D1_DATABASE_NAME ?? "cong-app-challenge-db";
  const wranglerBin = resolveWranglerBin();

  const result = spawnSync(
    wranglerBin,
    ["d1", "execute", dbName, "--command", sqlScript],
    {
      stdio: ["inherit", "inherit", "inherit"],
    }
  );

  if (result.error) {
    console.error("Failed to execute wrangler d1:", result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`wrangler d1 exited with status ${result.status}.`);
    process.exit(result.status ?? 1);
  }

  console.log(`Seeded 100 listings into D1 database "${dbName}".`);
};

const main = () => {
  const sqlScript = buildSqlScript();
  const args = process.argv.slice(2);
  const targetFlag = args.find((arg) => arg.startsWith("--target="));
  const target = targetFlag?.split("=")[1] ?? process.env.SEED_TARGET ?? "d1";

  if (target === "sqlite") {
    runSqlite(sqlScript);
    return;
  }

  runD1(sqlScript);
};

main();
