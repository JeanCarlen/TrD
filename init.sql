-- Create the pong_data database
CREATE DATABASE pong_data;

-- Connect to the pong_data database
\c pong_data;

CREATE TABLE users (
	"id" serial NOT NULL,
	"login42" varchar(100) NULL,
	"username" varchar(100) NOT NULL,
	"twofaenabled" BOOLEAN NOT NULL DEFAULT false,
	"twofasecret" char(256) NULL,
	"avatar" varchar(256) NOT NULL DEFAULT '/path/to/default.png',
	"is42" boolean DEFAULT false,
	"password" varchar(72) NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

CREATE TABLE matches (
	"id" serial NOT NULL,
	"user_1" integer NOT NULL,
	"user_2" integer NOT NULL,
	"score_1" integer NOT NULL,
	"score_2" integer NOT NULL,
	"status" integer NOT NULL,
	CONSTRAINT "matches_pk" PRIMARY KEY ("id"),
	CONSTRAINT "matches_fk0" FOREIGN KEY ("user_1") REFERENCES "users"("id"),
	CONSTRAINT "matches_fk1" FOREIGN KEY ("user_2") REFERENCES "users"("id")
);

CREATE TABLE chats (
	"id" serial NOT NULL,
	"type" integer NOT NULL,
	"name" varchar(100) NULL,
	"owner" integer NOT NULL,
	"password" varchar(72) NULL,
	"protected" boolean NOT NULL DEFAULT false,
	CONSTRAINT "chats_pk" PRIMARY KEY ("id")
);
CREATE TABLE friends (
	"id" serial NOT NULL,
	"requester" integer NOT NULL,
	"requested" integer NOT NULL,
	"status" integer NOT NULL,
	CONSTRAINT "friends_pk" PRIMARY KEY ("id"),
	CONSTRAINT "friends_fk0" FOREIGN KEY ("requester") REFERENCES "users"("id"),
	CONSTRAINT "friends_fk1" FOREIGN KEY ("requested") REFERENCES "users"("id")
);

CREATE TABLE userchats (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	"chat_name" varchar(100) NOT NULL,
	"protected" boolean NOT NULL DEFAULT false,
	CONSTRAINT "userchats_pk" PRIMARY KEY ("id"),
	CONSTRAINT "userchats_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "userchats_fk1" FOREIGN KEY ("chat_id") REFERENCES "chats"("id")
);

CREATE TABLE messages (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	"text" TEXT NOT NULL,
	"created" timestamp NOT NULL DEFAULT NOW(),
	CONSTRAINT "messages_pk" PRIMARY KEY ("id"),
	CONSTRAINT "messages_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "messages_fk1" FOREIGN KEY ("chat_id") REFERENCES "chats"("id")
);

CREATE TABLE chatadmins (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	CONSTRAINT "chatadmin_pk" PRIMARY KEY ("id"),
	CONSTRAINT "chatadmin_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "chatadmin_fk1" FOREIGN KEY ("chat_id") REFERENCES "chats"("id")
);

CREATE TABLE mutedusers (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	"until" DATE NOT NULL,
	CONSTRAINT "mutedusers_pk" PRIMARY KEY ("id"),
	CONSTRAINT "mutedusers_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "mutedusers_fk1" FOREIGN KEY ("chat_id") REFERENCES "chats"("id")
);

CREATE TABLE bannedusers (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"chat_id" integer NOT NULL,
	"until" DATE,
	CONSTRAINT "banneduser_pk" PRIMARY KEY ("id"),
	CONSTRAINT "banneduser_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "banneduser_fk1" FOREIGN KEY ("chat_id") REFERENCES "chats"("id")
);

CREATE TABLE blockedusers (
	"id" serial NOT NULL,
	"blockinguser_id" integer NOT NULL,
	"blockeduser_id" integer NOT NULL,
	CONSTRAINT "blockedusers_pk" PRIMARY KEY ("id"),
	CONSTRAINT "blockedusers_fk0" FOREIGN KEY ("blockinguser_id") REFERENCES "users"("id"),
	CONSTRAINT "blockedusers_fk1" FOREIGN KEY ("blockeduser_id") REFERENCES "users"("id")
);

CREATE TABLE achievments (
	"id" serial NOT NULL,
	"title" varchar(32),
	"description" varchar(255),
	"objective" integer,
	CONSTRAINT "achievments_pk" PRIMARY KEY ("id")
);

-- INSERT INTO achievments(title, description, objective) VALUES('First Match', 'Play your first match', 1), ('NIKKI', 'you found Nikki', 1), ('SIMON', 'Simon added new features', 5), ('JEAN', 'Jean broke the CSS again', 2) RETURNING *;

CREATE TABLE user_achievments (
	"id" serial NOT NULL,
	"current" integer,
	"user_id" integer NOT NULL,
	"achievment_id" integer NOT NULL,
	CONSTRAINT "achievments_id" PRIMARY KEY ("id"),
	CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id"),
	CONSTRAINT "achievment_fk" FOREIGN KEY ("achievment_id") REFERENCES "achievments"("id")
);

COPY achievments(id, title, description, objective)
FROM '/docker-entrypoint-initdb.d/achievments.csv'
DELIMITER ','
CSV HEADER;
