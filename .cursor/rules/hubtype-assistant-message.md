# Formatos de texto para mensajes `assistant` (message history v2)

En el historial LLM v2 (`/external/v2/ai/agent/message_history/`), los mensajes del asistente son objetos con `role: "assistant"` y un único campo **`content`** (string). Este documento describe **solo** cómo se construye ese string para los mismos tipos que en conversación: **texto**, **carrusel**, **lista de botones WhatsApp** y **CTA URL WhatsApp**. Donde el canal distingue variantes de texto (solo cuerpo, quick replies o botones persistentes), van como subapartados.

Referencia de implementación: `DBMessageToLLMEnrichedText` en `app/automation_platform/shared/application/db_message_to_llm_enriched_text.py`.

---

## 1. Texto

### 1.1 Mensaje de texto (`TYPE_TEXT`)

**Formato base:** una o más líneas con el cuerpo (`message.text`).

Si hay **quick replies**, se concatena **después** del cuerpo:

```
<texto principal>

Quick replies:
  [1] <etiqueta1>
  [2] <etiqueta2>
  ...
```

**Reglas:**

- Entre el cuerpo y `Quick replies:` hay **dos** saltos de línea (`\n\n`).
- Cada opción: dos espacios iniciales, `[n]` con **n** desde 1, un espacio, etiqueta.
- Etiqueta por quick reply: `title` → `text` → `payload` → literal `Option`.
- Sin texto y sin quick replies útiles → no se emite contenido para el historial.

### 1.2 Mensaje con botones (`TYPE_BUTTONMESSAGE`)

Mismo rol de “texto de asistente”, pero los clics van en un bloque **Buttons:** (no “Quick replies”).

```
<texto principal>

Buttons:
  [1] <título o texto del botón 1>
  [2] <título o texto del botón 2>
  ...
```

**Reglas:**

- Botones en `buttons.buttons`. Etiqueta: `title` → `text` → literal `Button`.
- Puede ir seguido de otro `\n\n` y el bloque **Quick replies:** igual que en 1.1 si el mensaje también lleva quick replies.

---

## 2. Carrusel (`TYPE_CARROUSEL`)

**Entrada conceptual:** texto introductorio opcional + `elements[]` con título, subtítulo y botones por tarjeta.

**Sin elementos** (`elements` vacío o sin carrusel): solo se devuelve el texto principal (o cadena vacía).

**Con elementos:**

**Cabecera:**

- Si **no** hay `message.text`:  
  `Carousel displayed with {N} items:`  
  donde `N` es el número de elementos.
- Si hay `message.text`:
  - Si termina en `:` → la cabecera es **solo** ese texto.
  - Si **no** termina en `:` →  
    `{message.text}\nCarousel with {N} items:`

**Cuerpo:** una línea por elemento, numerada desde 1:

```
  {i}. "{title}"[ - {subtitle}][ [{btn1}, {btn2}, ...]]
```

**Reglas:**

- `title` por defecto `Item` si falta.
- ` - {subtitle}` solo si hay subtítulo no vacío.
- Botones: lista `buttons` o un único objeto `button` tratado como lista de un elemento. Etiqueta: `title` → `text` → `Action`.
- Tras la cabecera, un salto de línea y las líneas de ítems unidas con `\n`.
- Cada línea de ítem empieza con **dos espacios**.

**Ejemplo estructurado:**

```
Intro opcional
Carousel with 3 items:
  1. "Producto A" - Descripción [Comprar]
  2. "Producto B" [Ver, Compartir]
```

---

## 3. Lista de botones de WhatsApp (`TYPE_WHATSAPP_BUTTON_LIST`)

**Entrada conceptual:** objeto en `message.buttons` con `header`, `body`, `sections[]`, `footer`.

**Si no hay `message.buttons`:** se usa `message.text` o el literal `[WhatsApp Button List]`.

**Si hay datos:**

Las partes no vacías se concatenan en este orden, separadas por **doble salto de línea** `\n\n`:

1. **Header** (string), si existe.
2. **Body** (string), si existe.
3. **Secciones:** para cada sección:
   - Filas: por cada fila, línea `  - {title}` y, si hay descripción, `": {description}"` a continuación del título (sin espacio extra antes de `:` más allá del formato mostrado: es `  - Título: descripción` cuando hay descripción).
   - Si la sección tiene `title`: bloque `{section_title}:\n` + filas unidas con `\n`.
   - Si no tiene título: solo las filas unidas con `\n`.
   - Varias secciones: los bloques de sección se concatenan con `\n` entre ellos y ese bloque completo forma la tercera “parte” principal.
4. **Footer** (string), si existe.

**Reglas:**

- Entre header, body, bloque de secciones y footer: siempre `\n\n` entre partes consecutivas que existan.
- Título de fila vacío se representa como `  - ` seguido de descripción opcional.

---

## 4. Botón CTA URL de WhatsApp (`TYPE_WHATSAPP_CTA_URL_BUTTON`)

**Si no hay `message.buttons`:** `message.text` o literal `[WhatsApp CTA Button]`.

**Si hay datos:** líneas concatenadas con **un solo** `\n` entre líneas (no `\n\n`):

1. `header` (si existe)
2. `body` (si existe)
3. `footer` (si existe)
4. Línea del enlace: `[{display_text}]` y, si hay URL, inmediatamente después: ` ({url})` (paréntesis alrededor de la URL).

**Reglas:**

- No hay línea en blanco entre header, body y footer: solo `\n`.
- La línea CTA no lleva prefijo “Buttons:”; es una sola línea con corchetes alrededor del texto visible.

**Ejemplo:**

```
Encabezado
Cuerpo del mensaje
Pie
[Abrir tienda] (https://example.com)
```

---

## Resumen

| Tipo                         | Separador principal entre bloques grandes |
|-----------------------------|---------------------------------------------|
| Texto + quick replies       | `\n\n` antes de `Quick replies:`            |
| Texto + botones (Buttons)   | `\n\n` antes de `Buttons:`                  |
| Carrusel                    | `\n` entre cabecera e ítems; `\n` entre ítems |
| WhatsApp lista              | `\n\n` entre header, body, secciones, footer |
| WhatsApp CTA URL            | `\n` entre todas las líneas                 |
