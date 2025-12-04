ALTER TABLE user_data
ADD COLUMN nugs integer;

CREATE INDEX ON user_data (nugs);
