DROP TABLE IF EXISTS drinks;

CREATE TABLE IF NOT EXISTS drinks (
    id serial PRIMARY KEY,
    strDrink VARCHAR(255),
    strDrinkThumb VARCHAR(255),
    comment VARCHAR(255)
);