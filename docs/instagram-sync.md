# Instagram photo import

The `/photography` page reads the local snapshot at `public/data/instagram.json` and the downloaded images under `public/images/instagram`. The current snapshot was imported directly from the public `@design.4x` profile; it contains the post permalink, visible public text, and a local copy of the image.

There is no scheduled sync or token required. To refresh the page later, inspect the public profile, download the currently visible images into `public/images/instagram`, and update the matching entries in `public/data/instagram.json`.

For a production-grade automated feed, use Meta's official Instagram API instead of scraping the public HTML. The API requires a Professional Instagram account linked to a Facebook Page and a Page Access Token. See Meta's [official Page token request](https://www.postman.com/meta/instagram/request/23987686-23613b44-9a39-4ac1-9e2c-fd21b8235f45).
