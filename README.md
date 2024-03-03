# [WIP] DBT Mermaid

This action draws lineage graph of your dbt project as [mermaid](https://mermaid.js.org/) flowchart.

```mermaid
flowchart LR
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5ldmVudHM("source.events");
  style c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5ldmVudHM color:white,stroke:black,fill:green,stroke-width:0px;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS51c2Vycw("source.users");
  style c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS51c2Vycw color:white,stroke:black,fill:green,stroke-width:0px;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5vcmRlcnM("source.orders");
  style c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5vcmRlcnM color:white,stroke:black,fill:green,stroke-width:0px;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5wcm9kdWN0cw("source.products");
  style c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5wcm9kdWN0cw color:white,stroke:black,fill:green,stroke-width:0px;
  bW9kZWwuZGJ0X21lcm1haWQudXNlcnM("users");
  style bW9kZWwuZGJ0X21lcm1haWQudXNlcnM color:white,stroke:black,fill:blue,stroke-width:0px;
  bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnNfdjI("sessions_v2");
  style bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnNfdjI color:white,stroke:black,fill:blue,stroke-width:4px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX2V2ZW50cw("stg_events");
  style bW9kZWwuZGJ0X21lcm1haWQuc3RnX2V2ZW50cw color:white,stroke:black,fill:blue,stroke-width:0px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX29yZGVycw("stg_orders");
  style bW9kZWwuZGJ0X21lcm1haWQuc3RnX29yZGVycw color:white,stroke:black,fill:blue,stroke-width:0px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX3VzZXJz("stg_users");
  style bW9kZWwuZGJ0X21lcm1haWQuc3RnX3VzZXJz color:white,stroke:black,fill:blue,stroke-width:0px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX3Byb2R1Y3Rz("stg_products");
  style bW9kZWwuZGJ0X21lcm1haWQuc3RnX3Byb2R1Y3Rz color:white,stroke:black,fill:blue,stroke-width:0px;
  c25hcHNob3QuZGJ0X21lcm1haWQucHJvZHVjdHNfc25hcHNob3Q("products_snapshot");
  style c25hcHNob3QuZGJ0X21lcm1haWQucHJvZHVjdHNfc25hcHNob3Q color:white,stroke:black,fill:blue,stroke-width:0px;
  YW5hbHlzaXMuZGJ0X21lcm1haWQudG9wMTBfdXNlcnM("top10_users");
  style YW5hbHlzaXMuZGJ0X21lcm1haWQudG9wMTBfdXNlcnM color:white,stroke:black,fill:blue,stroke-width:0px;
  dGVzdC5kYnRfbWVybWFpZC5hc3NlcnRfdXNlcl9pZF9pc191dWlk("assert_user_id_is_uuid");
  style dGVzdC5kYnRfbWVybWFpZC5hc3NlcnRfdXNlcl9pZF9pc191dWlk color:white,stroke:black,fill:blue,stroke-width:0px;
  c2VlZC5kYnRfbWVybWFpZC5pbnRlcm5hbF91c2Vycw("internal_users");
  style c2VlZC5kYnRfbWVybWFpZC5pbnRlcm5hbF91c2Vycw color:white,stroke:black,fill:blue,stroke-width:0px;
  ZXhwb3N1cmUuZGJ0X21lcm1haWQudXNlcl9hbmFseXNpcw("user_analysis");
  style ZXhwb3N1cmUuZGJ0X21lcm1haWQudXNlcl9hbmFseXNpcw color:white,stroke:black,fill:orange,stroke-width:0px;
  ZXhwb3N1cmUuZGJ0X21lcm1haWQuc2Vzc2lvbl9hbmFseXNpcw("session_analysis");
  style ZXhwb3N1cmUuZGJ0X21lcm1haWQuc2Vzc2lvbl9hbmFseXNpcw color:white,stroke:black,fill:orange,stroke-width:0px;
  bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnM("sessions");
  style bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnM color:white,stroke:black,fill:blue,stroke-width:4px,stroke-dasharray: 5 5;
  bW9kZWwuZGJ0X21lcm1haWQudXNlcnM --> YW5hbHlzaXMuZGJ0X21lcm1haWQudG9wMTBfdXNlcnM;
  bW9kZWwuZGJ0X21lcm1haWQudXNlcnM --> ZXhwb3N1cmUuZGJ0X21lcm1haWQudXNlcl9hbmFseXNpcw;
  bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnNfdjI --> ZXhwb3N1cmUuZGJ0X21lcm1haWQuc2Vzc2lvbl9hbmFseXNpcw;
  linkStyle 2 stroke-width:4px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX2V2ZW50cw --> bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnNfdjI;
  linkStyle 3 stroke-width:4px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX29yZGVycw --> bW9kZWwuZGJ0X21lcm1haWQudXNlcnM;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX3VzZXJz --> bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnNfdjI;
  linkStyle 5 stroke-width:4px;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX3VzZXJz --> bW9kZWwuZGJ0X21lcm1haWQudXNlcnM;
  c2VlZC5kYnRfbWVybWFpZC5pbnRlcm5hbF91c2Vycw --> bW9kZWwuZGJ0X21lcm1haWQuc3RnX3VzZXJz;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5ldmVudHM --> bW9kZWwuZGJ0X21lcm1haWQuc3RnX2V2ZW50cw;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS51c2Vycw --> bW9kZWwuZGJ0X21lcm1haWQuc3RnX3VzZXJz;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS51c2Vycw --> dGVzdC5kYnRfbWVybWFpZC5hc3NlcnRfdXNlcl9pZF9pc191dWlk;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5vcmRlcnM --> bW9kZWwuZGJ0X21lcm1haWQuc3RnX29yZGVycw;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5wcm9kdWN0cw --> bW9kZWwuZGJ0X21lcm1haWQuc3RnX3Byb2R1Y3Rz;
  c291cmNlLmRidF9tZXJtYWlkLnNvdXJjZS5wcm9kdWN0cw --> c25hcHNob3QuZGJ0X21lcm1haWQucHJvZHVjdHNfc25hcHNob3Q;
  bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnM -.-> ZXhwb3N1cmUuZGJ0X21lcm1haWQuc2Vzc2lvbl9hbmFseXNpcw;
  bW9kZWwuZGJ0X21lcm1haWQuc3RnX2V2ZW50cw -.-> bW9kZWwuZGJ0X21lcm1haWQuc2Vzc2lvbnM;
```

## Usage

See [action.yml](action.yml) for details.

## Examples

- Save entire lineage graph as artifacts on push ([yml](.github/workflows/demo_on_push.yml)).

- Visualize modified models and its parents/children on pull requests ([yml](.github/workflows/demo_on_pull_request.yml)).

## Feedback

If you find any bugs, please feel free to create an issue.
