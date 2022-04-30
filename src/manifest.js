const manifestV2 = {
  "name": "ChromeExtensionTemplate",
  "version": "1.0",
  "manifest_version": 2,
  "description": "An extension template",
  "author": "Jian.niu",
  "icons": {
    "32": "assets/icons/logo.png",
    "72": "assets/icons/logo.png",
    "128": "assets/icons/logo.png",
    "512": "assets/icons/logo.png"
  },
  "background": {
    // 以下只可指定其中一个
    "service_worker": "serviceWorker.js", // V3
    "page": "background/index.html", // V2
    "scripts": ["background/index.js"] // V2

  },
  // browser action, page action, app只可有其中一个
  "browser_action": {
    "default_title": "browser action title",
    "default_popup": "pages/BrowserAction/index.html",
    "default_icon": {
      "32": "assets/icons/logo.png",
      "72": "assets/icons/logo.png",
      "128": "assets/icons/logo.png",
      "512": "assets/icons/logo.png"
    }
  },
  "page_action": {
    "default_title": "page action title",
    "default_popup": "pages/PageAction/index.html",
    "default_icon": {
      "32": "assets/icons/logo.png",
      "72": "assets/icons/logo.png",
      "128": "assets/icons/logo.png",
      "512": "assets/icons/logo.png"
    }
  },
  "chrome_settings_overrides": {
    "homepage": "http://test.extension.homepage",
    "search_provider": {
      "name": "test extension search provider name",
      "keyword": "test extension search provider keyword",
      "search_url": "https://www.google.com/s?q={searchTerms}",
      "favicon_url": "http://www.baidu.com/favicon.ico",
      "suggest_url": "http://www.google.com/suggest?q={searchTerms}",
      "instant_url": "http://www.google.com/instant?q={searchTerms}",
      "encoding": "UTF-8",
      "is_default": true
    },
    "startup_pages": [
      "http://test.extension.startup"
    ]
  },
  "chrome_url_overrides": {
    "newtab": "NewTab.html"
  },
  // 一旦设置theme，其他配置均失效
  "theme": {
    "images": {
      "theme_frame": "images/theme_frame_camo.png",
      "theme_frame_overlay": "images/theme_frame_stripe.png",
      "theme_toolbar": "images/theme_toolbar_camo.png",
      "theme_ntp_background": "images/theme_ntp_background_norepeat.png",
      "theme_ntp_attribution": "images/attribution.png"
    },
    "colors": {
      "frame": [71, 105, 91],
      "toolbar": [207, 221, 192],
      "ntp_text": [20, 40, 0],
      "ntp_link": [36, 70, 0],
      "ntp_section": [207, 221, 192],
      "button_background": [255, 255, 255]
    },
    "tints": {
      "buttons": [0.33, 0.5, 0.47]
    },
    "properties": {
      "ntp_background_alignment": "bottom"
    }
  }
}