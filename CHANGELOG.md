# RecoveryGPT Changelog

## [1.1.1] - 2023-11-25
### Patched
- Tidying up the search keyword highlighting to be less overbearing and more subtle.

## [1.1.0] - 2023-11-25
### Added
- Multi-file selection support: Users can now load a series of ChatGPT export files and view them collectively within the application. Simply pool a series of your `conversation.json` files into a single folder, and select them all when prompted to load your data.
- Search functionality: A new search field has been introduced to quickly find keywords in past conversations, with highlighting for matching keywords. As you type in the search field, the application will automatically filter the conversations list to only those that match the search query, selecting the first matching conversation.

### Improved
- Addition of a page load given the increased timing when loading multiple files, or while search filters are applied to give a better experience that's less jarring.

### Patched
- Issues with the mobile sidebar/overlay from not rendering correctly on initial load

## [1.0.0] - 2023-07-05
### Initial Release
- **Secure**: Operates with full respect for user privacy. No file uploads, no tracking, and fully functional offline.
- **Convenient**: Enhanced usability for reviewing old conversations more intuitively than in the default ChatGPT interface.
- **Effortless Recovery**: In-built copy buttons for easy retrieval of text or code snippets.
- **Export Data Guidance**: Step-by-step guide for exporting data from ChatGPT.
- **File Selection**: Support for `conversation.json` files from ChatGPT exports.
