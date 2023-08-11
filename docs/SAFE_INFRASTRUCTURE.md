
# Safe wallet

Before going to run the safe wallet, we need the transaction
service.
Simply think about it as a UI.

We have the infrastructure as a submodule:
`safe-infrastructure`.

* [Install locally](https://github.com/safe-global/safe-infrastructure/blob/main/docs/running_locally.md) &ndash; install Safe Services locally using docker.
* [Getting Started](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md) &ndash; start to work with Safe SDK.
* [Official supported services](https://docs.safe.global/safe-core-api/available-services) &ndash; **it doesn't have sepolia, that's why we run ourselves**


> **Windows users**
> If all the scripts are running in the WSl, the docker services
> may be running directly from Windows OS.

> Don't forget to update `next-tutorial/.env.local` with
> the values in `hello/.env`

