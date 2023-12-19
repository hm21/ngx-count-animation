<h1>ngx-count-animation</h1>

<div>

[![npm version](https://badge.fury.io/js/ngx-count-animations.svg)](https://badge.fury.io/js/ngx-count-animations)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Twitter Follow](https://img.shields.io/twitter/follow/hm21.svg)](https://twitter.com/Frei2100)

</div>


## Table of contents

- [About](#about)
- [Getting started](#getting-started)
- [Documentation](#documentation)
- [Example](#example)
- [Contributing](#contributing)
- [License](LICENSE)


<h2>About</h2>

A package that elegantly animates number changes, creating a visually engaging transition from one value to another, perfect for counting or displaying real-time data updates.

<h2>Getting started</h2>

### Installation

```sh
npm install ngx-count-animation
```

### Using the directive

#### Standalone component
```typescript
import { Component } from '@angular/core';
import { NgxCountAnimationDirective } from 'ngx-count-animation';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [ NgxCountAnimationDirective ],
})
export class AppComponent {}
```

#### Or for Module
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

import { NgxCountAnimationDirective } from 'ngx-count-animation';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxCountAnimationDirective,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


<h2>Documentation</h2>

### Inputs

| Option                   | Type    | Default | Comment                                                                                              |
| :----------------------- | :------ | :------ | :--------------------------------------------------------------------------------------------------- |
| ngxCountAnimation        | number  |         | Sets the target count for the count animation.                                                       |
| maximumFractionDigits    | number  | 0       | The maximum number of fraction digits to display.                                                    |
| minimumFractionDigits    | number  | 0       | The minimum number of fraction digits to display.                                                    |
| duration                 | number  | 2000    | Sets the duration of the count animation.                                                            |
| durationFromValue        | number  |         | Sets the duration based on the given value.                                                          |
| highPerformance          | boolean | true    | When `highPerformance` is `false`, an interval listener is active to detect layout changes.          |


### Outputs
| Option          | Type               | Comment                                       |
|:----------------|:-------------------|:----------------------------------------------|
| startAnimation  | EventEmitter<void> | Emits an event at the start of the animation. |
| endAnimation    | EventEmitter<void> | Emits an event at the end of the animation.   |


<h2>Example</h2>

#### Simple example
```html
<div ngxCountAnimation="1000000"></div>
```

#### Complete example demonstrating all properties
```html
 <div
      ngxCountAnimation="123456789"
      duration="2000"
      maximumFractionDigits="0"
      minimumFractionDigits="0"
      highPerformance="true"
    ></div>
```

## Contributing

I welcome contributions from the open-source community to make this project even better. Whether you want to report a bug, suggest a new feature, or contribute code, I appreciate your help.

### Bug Reports and Feature Requests

If you encounter a bug or have an idea for a new feature, please open an issue on my [GitHub Issues](https://github.com/hm21/ngx-count-animation/issues) page. I will review it and discuss the best approach to address it.

### Code Contributions

If you'd like to contribute code to this project, please follow these steps:

1. Fork the repository to your GitHub account.
2. Clone your forked repository to your local machine.

```bash
git clone https://github.com/hm21/ngx-scroll-animations.git
```
