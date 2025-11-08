import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const getRandomId = () => {
	return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(6))))
		.replace(/[+/=]/g, '');
}

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.default(false)
		.notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp_ms",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp_ms",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const organization = sqliteTable("organization", {
	id: text("id")
		.primaryKey()
		.$defaultFn(getRandomId),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	tagline: text("tagline"),
	description: text("description"),
	logo: text("logo", { mode: "json" }).$type<{ name: string; type: string; url: string }>(),
	primaryColor: text("primary_color"),
	primaryFont: text("primary_font"),
	secondaryFont: text("secondary_font"),
	designInstructions: text("design_instructions"),
});

export const photocard = sqliteTable("photocard", {
	id: text("id")
		.primaryKey()
		.$defaultFn(getRandomId),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	html: text("html").notNull(),
	url: text("url").notNull(),
	height: integer("height").notNull(),
	width: integer("width").notNull(),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),

})

export const schedule = sqliteTable("schedule", {
	id: text("id")
		.primaryKey()
		.$defaultFn(getRandomId),
	timestamp: text("timestamp").notNull(),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})

export const post = sqliteTable("post", {
	id: text("id")
		.primaryKey()
		.$defaultFn(getRandomId),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),

	caption: text("caption"),
	photocardId: text("photocard_id").references(() => photocard.id, { onDelete: "set null" }),
	scheduleId: text("schedule_id").references(() => schedule.id, { onDelete: "cascade" }),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text("updated_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})

export const integration = sqliteTable("integration", {
	id: text("id")
		.primaryKey()
		.$defaultFn(getRandomId),
	organizationId: text("organization_id")
		.notNull()
		.references(() => organization.id, { onDelete: "cascade" }),
	facebookPageId: text("facebook_page_id"),
	facebookAPIKey: text("facebook_api_key"),
	createdAt: text("created_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: text("updated_at")
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
})
