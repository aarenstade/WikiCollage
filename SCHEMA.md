Categories of data.

# topics

id bigserial PRIMARY KEY,
topic varchar NOT NULL,
description varchar,
wikipedia_url varchar,
created_at timestamptz NOT NULL,
updated_at timestamptz NOT NULL,

# additions

id bigserial PRIMARY KEY,
topic_id bigint REFERENCES topics NOT NULL,
url varchar NOT NULL,
creator varchar NOT NULL,
description varchar,
created_at timestamptz,
