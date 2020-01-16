# Contributing

When contributing to this repository, please first check whether the issue has already been logged, and if not, please file the ticket by creating a New Issue.

## Logging an Issue

1. Make sure this issue has not already been raised. If a relevant issue has been closed already please reopen it or make a reference to it in a new issue.
2. Add appropriate labels to the issue (e.g. F1-documentation)
3. Add the issue to the appropriate Project and/or Milestones. If unsure, leave it blank.
4. For minor issues, it is acceptable to describe the problem and offer a potential route to fix it. For more involved feature requests or bugs, please include the following details at the minimum:

##### For bugs:

- current system OS
- repository branch
- steps to reproduce
- stack trace

##### For feature requests:

- rationale
- paint the feature step by step (in words)
- mockup (optional)

## Pull Request Process

1. Pick an issue off the Issue tracker for the repository, and assign yourself before working on it so we don't have duplicated effort.
2. If unsure about the specifics of implementing a particular issue, please make a Draft PR sooner rather than later, and start a discussion from there.
3. When designing a new UI component, please make sure your changes are also reflected in the appropriate Storybook story.
4. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Commit Messages

Please follow the standards outlined in Conventional Commits: https://www.conventionalcommits.org/en/v1.0.0-beta.3/#specification

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team by logging an issue. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
[updateScripts]: https://gist.github.com/jacogr/9f0c8b33a7f14d944925787643dbf55b

## Styleguides

All TypeScript code must adhere to the [semistandard style](https://github.com/Flet/semistandard). These rules are programmatically enforced by [`tslint`](https://github.com/bukalapak/tslint-config-semistandard).

Moreover, we follow the following rules:

- Put brackets around arguments in closures, even if there's only one argument.

```diff
- const f = x => x + 1;
+ const f = (x) => x + 1;
```

- Add a blank line before a function's `return` statement.

```diff
function f () {
  const x = get_random_number();
+
  return x;
}
```

- Separate imports into 2 blocks: absolute imports and relative imports.

```diff
import { a } from 'react';
+
import { b } from '../my/moduleB';
```

- Sort imports alphabetically by package name. The character '@' comes before alphanumerical characters.

```diff
- import { a, b } from 'react';
- import { c, d } from '@polkadot/api';
+ import { c, d } from '@polkadot/api';
+ import { a, b } from 'react';
```

- React class properties and methods follow eslint's [`react/sort-comp`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-comp.md#rule-details) rule for ordering. However, we do make some exceptions:

  - Closures such as `handleButtonClick = () => { /* code goes here */}` are often used instead of methods in React to avoid binding with `this`. These properties are considered as methods.
  - If a function is used for rendering, then we prefix the function name with `render`, and add it *after* the `render` function. Render functions often contain JSX.
  - All methods should be public, for consistency.
