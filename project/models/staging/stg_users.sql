select id as user_id, * except (id), from {{ source("source", "users") }}
