# CC-rand

A small web application for sending random CC and NRPN values to MIDI devices.

You define "devices" - named sets of MIDI parameters (CC or NRPN, each with a
number and a value range) - pick a MIDI output and channel, and hit **Randomise**
to send a fresh random value to every enabled parameter.

## Requirements

- A Chromium-based browser (Chrome, Edge). MIDI output uses the Web MIDI API,
  which is not available in Firefox or Safari.

## Running locally

The app is plain static files with no build step. Serve the folder over HTTP and
open it in Chrome/Edge:

```bash
npx serve
# or
python3 -m http.server
```

Opening `index.html` directly from disk (`file://`) will not work, because the
app fetches device files over HTTP.

## Development

Dev tooling (linters) is managed with npm. It is only needed for contributing -
running the app itself needs no install.

```bash
npm install   # installs linters and sets up the pre-commit hook
npm run lint   # eslint + stylelint + json format check
```

Linting runs in CI on every pull request and must pass before merge.
