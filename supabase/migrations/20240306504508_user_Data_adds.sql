ALTER TABLE user_data
ADD COLUMN referral_group integer,
ADD COLUMN referral_pos integer,
ADD COLUMN operating_system text,
ADD COLUMN browser text,
ADD COLUMN category text,
ADD COLUMN screen_resolution text,
ADD COLUMN city text,
ADD COLUMN country_id text,
ADD COLUMN region_id text;

CREATE INDEX ON user_data (referral_group);
CREATE INDEX ON user_data (referral_pos);
		