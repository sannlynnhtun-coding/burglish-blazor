# BurglishBlazor

| Setting | Value |
|---------|-------|
| **Interactivity Mode** | WebAssembly |
| **Interactivity Scope** | Global |

## Rendering configuration
This project is a single standalone Blazor WebAssembly app. It runs entirely in the browser with no server host and no prerendering.

Created by merging the former server (`BurglishBlazor`) and client (`BurglishBlazor.Client`) projects into one.

## Project structure
- **BurglishBlazor**: Single WebAssembly project (`Microsoft.NET.Sdk.BlazorWebAssembly`). Contains all interactive UI, pages, layouts, and static assets under `wwwroot/`.

## Adding new components
- Put interactive components in `BurglishBlazor`.
- New pages go in `BurglishBlazor/Pages/`.
- All pages run in the browser; do not add per-page render modes.

## Data access
This app currently has no backend data. If server data is added later, expose it through HTTP endpoints and call those endpoints from the client components.

## Environment constraints
- Components run in the browser via WebAssembly. Do not use `HttpContext` or the server file system.
- Client-side services belong in `BurglishBlazor/Program.cs`.

## Don'ts
- Do not use server-only services.
- Do not add `@rendermode InteractiveWebAssembly` to individual pages.