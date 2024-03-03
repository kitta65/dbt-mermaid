select id
from {{ source("source", "users") }}
where id not like '........-....-....-....-............'
