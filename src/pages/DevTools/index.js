console.log("run devtools page");
chrome.devtools.panels.create(
  "Mock",
  "assets/icons/logo.png",
  "Pages/DevToolsPanel/index.html"
);
// chrome.devtools.panels.elements.createSidebarPane("TestPosition", (result) =>
//   result.setPage("ElementsSidebar.html")
// );
// chrome.devtools.panels.sources.createSidebarPane("TestSources", (result) =>
//   result.setPage("SourcesSidebar.html")
// );
