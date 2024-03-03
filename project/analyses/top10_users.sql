select * from {{ ref("users") }} order by total_amount desc limit 10
