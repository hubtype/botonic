# Multichannel in Botonic

## Overview

Multichannel is the system that adapts Botonic messages for delivery on different messaging platforms. Rather than writing separate bot logic per channel, you write standard Botonic components (`Text`, `Button`, `Reply`, `Carousel`) and wrap them in a `<Multichannel>` component. At render time, the system inspects the active channel via `session.user.provider` and transforms the component tree into a shape that the target channel can accept.

The system handles three categories of adaptation:
1. **Structural transformation** — converting interactive components (buttons, carousels) into formats each channel supports
2. **Markdown conversion** — translating common markdown to channel-native formatting syntax
3. **Constraint enforcement** — truncating text and validating shapes to fit channel character limits

Currently, active multichannel adaptation applies to **WhatsApp**, **Facebook**, and **Instagram**. All other channels (Webchat, Telegram, Apple, etc.) receive the original components unchanged.

---

## Code Location

All multichannel code lives under two packages:

| Area | Path |
|---|---|
| Main wrapper | `packages/botonic-react/src/components/multichannel/multichannel.jsx` |
| Context | `packages/botonic-react/src/components/multichannel/multichannel-context.jsx` |
| Types | `packages/botonic-react/src/components/multichannel/index-types.ts` |
| Text adapter | `packages/botonic-react/src/components/multichannel/multichannel-text.jsx` |
| Button adapter | `packages/botonic-react/src/components/multichannel/multichannel-button.jsx` |
| Reply adapter | `packages/botonic-react/src/components/multichannel/multichannel-reply.jsx` |
| Carousel adapter | `packages/botonic-react/src/components/multichannel/multichannel-carousel.jsx` |
| Utilities | `packages/botonic-react/src/components/multichannel/multichannel-utils.ts` |
| WhatsApp constants | `packages/botonic-react/src/components/multichannel/whatsapp/constants.ts` |
| Markdown conversion | `packages/botonic-react/src/components/multichannel/whatsapp/markdown-meta.ts` |
| Facebook splitter | `packages/botonic-react/src/components/multichannel/facebook/facebook.jsx` |
| WhatsApp CTA URL button | `packages/botonic-react/src/components/whatsapp-cta-url-button.tsx` |
| WhatsApp button list | `packages/botonic-react/src/components/whatsapp-button-list.tsx` |
| Flow Builder channel conditional | `packages/botonic-plugin-flow-builder/src/content-fields/flow-channel-conditional.tsx` |
| Public exports | `packages/botonic-react/src/components/multichannel/index.ts` |

---

## Architecture

### Entry Point: `<Multichannel>`

`multichannel.jsx:20` — The `Multichannel` component is the outermost wrapper. It does the following on render:

1. Reads `requestContext.session` to determine the channel.
2. If the channel is not WhatsApp, Facebook, or Instagram, returns `props.children` unchanged (`multichannel.jsx:22-28`).
3. For **Facebook/Instagram**: walks the React tree with `deepMapWithIndex` and replaces every `Text` node with `MultichannelText` (`multichannel.jsx:29-43`).
4. For **WhatsApp**: walks the React tree and replaces `Button` → `MultichannelButton`, `Reply` → `MultichannelReply`, `Text` → `MultichannelText`, `Carousel` → `MultichannelCarousel` (`multichannel.jsx:46-86`).
5. Wraps the result in a `MultichannelContext.Provider` carrying index and separator configuration (`multichannel.jsx:97-108`).

If `messageSeparator` is provided, multiple adjacent string children are joined into a single `<Text>` with WhatsApp markdown disabled (`multichannel.jsx:87-96`).

Node type detection is done via React component `displayName` strings (defined in `packages/botonic-react/src/components/constants.ts`) through helpers in `multichannel-utils.ts`: `isNodeText`, `isNodeButton`, `isNodeReply`, `isNodeCarousel`.

### Context: `MultichannelContext`

`multichannel-context.jsx:3` — A React context that carries shared rendering state across all nested multichannel components:

```ts
interface MultichannelContextType {
  currentIndex: number | string  // auto-incremented as buttons render
  boldIndex?: boolean            // wraps index in *...* for WhatsApp bold
  indexSeparator?: string        // character after the index (e.g. ".", ":")
  messageSeparator?: string      // separator between adjacent messages
}
```

`currentIndex` is mutated in place by `MultichannelButton` on each button render (`multichannel-button.jsx:28-37`), which is how sequential numbering or lettering works without an external counter.

---

## Per-Component Adaptation

### `MultichannelButton` (`multichannel-button.jsx`)

Handles a single button. Its behavior depends on the button type and channel:

**WhatsApp:**

| Button type | `asText` flag | Output |
|---|---|---|
| Postback (`payload`/`path`) | true (default) | Plain text: `{newline}{index}{separator} {label}` |
| URL (`url`) | true (default) | Plain text: `- {label}: {url}` |
| Webview (`webview`) | true | Native `<Button>` component |
| Any | false | Native `<Button>` with text truncated to 20 chars (`WHATSAPP_MAX_BUTTON_CHARS`) |

When rendering a postback button as text, `increaseCurrentIndex()` (`multichannel-button.jsx:28-37`) advances the shared context index. The index format is:
- Number mode: `1`, `2`, `3`...
- Letter mode: `a`, `b`, `c`... (increments via char code)
- Bold variant: `*1*`, `*a*` etc. when `boldIndex=true`

**Other channels:** Renders as a standard `<Button>` unchanged.

---

### `MultichannelReply` (`multichannel-reply.jsx`)

**WhatsApp:** Quick replies with a `path` or `payload` are rendered as plain text (just the label string). Replies without a destination return `null`.

**Other channels:** Renders as a native `<Reply>` component.

---

### `MultichannelText` (`multichannel-text.jsx`)

The most complex adapter. It drives the bulk of WhatsApp adaptation logic.

#### WhatsApp path (`multichannel-text.jsx:126-296`)

1. **Extract text nodes** — `getText()` (`multichannel-text.jsx:38-54`) filters out React elements, keeping only plain string children.
2. **Separate buttons by type** — `getWhatsappButtons()` (`multichannel-text.jsx:62-76`) buckets all `MultichannelButton` and `MultichannelReply` children into `postbackButtons`, `urlButtons`, and `webviewButtons`.
3. **Apply markdown conversion** — each text string is passed through `convertToMarkdownMeta()` (`multichannel-text.jsx:131`).
4. **Button overflow check** — if `buttonsAsText=false` and `postbackButtons.length > 3` (`WHATSAPP_MAX_BUTTONS`), the overflow path activates (`multichannel-text.jsx:143-236`):
   - Postback buttons are grouped into chunks of 10 (`WHATSAPP_LIST_MAX_BUTTONS`) by `splitInWhatsappListButtons()` (`multichannel-text.jsx:114-124`).
   - Chunks with ≤ 3 buttons are rendered as a `<Text>` with numbered button text.
   - Chunks with > 3 buttons are rendered as `<WhatsappButtonList>` (a WhatsApp interactive list message).
   - URL buttons and webview buttons are appended as separate `<Text>` messages.
5. **Single URL/webview button shortcut** — if there are no postback buttons and exactly one URL or webview button, it renders as `<WhatsappCTAUrlButton>` (`multichannel-text.jsx:252-277`), the WhatsApp CTA URL interactive message type.
6. **Normal path** — buttons rendered as indexed text, assembled into a single `<Text>` message. Webview buttons are always appended as a separate message.

#### Facebook/Instagram path (`multichannel-text.jsx:299-332`)

1. Extract the text string from children via `getText()`.
2. Pass to `MultichannelFacebook.convertText()` which splits the text if it exceeds 640 characters (`MAX_CHARACTERS_FACEBOOK`).
3. Buttons and replies stay attached to the **last** text message only.
4. If there are more than 3 buttons, they are converted to `<Reply>` components instead.
5. Markdown conversion (`convertToMarkdownMeta`) is applied to each text segment.

---

### `MultichannelCarousel` (`multichannel-carousel.jsx`)

**Webchat/Dev:** Returns the native `<Carousel>` component unchanged (`multichannel-carousel.jsx:28-30`).

**WhatsApp, Facebook, Instagram:** Explodes each carousel card into a sequence of individual messages (`multichannel-carousel.jsx:32-83`):

For each card (`parseCarouselElement` at `multichannel-carousel.jsx:90-121`):
1. If the card has an image (`Pic`), emit an `<Image>` message.
2. Format title and subtitle as `**title** _subtitle_`, then apply `convertToMarkdownMeta()`.
3. If the card has URL buttons and the channel is WhatsApp, emit a `<WhatsappCTAUrlButton>` using the first URL button.
4. If the card has postback buttons, emit a `<Text>` with inline `<Button>` elements (filtered to non-URL buttons on WhatsApp).

---

## Markdown Conversion

**File:** `packages/botonic-react/src/components/multichannel/whatsapp/markdown-meta.ts`

`convertToMarkdownMeta(text: string): string` is the single entry point. It converts standard markdown to the subset used by WhatsApp and Facebook.

The conversion uses a two-pass normalization approach to avoid ambiguity between bold and italic markers:

**Pass 1 — normalize to unambiguous tokens:**
```
**text** or __text__  →  &%BOLD%&text&%BOLD%&
*text*  or _text_     →  &%ITALIC%&text&%ITALIC%&
```

**Pass 2 — convert tokens to channel format:**
```
&%BOLD%&text&%BOLD%&    →  *text*   (WhatsApp bold)
&%ITALIC%&text&%ITALIC%& →  _text_  (WhatsApp italic)
```

**Links:**
```
[link text](url)  →  link text: url
```

The normalization step exists because standard markdown uses `*` for both bold (double) and italic (single), which would create incorrect conversions if replaced in a single pass. The comment in `multichannel-text.jsx:253` warns against calling this function twice on the same string for the same reason — applying it a second time would turn bold (`*text*`) into italic.

---

## Constraint Enforcement / Validation

### WhatsApp character limits

Defined in `packages/botonic-react/src/components/multichannel/whatsapp/constants.ts`:

| Constant | Value | Applied to |
|---|---|---|
| `WHATSAPP_MAX_BUTTONS` | 3 | Max postback buttons before switching to list format |
| `WHATSAPP_LIST_MAX_BUTTONS` | 10 | Max rows per WhatsApp button list section |
| `WHATSAPP_MAX_BUTTON_CHARS` | 20 | Button label in native `<Button>` |
| `WHATSAPP_MAX_HEADER_CHARS` | 60 | Text header in CTA URL button |
| `WHATSAPP_MAX_BODY_CHARS` | 1024 | Body text in CTA URL button |
| `WHATSAPP_MAX_FOOTER_CHARS` | 60 | Footer text in CTA URL button |
| `WHATSAPP_MAX_CAROUSEL_CARD_TEXT_CHARS` | 160 | Carousel card text (defined but not currently enforced in carousel adapter) |

### `WhatsappCTAUrlButton` validation (`whatsapp-cta-url-button.tsx:92-128`)

Applied in `renderNode()` before the message is dispatched:
- Text header: truncated to 60 chars
- Body: `convertToMarkdownMeta()` then truncated to 1024 chars
- Footer: `convertToMarkdownMeta()` then truncated to 60 chars
- Display text (button label): truncated to 20 chars
- If `webview` prop is present, the URL is generated via `generateWebviewUrlWithParams()`

### `WhatsappButtonList` validation (`whatsapp-button-list.tsx:39-66`)

Applied in `truncateSectionsContents()` before serialization:
- Section title: truncated to 24 chars (`WHATSAPP_MAX_BUTTON_LIST_CHARS`)
- Row title: truncated to 24 chars
- Row description: truncated to 72 chars (`WHATSAPP_MAX_BUTTON_LIST_DESCRIPTION_CHARS`)
- Row ID: not truncated but logs a `console.error` if it exceeds 200 chars (`WHATSAPP_MAX_BUTTON_LIST_ID_CHARS`)
- Button text (the "open list" button): truncated to 20 chars

Truncation is performed by `truncateText(text, maxLength, ellipsis='...')` from `packages/botonic-react/src/util/strings.ts`.

---

## Facebook Text Splitting

**File:** `packages/botonic-react/src/components/multichannel/facebook/facebook.jsx`

`MultichannelFacebook.convertText()` handles long text for Facebook and Instagram. If `originalText.length > 640`:

1. `splitText()` splits the string on `\n` newline boundaries, grouping lines into chunks that stay under 640 characters each.
2. The last chunk becomes `propsLastText` — it carries all the buttons and replies.
3. All preceding chunks are plain text messages with no interactive elements.

This preserves the structural rule that Facebook messages may have buttons only once per message sequence.

---

## Flow Builder Channel Conditional

**File:** `packages/botonic-plugin-flow-builder/src/content-fields/flow-channel-conditional.tsx`

`FlowChannelConditional` is a flow node type that branches the conversation based on the active channel. It is the Flow Builder's way to handle channel-specific content without using the React `<Multichannel>` wrapper.

`setConditionalResult()` (`flow-channel-conditional.tsx:32-45`):
1. Reads `botContext.session.user.provider`.
2. Looks for a matching entry in `resultMapping` (each entry has a `result` field that is a provider string).
3. Falls back to the entry with `result === 'default'` if no provider match is found.
4. Sets `this.followUp` to the matched target node, routing the flow accordingly.
5. Throws if neither a provider match nor a default is found.

`trackFlow()` fires a `ConditionalChannel` analytics event recording which channel was matched.

This is entirely separate from `<Multichannel>` — it does not adapt message shape; it routes to completely different flow branches.

---

## Props Reference

### `<Multichannel>` props (`index-types.ts:42-53`)

| Prop | Type | Description |
|---|---|---|
| `firstIndex` | `number \| string` | Starting value for button index (default: `1` or `'a'` depending on mode) |
| `boldIndex` | `boolean` | Wraps index in `*...*` for WhatsApp bold formatting |
| `indexSeparator` | `string` | Character printed after the index (a space is always appended after it) |
| `messageSeparator` | `string` | Controls how sibling messages are concatenated. `undefined` = separate messages; `''` = same line; `'\n'` = new line; `'\n\n'` = empty line between |
| `text` | `MultichannelTextProps` | Props forwarded to every `MultichannelText` child |
| `carousel` | `MultichannelCarouselProps` | Props forwarded to every `MultichannelCarousel` child |

### `MultichannelTextProps` (`index-types.ts:15-23`)

| Prop | Type | Description |
|---|---|---|
| `indexMode` | `'number' \| 'letter' \| undefined` | How buttons are indexed. `undefined` = no index |
| `newline` | `string` | Prefix added before the whole text block |
| `buttonsAsText` | `boolean` | Whether postback buttons are rendered as plain text (default: `true`) |
| `buttonsTextSeparator` | `string` | Label shown before overflow buttons (default: `'More options:'`) |
| `menuButtonTextWhatsappList` | `string` | Label for the "open list" button in a WhatsApp button list (default: `'Show options'`) |

---

## WhatsApp Button Rendering Decision Tree

```
MultichannelText (WhatsApp)
│
├── buttonsAsText=false AND postbackButtons > 3?
│   ├── YES → split into chunks of 10
│   │   ├── chunk ≤ 3 buttons → <Text> with numbered button text
│   │   └── chunk > 3 buttons → <WhatsappButtonList>
│   ├── URL buttons → separate <Text> message
│   └── Webview buttons → separate <Text> message
│
└── Normal path (≤ 3 postback buttons or buttonsAsText=true)
    ├── postbackButtons = 0 AND urlButtons = 1 → <WhatsappCTAUrlButton>
    ├── postbackButtons = 0 AND webviewButtons = 1 → <WhatsappCTAUrlButton>
    └── otherwise → <Text> with indexed button text
        └── webviewButtons exist → extra <Text> message with webview buttons
```

---

## Test Files

| File | Covers |
|---|---|
| `packages/botonic-react/tests/components/multichannel/multichannel-wrapper.test.jsx` | Main wrapper channel detection |
| `packages/botonic-react/tests/components/multichannel/multichannel-text.test.jsx` | Text adapter, markdown, button splitting |
| `packages/botonic-react/tests/components/multichannel/multichannel-button.test.jsx` | Button type rendering, index increment |
| `packages/botonic-react/tests/components/multichannel/multichannel-reply.test.jsx` | Reply rendering per channel |
| `packages/botonic-react/tests/components/multichannel/multichannel-carousel.test.jsx` | Carousel card explosion |
| `packages/botonic-react/tests/components/multichannel/multichannel-carousel-multibutton.test.jsx` | Carousel with multiple button types |
