import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid().primaryKey().notNull(),
  email: text().notNull(),
  fullName: text(),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  createdAt: timestamp().notNull(),
  title: text().notNull(),
  userId: uuid()
    .notNull()
    .references(() => user.id),
  visibility: text({ enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid().primaryKey().notNull().defaultRandom(),
  chatId: uuid()
    .notNull()
    .references(() => chat.id),
  role: text().notNull(),
  content: json().notNull(),
  createdAt: timestamp().notNull(),
});

export type Message = InferSelectModel<typeof message>;

export const vote = pgTable(
  "Vote",
  {
    chatId: uuid()
      .notNull()
      .references(() => chat.id),
    messageId: uuid()
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid().notNull().defaultRandom(),
    createdAt: timestamp().notNull(),
    title: text().notNull(),
    content: text(),
    userId: uuid()
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid().notNull().defaultRandom(),
    documentId: uuid().notNull(),
    documentCreatedAt: timestamp().notNull(),
    originalText: text().notNull(),
    suggestedText: text().notNull(),
    description: text(),
    isResolved: boolean().notNull().default(false),
    userId: uuid()
      .notNull()
      .references(() => user.id),
    createdAt: timestamp().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;
