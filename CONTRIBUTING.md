# Contributing

Everyone is welcome to report problems, suggest improvements, or propose changes.
Contributors do not need collaborator access. The maintainer reviews contributions
before they are merged or published; a pull request does not deploy the website.

## Bug reports

Use the Bug report form in [Issues](https://github.com/abse/mburoja/issues/new/choose).
Include the affected page or chapter, device/browser, steps to reproduce, expected
behavior, and actual behavior. Screenshots are helpful. Do not publish credentials
or personal information.

## Recordings

Use the Audio contribution form for a missing or replacement recording. Provide
the chapter, intended filename, narrator, source/download link, and redistribution
permission. The recording must match the Arabic prayer text and be clearly audible.
Preserve existing filenames when filling a missing recording.

For an entirely new collection, start a
[Discussion](https://github.com/abse/mburoja/discussions) first so its coverage,
quality, attribution, and permission can be reviewed before uploading many files.
See audio-report.json for the current missing filenames. Do not replace existing
recordings without agreement.

## Code changes

1. Fork the repository and create a branch for the change.
2. Edit shared sources. Keep the browser and generator dependency-free.
3. Run npm run check; run npm run cf:check for Worker/configuration changes.
4. Include rebuilt v2/ output when shared sources change.
5. Open a pull request explaining the problem, change, and validation.

Preserve v1/, religious text, references, chapter IDs, logo, and recordings.
Propose religious-text corrections separately with authoritative references.
Review UI changes on desktop/mobile and test real audio when relevant.

Follow [LICENSING.md](LICENSING.md). Keep discussions respectful and focused on
the project. Questions and ideas belong in Discussions; confirmed bugs belong
in Issues.
