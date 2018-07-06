# wp-update-project-version

A CLI command to update your WordPress plugin or theme's [file header](https://codex.wordpress.org/File_Header) version based off of your `package.json` version.

wp-update-project-version is a CLI command that is most useful when added to your build script in your `package.json`, like so:

```
{
    "scripts":  {
        "build": "webpack -p && wp-update-project-version -p style.css"
    }
}
```

## Usage

Currently, only `package.json` is the only supported `<source>` reference for a version. You can update one or more files, though at the moment, only WordPress header files are supported.

```
// wp-update-project-version -s <source> -p <path> [paths...]
wp-update-project-version -s package.json -p style.css index.php
```