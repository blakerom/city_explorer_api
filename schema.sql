DROP TABLE IF EXISTS people;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);
