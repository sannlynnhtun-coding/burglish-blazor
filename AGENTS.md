# BurglishBlazor

| Setting | Value |
|---------|-------|
| **Interactivity Mode** | WebAssembly |
| **Interactivity Scope** | Global |

## Rendering configuration
This project uses global Interactive WebAssembly with prerendering.
Created with `dotnet new blazor -int WebAssembly -ai`.

All pages are interactive by default via `<Routes @rendermode="InteractiveWebAssembly" />` in `App.razor`. Components run entirely in the browser after the initial prerender.

## Project structure
- **BurglishBlazor** (server): Hosts the Blazor app and serves static files.
- **BurglishBlazor.Client** (WebAssembly): Contains the interactive UI and runs in the browser.

## Adding new components
- Put interactive components in `BurglishBlazor.Client`, not the server project.
- New pages go in `BurglishBlazor.Client/Pages/`.
- Pages are already interactive; do not add per-page render modes.

## Data access
This app currently has no backend data. If server data is added, expose it through HTTP endpoints and call those endpoints from the client project.

## Environment constraints
- Components run in the browser via WebAssembly. Do not use `HttpContext` or the server file system from client components.
- Client-side services belong in `BurglishBlazor.Client/Program.cs`.
- Server-side services belong in `BurglishBlazor/Program.cs`.

## Don'ts
- Do not put interactive components in the server project.
- Do not inject server-only services into the client project.
- Do not add `@rendermode InteractiveWebAssembly` to individual pages.
