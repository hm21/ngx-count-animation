# Changelog

All notable changes to this project will be documented in this file.

## `3.1.0` - 2025.01.30
### Feat
- Run code outside NgZone for non-zoneless apps

## `3.0.0` - 2024.10.24
### Breaking Changes
- **Renamed**: The input property `detectLayoutChanges` is now `enableLayoutChangeDetection`.
- **Angular Version**: Minimum supported version is now Angular 18.
- **Removed**: `zone.js` has been completely removed.

### New Features
- **Viewport Control**: Added a new input option `enableRunOnlyInViewport`, allowing functionality to execute only when the element is visible in the viewport.

### Other Updates
- General code optimizations and improvements for better performance.


## `2.1.0` - 2024.10.05
### Feat
- Add `initialStartDelay` parameter to delay animation start

## `2.0.2` - 2024.06.27
### Fix
- Ensure global configs are optional.

## `2.0.1` - 2024.06.27
### Fix
- Ensure unit tests work with standalone solution

## `2.0.0` - 2024.06.27
### Feat
- Convert to a complete standalone solution for better support with Angular 18.
- Added ability to set global configs.

## `1.1.1` - 2024.02.16

### Fix

- Export scroll-service that user can override the scroll-listener


## `1.1.0` - 2024.02.16

### Added

- Enhance the functionality by implementing a feature that allows users to override the scroll listener to a different HTML element.


## `1.0.4` - 2023-12-20

### Added

- Added backward compatibility for Angular 9.

### Fixed

- Fixed minor bugs and issues.

### Updated

- Updated dependencies to the latest versions.


## `1.0.0` - 2023-12-19

_Initial release_
