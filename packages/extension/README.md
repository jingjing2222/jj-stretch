# JJ Stretch

A VSCode extension that promotes healthy coding habits by reminding you to take stretch breaks at regular intervals.

## Usage

### Commands

Use `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) to open command palette:

- **Start Stretch Timer** - Starts the countdown timer
- **Stop Stretch Timer** - Stops the running timer
- **Reset Stretch Timer** - Resets timer to initial state and closes video overlay
- **Set Timer Interval (Minutes)** - Opens input box to change timer duration
  - Valid range: 1-480 minutes
  - If timer is running, it will restart with new interval
  - Setting is saved globally across all VSCode workspaces

### Status Bar

The extension shows timer status in VSCode status bar:

- `⏸️ Stretch Timer` - Click to start timer
- `⏱️ 25:30` - Shows ㄱ time, click to stop
- `🏃‍♂️ Time to Stretch!` - Timer expired, click to reset

### How It Works

1. Timer starts automatically when VSCode opens (default: 60 minutes)
2. Countdown displays in status bar
3. When timer reaches 0, a stretch video appears automatically
4. Video plays muted with controls available
5. After video ends or is closed, new timer cycle begins

## Settings

### Quick Settings Access

- Press `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux) to open settings
- Search for "jj-stretch" to find all extension settings

### Available Settings

| Setting                           | Type    | Default       | Description                         |
| --------------------------------- | ------- | ------------- | ----------------------------------- |
| `jj-stretch.timerIntervalMinutes` | number  | `60`          | Timer duration in minutes (1-480)   |
| `jj-stretch.stretchVideoUrl`      | string  | Default video | YouTube embed URL for stretch video |
| `jj-stretch.autoStart`            | boolean | `true`        | Auto-start timer when VSCode opens  |

### JSON Configuration

Add to your VSCode settings.json:

```json
{
  "jj-stretch.timerIntervalMinutes": 60,
  "jj-stretch.stretchVideoUrl": "https://www.youtube.com/watch?v=z-FI2mni_Nk",
  "jj-stretch.autoStart": true
}
```

### Custom Video Setup

To use your own stretch video:

1. Find a YouTube video URL: `https://www.youtube.com/watch?v=VIDEO_ID`
2. Convert to embed format: `https://www.youtube.com/embed/VIDEO_ID?autoplay=1&controls=1&mute=1`
3. Update `stretchVideoUrl` setting with the embed URL

### Settings Behavior

- **Global Settings**: Changes apply to all VSCode workspaces
- **Immediate Effect**: Most settings take effect immediately
- **Timer Restart**: Changing interval while timer is running will restart with new duration

## Installation

1. Download the `.vsix` file
2. Open VSCode
3. Press `Ctrl+Shift+P` and run "Extensions: Install from VSIX..."
4. Select the downloaded file

---

Made by [jingjing2222](https://github.com/jingjing2222) 💪
