# KS Steam Web v4.6.3

Modern black Steam-style storefront for GitHub Pages, with a companion Node/SQLite API prepared for the future KS Steam Client.

## Frontend

Open `index.html` locally or deploy the repository to GitHub Pages. The frontend is static and loads catalog data from `data/catalog.json`.

Included:
- English primary UI + Ukrainian, German, Polish, French, Spanish, Portuguese, Turkish, Japanese, Korean and Chinese language selector
- search, categories, source filters and sorting
- featured cards and release detail routes (`#release/<id>`)
- browser library using localStorage
- account/login/register UI
- review UI when the API is connected
- KS Steam Client sync action when the API is connected
- GitHub / GitLab / Google Drive / direct release links

## API

`backend/` contains the companion API. Run:

```bash
cd backend
npm install
cp .env.example .env
npm start
```

The API provides auth, releases, versions, source links, screenshot uploads, reviews and client synchronization.

Set the frontend API base in browser localStorage:

```js
localStorage.setItem('kssteam-api', 'http://localhost:8787')
```

For production, use HTTPS and set a strong `JWT_SECRET`.

## Client API concept

The future KS Steam Client can use the same API. Example endpoints:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/me`
- `GET /api/releases`
- `GET /api/releases/:id`
- `POST /api/releases/:id/reviews`
- `POST /api/client/sync`


## v4.4 GitHub project pages
- GitHub search supports pagination with **Load more**.
- Local KS Steam matches keep priority over remote GitHub results.
- Every GitHub result can open a native KS Steam project page at `#github/owner/repository`.
- The project page loads repository metadata and public GitHub Releases.
- Release assets such as `.exe`, `.msi`, AppImage, DMG, DEB and RPM are detected and exposed as direct download actions when available.
- A normal browser cannot silently execute an EXE; KS Steam downloads the installer and the user starts it manually.


## GitLab
Public GitLab projects are searched via the GitLab v4 Projects API. Release pages use the GitLab Releases API and expose public release links when available.

## Route compatibility
GitHub project pages support both `#gh/owner%2Frepo` and `#github/owner%2Frepo`. GitLab supports `#gl/project-id` and `#gitlab/project-id`.


## Programming Languages Catalog
The Languages category now includes 50 curated entries with official download or installation destinations, including Python, JavaScript, TypeScript, Java, C/C++, C#, PHP, Go, Rust, Swift, Kotlin, Ruby, SQL, R, MATLAB, Dart, Scala, Lua, Perl, Objective-C, Haskell, Elixir, Clojure, Groovy, Julia, Fortran, Ada, Assembly, VB.NET, Delphi, Scratch, PowerShell, Bash/Shell, Zig, Nim, Crystal, V, OCaml, F#, Racket, Common Lisp, Prolog, ABAP, Apex, Solidity, VBScript, Logo, Raku and ActionScript.


### Languages reliability fix
The Languages category now has a built-in 50-language fallback catalog and is isolated from GitHub/GitLab source filtering.

## v4.7 Language profiles
Programming languages now have dedicated KS Steam profile pages at `#language/<id>`. Every language is tagged `Languages`, never `KS PRIORITY`, and its profile exposes official download/install links from the language vendor's site.


## KS Priority software
- Rust Pulse is included as a KS Steam local Software entry with the `KS PRIORITY` badge and GitHub Releases source.
