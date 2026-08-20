# Burglish Blazor

A Blazor WebAssembly recreation of the Burglish 1.9 typing test area.

## Run

```powershell
dotnet run --project .\BurglishBlazor\BurglishBlazor.csproj
```

Open the HTTPS URL printed by `dotnet run`, type romanized Burmese in the editor, and choose a suggestion with the mouse, number keys, arrow keys, Space, Tab, or Enter.

Keyboard shortcuts:

- `F2`: toggle the Burglish suggestion menu
- `F8`: toggle the Myanmar typewriter mode
- `Esc`: close the current suggestion menu

The conversion engine is bundled locally, so typing works without calling the original website.

## Verify

```powershell
dotnet build .\BurglishBlazor.sln
```

See `THIRD-PARTY-NOTICES.md` for attribution to the original Burglish engine.
