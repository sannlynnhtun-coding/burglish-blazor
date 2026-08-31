using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace BurglishBlazor.Pages;

internal sealed class HomeInterop(IJSRuntime js) : IAsyncDisposable
{
    internal const string ModulePath = "./Pages/Home.razor.js";
    internal const string InitializeMethod = "initialize";
    internal const string DisposeMethod = "dispose";

    private IJSObjectReference? _module;

    public async ValueTask InitializeAsync(ElementReference host, ElementReference textArea)
    {
        _module = await js.InvokeAsync<IJSObjectReference>("import", ModulePath);
        await _module.InvokeVoidAsync(InitializeMethod, host, textArea);
    }

    public async ValueTask DisposeAsync()
    {
        try
        {
            if (_module is not null)
            {
                await _module.InvokeVoidAsync(DisposeMethod);
                await _module.DisposeAsync();
            }
        }
        catch (JSDisconnectedException)
        {
        }
    }
}
