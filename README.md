# dbt-mermaid

This action draws lineage graph of your dbt project as [mermaid](https://mermaid.js.org/) flowchart.

```mermaid
flowchart LR
  classDef greenNormal color:white,stroke:black,fill:green,stroke-width:0px;
  classDef greenBold color:white,stroke:black,fill:green,stroke-width:4px;
  classDef greenDash color:white,stroke:black,fill:green,stroke-width:4px,stroke-dasharray: 5 5;
  classDef blueNormal color:white,stroke:black,fill:blue,stroke-width:0px;
  classDef blueBold color:white,stroke:black,fill:blue,stroke-width:4px;
  classDef blueDash color:white,stroke:black,fill:blue,stroke-width:4px,stroke-dasharray: 5 5;
  classDef orangeNormal color:white,stroke:black,fill:orange,stroke-width:0px;
  classDef orangeBold color:white,stroke:black,fill:orange,stroke-width:4px;
  classDef orangeDash color:white,stroke:black,fill:orange,stroke-width:4px,stroke-dasharray: 5 5;
  source.dbt_mermaid.source.events("source.events"):::greenNormal;
  source.dbt_mermaid.source.users("source.users"):::greenNormal;
  source.dbt_mermaid.source.orders("source.orders"):::greenNormal;
  source.dbt_mermaid.source.products("source.products"):::greenNormal;
  model.dbt_mermaid.users("users"):::blueNormal;
  model.dbt_mermaid.sessions_v2("sessions_v2"):::blueBold;
  model.dbt_mermaid.stg_events("stg_events"):::blueNormal;
  model.dbt_mermaid.stg_orders("stg_orders"):::blueNormal;
  model.dbt_mermaid.stg_users("stg_users"):::blueNormal;
  model.dbt_mermaid.stg_products("stg_products"):::blueNormal;
  snapshot.dbt_mermaid.products_snapshot("products_snapshot"):::blueNormal;
  analysis.dbt_mermaid.top10_users("top10_users"):::blueNormal;
  test.dbt_mermaid.assert_user_id_is_uuid("assert_user_id_is_uuid"):::blueNormal;
  seed.dbt_mermaid.internal_users("internal_users"):::blueNormal;
  exposure.dbt_mermaid.user_analysis("user_analysis"):::orangeNormal;
  exposure.dbt_mermaid.session_analysis("session_analysis"):::orangeNormal;
  model.dbt_mermaid.sessions("sessions"):::blueDash;
  model.dbt_mermaid.users --> analysis.dbt_mermaid.top10_users;
  model.dbt_mermaid.users --> exposure.dbt_mermaid.user_analysis;
  model.dbt_mermaid.sessions_v2 ==> exposure.dbt_mermaid.session_analysis;
  model.dbt_mermaid.stg_events ==> model.dbt_mermaid.sessions_v2;
  model.dbt_mermaid.stg_orders --> model.dbt_mermaid.users;
  model.dbt_mermaid.stg_users ==> model.dbt_mermaid.sessions_v2;
  model.dbt_mermaid.stg_users --> model.dbt_mermaid.users;
  seed.dbt_mermaid.internal_users --> model.dbt_mermaid.stg_users;
  source.dbt_mermaid.source.events --> model.dbt_mermaid.stg_events;
  source.dbt_mermaid.source.users --> model.dbt_mermaid.stg_users;
  source.dbt_mermaid.source.users --> test.dbt_mermaid.assert_user_id_is_uuid;
  source.dbt_mermaid.source.orders --> model.dbt_mermaid.stg_orders;
  source.dbt_mermaid.source.products --> model.dbt_mermaid.stg_products;
  source.dbt_mermaid.source.products --> snapshot.dbt_mermaid.products_snapshot;
  model.dbt_mermaid.sessions -.-> exposure.dbt_mermaid.session_analysis;
  model.dbt_mermaid.stg_events -.-> model.dbt_mermaid.sessions;
```

## Usage

See [action.yml](action.yml) for details.

## Examples

- Save entire lineage graph as artifacts on push ([yml](.github/workflows/demo_on_push.yml)).

- Visualize modified models and its parents/children on pull requests ([yml](.github/workflows/demo_on_pull_request.yml)).

## Feedback

If you find any bugs, please feel free to create an issue.
