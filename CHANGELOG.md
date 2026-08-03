# Changelog

All notable changes to this project are documented in this file.

The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-08-03

### Added

- MIDI output over the Web MIDI API, with output port and channel selection.
- Randomise, sending one fresh random value to every enabled parameter as either
  a CC message or a 14-bit NRPN sequence.
- Devices as JSON files describing an instrument's parameters, validated against
  `devices/schema.json`. Korg Volca FM ships with the app.
- A parameter list showing each parameter's type, number, range and whether it is
  included in the randomisation, all editable in place.
- A device editor: create devices, save them to the browser's local storage,
  import and export them as JSON, and delete saved devices.
- A dark interface sized for desktop browsers.

[Unreleased]: https://github.com/llozd/CC-rand/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/llozd/CC-rand/releases/tag/v0.1.0
