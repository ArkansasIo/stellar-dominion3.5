# System Linking and Balance Update

## Shared navigation integration

The shared game shell now presents an always-visible **Live System Route** on every recognized gameplay hub. Rather than relying solely on the left navigation or a collapsible page deck, each active page exposes a compact sequence of real routes that explains the next live dependency in its loop.

| Active section | Connected loop |
|---|---|
| Empire | Industry input → build capacity → research unlocks → force output |
| Research | Fund research → manage labs → plan prerequisites → apply unlocks |
| Military | Prepare forces → deploy fleet → strategic layer → review reports |
| Exploration | Survey space → launch expeditions → develop worlds → plan operations |
| Diplomacy | Coordinate → organize allies → assess standing → strategic social |
| Economy | Produce → trade → strategic exchange → reinvest |

All links target routes registered in the game router. The Empire Command Center shortcut that previously targeted `/starbases` now targets the implemented `/stations` system as **Station Control**.

## Strategic balance correction

A **Lifer** now provides the economic output of the ten Miners it converts: 800 Naquadah per 30-minute strategic turn. This aligns the Lifer’s cost, its persistent-asset role in Ascension, and its strategic market valuation. Lifers are now visibly trainable from Stargate Command, where the conversion rule and permanent-through-Ascension behavior are explained.

The deterministic resource verification asserts that five untrained personnel, three Miners, and two Lifers generate 1,940 Naquadah per strategic turn, and 2,425 under the Goa'uld income doctrine. The full route audit passed 115 route patterns with no failures. Production health remained 100 after deployment.

## Scope boundary

This update links and balances **implemented, server-authoritative** loops. Systems that currently only expose independent data or configuration remain clearly separated instead of being presented as mechanics they do not yet affect.
