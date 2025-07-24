---
id: outputs-data
title: "outputs_data"
---

# outputs_data

`outputs_data` is a list containing the data for each output Cell. The data for the i-th Cell in `outputs` is stored as the i-th item in `outputs_data`.

Separating `outputs_data` from `outputs` simplifies Script execution in [CKB-VM](/docs/tech-explanation/ckb-vm) and enables future optimizations at the protocol level.
