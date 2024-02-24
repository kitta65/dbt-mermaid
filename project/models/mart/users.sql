with
    users as (select * from {{ ref("stg_users") }}),

    orders as (select * from {{ ref("stg_orders") }}),

    final as (
        select
            users.user_id,
            sum(orders.amount) as total_amount,
            min(orders.ordered_at) as min_orderd_at
        from users
        left join orders on user.user_id = orders.user_id
        group by 1
    )

select *
from final
