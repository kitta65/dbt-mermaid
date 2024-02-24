select id as product_id, * except (id), from {{ source("source", "products") }}
