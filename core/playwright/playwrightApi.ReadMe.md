PlaywrightActions
│
├── click()
├── fill()
├── check()
├── uncheck()
├── selectOption()
├── hover()
├── focus()
├── press()
├── getText()
├── getAttribute()
├── isVisible()
├── isEnabled()
│
├── navigation → NavigationActions
├── wait → WaitActions
├── keyboard → KeyboardActions
├── mouse → MouseActions
├── dialog → DialogActions
├── frame → FrameActions
└── file → FileActions

### Navigation Actions:

| Category                    | Methods                                                 |
| --------------------------- | ------------------------------------------------------- |
| **Navigation**              | `goto`, `goBack`, `goForward`, `reload`                 |
| **URL**                     | `getCurrentUrl`, URL parsing                            |
| **URL waits**               | `waitForUrl`, `waitForUrlContains`, `waitForPath`       |
| **Load states**             | `waitForLoadState`, `waitForLoad`, `waitForNetworkIdle` |
| **Page metadata**           | `getTitle`, `getContent`                                |
| **Browser history**         | `goBackMultiple`, `goForwardMultiple`                   |
| **Popup / page navigation** | `waitForPopup`                                          |
| **Navigation events**       | `waitForNavigation`                                     |
| **Page lifecycle**          | `isClosed`                                              |

WaitActions
│
├── forVisible()
├── forHidden()
├── forEnabled()
├── forDisabled()
├── forText()
├── forValue()
├── forUrl()
└── forLoadState()

### Keyboard Actions

KeyboardActions
│
├── press()
├── type()
├── insertText()
├── keyDown()
└── keyUp()

### Mouse Actions

| Method          | Purpose                     | Frequency  |
| --------------- | --------------------------- | ---------- |
| `click()`       | Click at coordinates        | Medium     |
| `doubleClick()` | Double-click at coordinates | Low/Medium |
| `move()`        | Move mouse to coordinates   | Medium     |
| `down()`        | Press and hold mouse button | Low        |
| `up()`          | Release mouse button        | Low        |
| `wheel()`       | Mouse-wheel scrolling       | Medium     |

<!-- The important distinction is:

Upload → interact with <input type="file">
Download → wait for the download event
File chooser → handle applications where clicking a button opens the native file chooser -->

| Method                 | Purpose                              |
| ---------------------- | ------------------------------------ |
| `uploadFile()`         | Upload one file through a file input |
| `uploadFiles()`        | Upload multiple files                |
| `uploadUsingChooser()` | Handle native file chooser scenarios |
| `downloadFile()`       | Capture a download                   |
| `downloadAndSave()`    | Capture and save a downloaded file   |

uploadFile()

This will probably be your most frequently used method.

await this.actions.file.uploadFile(
this.resumeInput,
'data/files/resume.pdf'
);

Internally:

locator.setInputFiles(filePath);

Playwright handles the actual file-input interaction.

2. uploadFiles()

Useful for multi-file upload controls.

await this.actions.file.uploadFiles(
this.attachmentsInput,
[
'data/files/file1.pdf',
'data/files/file2.pdf'
]
);

3. uploadUsingChooser()

Some applications don't expose the <input type="file"> directly.

For example:

Click Upload
↓
Native File Chooser
↓
Select File

Then:

await this.actions.file.uploadUsingChooser(
async () => {
await this.actions.click(
this.uploadButton
);
},
'data/files/document.pdf'
);

Internally it uses:

page.waitForEvent('filechooser')

and then:

fileChooser.setFiles(...) 4. downloadFile()

For download validation:

const download =
await this.actions.file.downloadFile(
async () => {
await this.actions.click(
this.downloadButton
);
}
);

You can then inspect:

console.log(
download.suggestedFilename()
);

5. downloadAndSave()

For a test where you actually need the downloaded file:

await this.actions.file.downloadAndSave(
async () => {
await this.actions.click(
this.downloadButton
);
},
'downloads/report.pdf'
);

This gives you a very clean Page Object API.

### Frame Actions

FrameActions
│
├── getFrameLocator()
├── getFrameByName()
├── getFrameByUrl()
├── waitForFrame()
└── getAllFrames()

Playwright's Page events include things such as:

'close'
'console'
'dialog'
'download'
'filechooser'
'frameattached'
'framedetached'
'framenavigated'
'load'
'popup'
'request'
'response'
'requestfailed'
'requestfinished'

### DialogActions

DialogActions
│
├── accept()
├── dismiss()
└── acceptPrompt()
