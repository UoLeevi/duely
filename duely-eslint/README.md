# @duely/eslint-plugin

ESLint plugin by Duely

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@duely/eslint-plugin`:

```
$ npm install @duely/eslint-plugin --save-dev
```


## Usage

Add `duely` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "duely"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "duely/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





