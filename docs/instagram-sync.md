# Instagram photo import

The `/photography` page reads the local snapshot at `frontend/public/data/instagram.json` and the downloaded images under `frontend/public/images/instagram`. The snapshot is imported from the public [@design.4x profile](https://www.instagram.com/design.4x/); each entry contains the post permalink, visible caption, publication timestamp, and a local copy of its cover image.

There is no scheduled sync or token required. To refresh the page, inspect the public profile and individual posts, download new cover images into `frontend/public/images/instagram`, and merge entries into `frontend/public/data/instagram.json` by post ID. Preserve existing photographs unless their removal is confirmed. Read publication timestamps from the post's `time[datetime]` element, rather than inferring them from image alt text or a relative time label. Set `syncedAt` only after checking the source and saving the images.

The gallery keeps its existing ordering by the photography month in the caption (`YYYY.MM`), newest first. Each carousel is represented by its cover image and links to the complete Instagram post. Remote CDN URLs are not stored in the feed because they can expire.

## Latest refresh — 2026-10-19

The snapshot contains 11 posts, including these three additions:

- `DeqSJYto0Gl`: 2026.10 禾木
- `DeqSEWjIXaZ`: 2026.10 白哈巴
- `DeqR-CGotH3`: 2026.09 天山天池

The carousel types for 四姑娘山、成都、普吉岛 were also corrected to match the public profile. Validate the snapshot's IDs, local image paths and timestamps, run `npm run build`, and check `/photography` at desktop and phone widths after updating.
