# Worklog

## 29/11/2024

I tried to set-up Nix to build the package, but I got completely stuck multiple times.

- npmlock2nix
  - FAIL - might be possible, but this is altogether an undesirable solution
  - We don't use NPM, we use bun
  - Has not been maintained in 2 years
  - Requires v2 package-lock.json, not default v3
    - Even with v2 package-lock.json, many dependencies didn't have the required `resolved` field with the url
- Create a derivation for _our_ node-modules ourselves
  - FAIL - might be possible
  - I got stuck with permissions, I just couldn't get the binary `vite` to run in the buildphase of LSystemsApp

In the future, I want to try with `dream2nix`

Alternatively, we can manage a simple build script _with_ nix, so that it is at least stable.

- [x] High prio: Host the site on laura.fm/l-systems
  - I can simply sync it with:
```shell
bun run build
rsync -ravz ./dist/* laura.fm:/home/kapsuli/laura/www/l-systems 
```

## 30/11/2024

- [x] High prio: Set a title
- [x] Medium prio: Find a nice li'l favicon :<
- [ ] Low prio: When the window is resized, the tree does not re-render
- [x] High prio: The angle parameter isn't hooked up yet, we should hook it up.
- [x] High prio: There is no size parameter yet, we should add that and hook it up.
- [x] Allow side effects to run at each invocation of a symbol of the alphabet
- [x] Figure out what is up with the ugly lines, it looks very pixelated.
- [x] Medium prio: Add examples

I hosted my InterIntellect pilot salon on L-Systems today! I got a lot of really good feedback, and people made some
nice looking pictures! :)

- The iterations parameter quickly slows down/crashes the browser. That's undesirable
- The color stuff is unintuitive
- Can we add something like randomness?
- You should add a legend to the website to show what commands are supported

I made a legend on the spot, based on

paulburke's site

```
Character        Meaning
`F`	         Move forward by line length drawing a line
`f`	         Move forward by line length without drawing a line
`+`	         Turn left by turning angle
`-`	         Turn right by turning angle
`[`	         Push current drawing state onto stack
`]`	         Pop current drawing state from the stack
`>`	         Multiply the line length by the line length scale factor
`<`	         Divide the line length by the line length scale factor
```

https://paulbourke.net/fractals/lsys/

## 02/12/2024

I have a lot of things to work on, especially in terms of incorporating feedback.
But what I really want to do first, is to focus on making the system as a whole testable and measurable.
So that I introspect important properties of the system meaningfully.

I want to try out Playwright, because I think it bears more promise than Cypress.
Especially if I can set it up in Nix, it should mean that it would be one command to run tests on any environment!

That would be wonderful!

There're a lot of good resources about playwright+nix on the nix discourse site:
https://discourse.nixos.org/t/running-playwright-tests/25655/44

- [x] Set up a playwright suite so that it can visit and load the l-systems page.
  - Test is green if the Alan Kay quote loads.
  - [x] Install playwright in the Nix flake
  - [x] Add playwright with the same version in package.json
  - [x] Run the demo tests
  - [x] Make the Alan Kay quote test
    
I'm having trouble running the demo tests. If I run the nix `playwright` binary, with

```shell
$ playwright test
```

It fails with an error:

```shell
Error: Playwright Test did not expect test.beforeEach() to be called here.
Most common reasons include:
- You are calling test.beforeEach() in a configuration file.
- You are calling test.beforeEach() in a file that is imported by the configuration file.
- You have two different versions of @playwright/test. This usually happens
  when one of the dependencies in your package.json depends on @playwright/test.

   at demo-todo-app.spec.ts:3

  1 | import { test, expect, type Page } from '@playwright/test';
  2 |
> 3 | test.beforeEach(async ({ page }) => {
    |      ^
  4 |   await page.goto('https://demo.playwright.dev/todomvc');
  5 | });
  6 |

    at TestTypeImpl._currentSuite (/home/lb/Documents/Code/l-systems/node_modules/playwright/lib/common/testType.js:71:13)
    at TestTypeImpl._hook (/home/lb/Documents/Code/l-systems/node_modules/playwright/lib/common/testType.js:144:24)
    at Function.beforeEach (/home/lb/Documents/Code/l-systems/node_modules/playwright/lib/transform/transform.js:263:12)
    at /home/lb/Documents/Code/l-systems/tests-examples/demo-todo-app.spec.ts:3:6

Error: No tests found

To open last HTML report run:

  npx playwright show-report
```

It looks like there is an issue with bunx or bun.
It works ok if I run it with npx instead of bunx.

I did notice that there's an issue with chromium. It doesn't quite launch correctly? Not sure what's up with that.

- [x] Investigate issue with playwright x chromium

Oh, turns out the problem is more likely with webkit rather than chromium. I don't really care too much about webkit.
If it's tested in 

- Chromium
- Firefox

That's good enough for me for now. Safari would be nice too, but that's of course not possible on my linux Desktop.

## 04-12-2024

I want to just focus on adding some _nice_ stuff. Let's begin with a timeline.

- [ ] Prototype a rendering timeline
- [x] Implement test to verify the application doesn't hang at higher iteration speeds.

## 13-12-2024

First time streaming while working on the L-Systems editor.

- [x] Add the symbols legend
- [x] Find some of the secrets code

Secrets code:

```js
state.turtle.setColor(`
rgb(
  0,
  ${state.metrics.depth / state.metrics.maxDepth * 150},
  0
)
`)
```

Tree roots:

```js
state.turtle.setColor(`
rgb(
  ${45 / Math.log(state.metrics.depth + 1) + 15},
  ${state.metrics.depth / state.metrics.maxDepth * 150},
  0
)
`)
```

I really want to focus on the timeline.
I should write a scrubbable timeline component.

- [x] Add scrubbable timeline component :)
  - Note, the SVG slows down the editor to a crawl at anything 6+ iterations
