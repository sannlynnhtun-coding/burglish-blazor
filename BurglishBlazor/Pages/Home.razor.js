import {
    gZ,
    gD,
    hV,
    gL,
    ND,
    Os,
    Ns,
    QF,
    NE,
    Ki,
    onFocus,
    NL,
    NB,
    Qp,
    N2,
    restoreDocumentKeypress
} from "../js/burglish-engine.js";

let converter;

class BurglishConverter {
    #host;
    #observer;
    #cleanups = [];
    #boundElements = new WeakSet();

    constructor(host, textArea) {
        this.#host = host;
        gZ({ id: textArea.id, N_: true, self: true, KY: false, rows: 10, Qe: 1, hc: 0 });
        restoreDocumentKeypress();
        this.#bindTree();

        this.#observer = new MutationObserver(() => this.#bindTree());
        this.#observer.observe(this.#host, { childList: true, subtree: true });

        const initializedTextArea = this.#host.querySelector(`#${CSS.escape(textArea.id)}`);
        const controls = this.#host.querySelectorAll("input, select");
        if (!initializedTextArea?.hasAttribute("burglish") || controls.length < 7) {
            throw new Error("Burglish converter initialization failed.");
        }
    }

    #listen(element, type, handler) {
        element.addEventListener(type, handler);
        this.#cleanups.push(() => element.removeEventListener(type, handler));
    }

    #bindTree() {
        this.#bindTextArea(this.#host.querySelector("textarea[burglish]"));
        this.#host.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(element => this.#bindCheckbox(element));
        this.#host.querySelectorAll("select").forEach(element => this.#bindSelect(element));
        this.#host.querySelectorAll('input[type="button"]').forEach(element => this.#bindButton(element));
        this.#host.querySelectorAll('[id^="wOtestarea"]').forEach(element => this.#bindSuggestion(element));
        this.#host.querySelectorAll("#Na span").forEach(element => this.#bindCharacter(element));
    }

    #claim(element) {
        if (!element || this.#boundElements.has(element)) {
            return false;
        }

        this.#boundElements.add(element);
        return true;
    }

    #bindTextArea(textArea) {
        if (!this.#claim(textArea)) {
            return;
        }

        ["onfocus", "onblur", "onmouseover", "onmouseup", "onkeyup", "onkeydown"].forEach(name => textArea.removeAttribute(name));
        this.#listen(textArea, "focus", () => onFocus(textArea));
        this.#listen(textArea, "blur", () => Ki(textArea));
        this.#listen(textArea, "mouseover", () => NE(textArea));
        this.#listen(textArea, "mouseup", event => QF(event));
        this.#listen(textArea, "keyup", event => QF(event));
        this.#listen(textArea, "keydown", event => {
            if (Ns(event) === false) {
                event.preventDefault();
                return;
            }

            if (event.key.length === 1 && !event.metaKey) {
                const charCode = event.key.charCodeAt(0);
                const legacyEvent = {
                    target: textArea,
                    keyCode: charCode,
                    charCode,
                    ctrlKey: event.ctrlKey,
                    altKey: event.altKey,
                    shiftKey: event.shiftKey
                };

                if (NL(legacyEvent) === false) {
                    event.preventDefault();
                }
            }
        });
    }

    #bindCheckbox(checkbox) {
        if (!this.#claim(checkbox)) {
            return;
        }

        checkbox.removeAttribute("onclick");
        const key = checkbox.id.replace(/^chktestarea/, "");
        const callback = key === "NW" ? "NM" : "undefined";
        this.#listen(checkbox, "click", () => gD(checkbox, "testarea", key, callback));
    }

    #bindSelect(select) {
        if (!this.#claim(select)) {
            return;
        }

        select.removeAttribute("onchange");
        this.#listen(select, "change", () => hV(select.value));
    }

    #bindButton(button) {
        if (!this.#claim(button)) {
            return;
        }

        button.removeAttribute("onclick");
        this.#listen(button, "click", () => button.value === "Correct Syntax!" ? gL() : ND());
    }

    #bindSuggestion(suggestion) {
        if (!this.#claim(suggestion)) {
            return;
        }

        ["onmousedown", "onmouseup", "onmouseover", "onmouseout"].forEach(name => suggestion.removeAttribute(name));
        const index = Number.parseInt(suggestion.id.replace(/^wOtestarea/, ""), 10);
        this.#listen(suggestion, "mousedown", () => NB());
        this.#listen(suggestion, "mouseup", () => Qp());
        this.#listen(suggestion, "mouseenter", () => N2(index));
        this.#listen(suggestion, "mouseleave", () => suggestion.className = "off");
    }

    #bindCharacter(character) {
        if (!this.#claim(character)) {
            return;
        }

        const inlineHandler = character.getAttribute("onclick") ?? "";
        character.removeAttribute("onclick");
        const match = inlineHandler.match(/^Os\('(.*)'\);$/);
        const value = match?.[1] ?? character.textContent.replace(/[\-\s]+/g, "");
        this.#listen(character, "click", () => Os(value));
    }

    dispose() {
        this.#observer?.disconnect();
        this.#cleanups.splice(0).forEach(cleanup => cleanup());
        restoreDocumentKeypress();
    }
}

export function initialize(host, textArea) {
    converter?.dispose();
    converter = new BurglishConverter(host, textArea);
}

export function dispose() {
    converter?.dispose();
    converter = undefined;
}
