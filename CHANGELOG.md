# Change Log

All notable changes to the "jj-stretch" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.7] - 2025-12-16

### Added

- add demo gjf

## [1.0.6] - 2025-12-16

### Changed

- **BREAKING**: Replaced YouTube video with ASCII terminal character animation
- Improved stretch animation with clear left/right body movements
- Animation now updates every 1 second for smoother experience
- Developer memes now change every 3 seconds instead of on every render
- Stretch overlay automatically closes after 15 seconds
- Skip button now shows sad character and closes after 3 seconds

### Added

- Interactive ASCII character that guides through stretching exercises
- Auto-close countdown display
- Localized stretch instruction messages in Korean and English

### Removed

- YouTube video embed dependency and related error handling
- `jj-stretch.stretchVideoUrl` configuration option

### Technical

- Migrated to monorepo structure with separate webview and extension packages
- Fixed VSCode API initialization issue (acquire only once)
- Updated CI/CD workflows for monorepo build process

## [1.0.5] - 2025-12-14

### Added

- English language support for stretch video page ([#2](https://github.com/jingjing2222/jj-stretch/pull/2) by @mrdsx)

## [Unreleased]

- Initial release
