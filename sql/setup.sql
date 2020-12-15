DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[]
);

-- CREATE TABLE logs (
--   id BIGINT GENERATED ALWAYS AS IDENTITY,
--   recipeId ,
--   dateOfEvent ,

-- )
