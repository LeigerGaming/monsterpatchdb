export default [
  {
    files: ["docs/assets/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        // Assigned as window.renderFeaturedVideo by featured-video.js (loaded
        // before app.js in index.html) and called as a bare global in app.js.
        renderFeaturedVideo: "readonly",
      },
    },
    rules: {
      "no-undef": "error",
    },
  },
];
