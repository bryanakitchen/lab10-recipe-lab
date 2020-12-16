DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients jsonb NOT NULL
);

CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_of_event INTEGER NOT NULL,
  notes TEXT NOT NULL,
  rating INTEGER NOT NULL,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id)
);
