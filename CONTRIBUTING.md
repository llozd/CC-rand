# Contributing

The most useful contribution is a new device: one JSON file describing an
instrument's CC and NRPN parameters.

## Adding a device

1. Create `devices/<manufacturer>-<model>.json`, kebab-case, for example
   `korg-volca-fm.json`.
2. Fill it in using the format below.
3. Run `npm run manifest` to add it to `devices/index.json`. The app discovers
   devices through that manifest, because a static host can't list a directory.
4. Run `npm run lint` and open a pull request.

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

- `type` is `"cc"` or `"nrpn"`.
- CC parameters take a number and values in 0-127.
- NRPN parameters are 14-bit: number and values in 0-16383.
- `min` and `max` bound what Randomise will send, so they can be narrower than
  the full range where the extremes aren't musically useful.
- `enabled` is whether the parameter is randomised by default. Anything that
  changes pitch or note behaviour is usually better left `false`.

The full schema is `devices/schema.json`.

## Getting the numbers right

Use the MIDI implementation chart in the instrument's manual where you can.
Third-party listings are convenient but do contain errors - the published Volca
FM chart lists CC 48 twice and omits CC 49 - so prefer the manufacturer's own
documentation, and say in the pull request where the numbers came from.

Don't guess a number to fill a gap. A parameter left out is easy to add later;
a wrong one sends the wrong message to somebody's hardware.

## What CI checks

`npm run lint` runs on every pull request and must pass. It checks JS, CSS, JSON
formatting and HTML, and validates every device file against the schema. It also
fails if `devices/index.json` and the contents of `devices/` disagree, which
usually means `npm run manifest` wasn't run.
