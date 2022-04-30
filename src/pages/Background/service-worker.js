console.log('background service worker:');

// globalThis.addEventListener("fetch", (event) => {
//   console.log("service worker event:", event);
// });
// chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((info) =>
//   console.log(info)
// );
// await chrome.declarativeNetRequest.getDynamicRules((rules) =>
//   chrome.declarativeNetRequest.updateDynamicRules({
//     removeRuleIds: rules.map((rule) => rule.id),
//   })
// );

// chrome.declarativeNetRequest.updateDynamicRules({
//   addRules: [
//     // {
//     //   action: {
//     //     type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
//     //     responseHeaders: [
//     //       {
//     //         header: "Access-Control-Allow-Origin",
//     //         operation: chrome.declarativeNetRequest.HeaderOperation.SET,
//     //         value: "*",
//     //       },
//     //     ],
//     //   },
//     //   condition: {
//     //     urlFilter: "shopee.com",
//     //   },
//     //   id: Math.round(Math.random() * 100),
//     //   priority: 1,
//     // },
//     {
//       action: {
//         type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
//         redirect: {
//           url: "data:text/plain;charset=utf-8;headers=Access-Control-Allow-Origin:*;base64,4oiaDQo=",
//         },
//       },
//       condition: {
//         requestMethods: [chrome.declarativeNetRequest.RequestMethod.OPTIONS],
//       },
//       id: Math.round(Math.random() * 100),
//       priority: 1,
//     },
//     {
//       action: {
//         type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
//         responseHeaders: [
//           {
//             header: "Access-Control-Allow-Origin",
//             operation: chrome.declarativeNetRequest.HeaderOperation.SET,
//             value: "*",
//           },
//         ],
//       },
//       condition: {
//         urlFilter: "*",
//       },
//       id: Math.round(Math.random() * 100),
//       priority: 1,
//     },
//   ],
// });

export default undefined;
