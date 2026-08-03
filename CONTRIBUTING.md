# Contributing

The most useful contribution is a new device: one JSON file describing an
instrument's CC and NRPN parameters.

## Adding a device

1. Create `devices/<manufacturer>-<model>.json`, kebab-case, for example
   `korg-volca-fm.json`.
2. Fill it in using the format below.
3. Run `npm run manifest` to add it to `devices/index.json`. The app discovers
   devices through that manifest, because a static host can't list a directory.
4. Add a line under `## [Unreleased]` in `CHANGELOG.md`.
5. Run `npm run lint` and open a pull request. It runs in CI and must pass - it
   validates device files against `devices/schema.json` and fails if the
   manifest is out of date.

## Device format

```json
{
  "name": "Volca FM",
  "manufacturer": "Korg",
  "schemaVersion": 1,
  "parameters": [
    {
      "name": "LFO rate",
      "type": "cc",
      "number": 46,
      "min": 0,
      "max": 127,
      "enabled": true
    }
  ]
}
```

- `type` is `"cc"` (number and values 0-127) or `"nrpn"` (14-bit, 0-16383).
- `min` and `max` bound what Randomise sends, so they can be narrower than the
  full range.
- `enabled` is whether the parameter is randomised by default.

## Releases

Move the `## [Unreleased]` entries under a new version heading, then
`npm version <major|minor|patch>` and `git push --follow-tags`.
