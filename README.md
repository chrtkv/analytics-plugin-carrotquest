# Analytics Plugin for CarrotQuest

## Overview

This plugin integrates CarrotQuest into your project, allowing to track user interactions and events.

## Installation (пока не работает)

To install the plugin, run:

```bash
npm install @hexlet/analytics-plugin-carrotquest
```

## Usage

Add plugin to analytics.js following this guide — https://getanalytics.io/plugins/#installation--usage

## Configuration

Provide the plugin with the following configuration. The `apiKey` is required and can be found in the CarrotQuest panel. The `eventsMapping` allows you to map your project event names to CarrotQuest event names. Mapping for the default properties (`$email`, `$name`, `$phone`) is predefined, but you can override their or add your own with `propsMapping`.

Only defined properties and events will be sent to CarrotQuest.

```javascript
{
  apiKey: YOUR_API_KEY,
  eventsMapping: {
    signed_in: "$authorized",
  },
  propsMapping: {
    email: "$email",
  }
}
```
