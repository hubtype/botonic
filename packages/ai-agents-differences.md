# AI Agents Implementation Differences

This document outlines the main differences between the Ralph Lauren-specific AI agents implementation (`ralph-lauren/src/server/plugins/ai-agents`) and the generic Botonic plugin (`botonic/packages/botonic-plugin-ai-agents`).

## Summary

The Ralph Lauren version includes:
- **Ralph Lauren-specific prompt files** (`prompt.ts` and `promptt.ts`)
- **Dual provider support** (OpenAI + Azure OpenAI)
- **Different model configuration** (explicit model setting, reasoning/text verbosity)
- **Positional constructor pattern** (vs options object)
- **Default prompt fallback** mechanism
- **Different timeout settings** (16s vs 8s)
- **Different message sender detection** (using SENDERS enum vs string)

The Botonic plugin version includes:
- **Campaign context support** (from `request.input.context?.campaign_v2`)
- **Options-based constructor** pattern
- **Tool choice logic** for knowledge retrieval
- **Only Azure OpenAI support**

---

## 1. Ralph Lauren-Specific Prompt Files

### Ralph Lauren Version
**Files:** `prompt.ts` and `promptt.ts`

Both files contain Ralph Lauren-specific agent prompts with detailed guidelines for the WhatsApp concierge service.

```typescript
// agent-builder.ts
import { AGENT_PROMPT } from './promptt'

private addExtraInstructions(
  externalInstructions: string,
  contactInfo: ContactInfo
): string {
  const prompt = externalInstructions?.trim()
    ? externalInstructions
    : AGENT_PROMPT  // ← Default fallback to Ralph Lauren prompt
  const instructions = `<instructions>\n${prompt}\n</instructions>`
  // ...
}
```

### Botonic Plugin Version
**No default prompt files** - instructions must always be provided explicitly.

---

## 2. OpenAI Provider Support

### Ralph Lauren Version
**Supports both OpenAI and Azure OpenAI**

```typescript
// constants.ts
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.2'
export const OPENAI_PROVIDER: 'openai' | 'azure' =
  (process.env.OPENAI_PROVIDER as 'openai' | 'azure') || 'openai'
```

```typescript
// openai.ts
export function setUpOpenAI(maxRetries?: number, timeout?: number) {
  if (OPENAI_PROVIDER === 'azure') {
    setAzureOpenAIClient(maxRetries, timeout)
    setOpenAIAPI('chat_completions')
  } else {
    setOpenAIClient(maxRetries, timeout)  // ← Standard OpenAI support
    setOpenAIAPI('chat_completions')
  }
  setTracingDisabled(true)
}

function setOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    timeout: timeout || 16000,  // ← 16 seconds
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}
```

### Botonic Plugin Version
**Only Azure OpenAI support**

```typescript
// constants.ts
// No OPENAI_API_KEY, OPENAI_MODEL, or OPENAI_PROVIDER constants
```

```typescript
// openai.ts
export function setUpOpenAI(maxRetries?: number, timeout?: number) {
  setAzureOpenAIClient(maxRetries, timeout)  // ← Only Azure
  setOpenAIAPI('chat_completions')
  setTracingDisabled(true)
}

function setAzureOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new AzureOpenAI({
    // ...
    timeout: timeout || 8000,  // ← 8 seconds (different timeout)
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}
```

---

## 3. Model Configuration

### Ralph Lauren Version
**Explicit model setting and reasoning/text verbosity**

```typescript
// agent-builder.ts
build(): AIAgent<TPlugins, TExtraData> {
  // When using standard OpenAI API, we need to specify the model
  // Azure OpenAI uses deployment name instead
  const model = OPENAI_PROVIDER === 'openai' ? OPENAI_MODEL : undefined  // ← Explicit model

  return new Agent({
    name: this.name,
    model,  // ← Model specified for OpenAI provider
    instructions: this.instructions,
    tools: this.tools,
    outputType: OutputSchema,
    inputGuardrails: this.inputGuardrails,
    outputGuardrails: [],
    modelSettings: {
      //@ts-ignore
      reasoning: { effort: 'none' },  // ← Reasoning settings
      text: { verbosity: 'medium' },  // ← Text verbosity settings
    },
  })
}
```

### Botonic Plugin Version
**Tool choice logic instead of reasoning/text settings**

```typescript
// agent-builder.ts
build(): AIAgent<TPlugins, TExtraData> {
  const modelSettings: ModelSettings = {}

  if (this.tools.includes(retrieveKnowledge)) {
    modelSettings.toolChoice = retrieveKnowledge.name  // ← Tool choice logic
  }

  return new Agent({
    name: this.name,
    instructions: this.instructions,
    tools: this.tools,
    outputType: OutputSchema,
    inputGuardrails: this.inputGuardrails,
    outputGuardrails: [],
    modelSettings,  // ← No reasoning/text verbosity, but tool choice
  })
}
```

---

## 4. Constructor Pattern

### Ralph Lauren Version
**Positional parameters**

```typescript
// agent-builder.ts
export class AIAgentBuilder<TPlugins extends ResolvedPlugins = ResolvedPlugins, TExtraData = any> {
  constructor(
    name: string,
    instructions: string,
    tools: Tool<TPlugins, TExtraData>[],
    contactInfo: ContactInfo,
    inputGuardrailRules: GuardrailRule[],
    sourceIds: string[]
  ) {
    this.name = name
    this.instructions = this.addExtraInstructions(instructions, contactInfo)
    // ...
  }
}
```

```typescript
// index.ts
const agent = new AIAgentBuilder<TPlugins, TExtraData>(
  aiAgentArgs.name,
  aiAgentArgs.instructions || '',
  tools,
  request.session.user.contact_info || {},
  aiAgentArgs.inputGuardrailRules || [],
  aiAgentArgs.sourceIds || []
).build()
```

### Botonic Plugin Version
**Options object pattern**

```typescript
// agent-builder.ts
interface AIAgentBuilderOptions<TPlugins extends ResolvedPlugins = ResolvedPlugins, TExtraData = any> {
  name: string
  instructions: string
  tools: Tool<TPlugins, TExtraData>[]
  campaignContext?: CampaignV2  // ← Additional option
  contactInfo: ContactInfo
  inputGuardrailRules: GuardrailRule[]
  sourceIds: string[]
}

export class AIAgentBuilder<TPlugins extends ResolvedPlugins = ResolvedPlugins, TExtraData = any> {
  constructor(options: AIAgentBuilderOptions<TPlugins, TExtraData>) {
    this.name = options.name
    this.instructions = this.addExtraInstructions(
      options.instructions,
      options.contactInfo,
      options.campaignContext  // ← Campaign context support
    )
    // ...
  }
}
```

```typescript
// index.ts
const agent = new AIAgentBuilder<TPlugins, TExtraData>({
  name: aiAgentArgs.name,
  instructions: aiAgentArgs.instructions,
  tools: tools,
  contactInfo: request.session.user.contact_info || {},
  inputGuardrailRules: aiAgentArgs.inputGuardrailRules || [],
  sourceIds: aiAgentArgs.sourceIds || [],
  campaignContext: request.input.context?.campaign_v2,  // ← Campaign context
}).build()
```

---

## 5. Campaign Context Support

### Ralph Lauren Version
**No campaign context support**

```typescript
// index.ts
const agent = new AIAgentBuilder<TPlugins, TExtraData>(
  aiAgentArgs.name,
  aiAgentArgs.instructions || '',
  tools,
  request.session.user.contact_info || {},
  aiAgentArgs.inputGuardrailRules || [],
  aiAgentArgs.sourceIds || []
).build()
// ← No campaign context passed
```

### Botonic Plugin Version
**Campaign context support**

```typescript
// index.ts
const agent = new AIAgentBuilder<TPlugins, TExtraData>({
  name: aiAgentArgs.name,
  instructions: aiAgentArgs.instructions,
  tools: tools,
  contactInfo: request.session.user.contact_info || {},
  inputGuardrailRules: aiAgentArgs.inputGuardrailRules || [],
  sourceIds: aiAgentArgs.sourceIds || [],
  campaignContext: request.input.context?.campaign_v2,  // ← Campaign context
}).build()
```

```typescript
// agent-builder.ts
private addExtraInstructions(
  initialInstructions: string,
  contactInfo: ContactInfo,
  campaignContext?: CampaignV2  // ← Campaign context parameter
): string {
  const instructions = `<instructions>\n${initialInstructions}\n</instructions>`
  const metadataInstructions = this.getMetadataInstructions()
  const contactInfoInstructions = this.getContactInfoInstructions(contactInfo)
  const campaignInstructions = this.getCampaignInstructions(campaignContext)  // ← Campaign instructions
  const outputInstructions = this.getOutputInstructions()
  return `${instructions}\n\n${metadataInstructions}\n\n${contactInfoInstructions}\n\n${campaignInstructions}\n\n${outputInstructions}`
}

private getCampaignInstructions(campaignContext?: CampaignV2): string {
  if (!campaignContext || !campaignContext.agent_context) {
    return ''
  }
  return `<campaign_context>\n${campaignContext.agent_context}\n</campaign_context>`  // ← Campaign context injection
}
```

---

## 6. Default Instructions Fallback

### Ralph Lauren Version
**Falls back to AGENT_PROMPT if instructions are empty**

```typescript
// agent-builder.ts
private addExtraInstructions(
  externalInstructions: string,
  contactInfo: ContactInfo
): string {
  const prompt = externalInstructions?.trim()
    ? externalInstructions
    : AGENT_PROMPT  // ← Default fallback to Ralph Lauren prompt
  const instructions = `<instructions>\n${prompt}\n</instructions>`
  // ...
}
```

### Botonic Plugin Version
**No default fallback - instructions must be provided**

```typescript
// agent-builder.ts
private addExtraInstructions(
  initialInstructions: string,  // ← No fallback, must be provided
  contactInfo: ContactInfo,
  campaignContext?: CampaignV2
): string {
  const instructions = `<instructions>\n${initialInstructions}\n</instructions>`
  // ...
}
```

---

## 7. Message Sender Detection

### Ralph Lauren Version
**Uses SENDERS enum from @botonic/react**

```typescript
// hubtype-api-client.ts
import { SENDERS, WebchatMessage } from '@botonic/react'

getLocalMessages(maxMemoryLength: number): AgenticInputMessage[] {
  // ...
  const filteredMessages = messages
    .filter(message => message.data.text)
    .map(message => ({
      role: message.sentBy === SENDERS.user ? 'user' : 'assistant',  // ← Using SENDERS enum
      content: message.data.text,
    }))
  // ...
}
```

### Botonic Plugin Version
**Uses string comparison**

```typescript
// hubtype-api-client.ts
// No import of SENDERS

async getLocalMessages(maxMemoryLength: number): Promise<AgenticInputMessage[]> {
  // ...
  const filteredMessages = messages
    .filter(message => message.data.text)
    .map(message => ({
      role: message.sentBy === 'user' ? 'user' : 'assistant',  // ← String comparison
      content: message.data.text,
    }))
  // ...
}
```

---

## 8. Timeout Differences

### Ralph Lauren Version
**16 seconds timeout for OpenAI client**

```typescript
// openai.ts
function setOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    timeout: timeout || 16000,  // ← 16 seconds
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}
```

### Botonic Plugin Version
**8 seconds timeout for Azure client**

```typescript
// openai.ts
function setAzureOpenAIClient(maxRetries?: number, timeout?: number) {
  const client = new AzureOpenAI({
    apiKey: AZURE_OPENAI_API_KEY,
    apiVersion: AZURE_OPENAI_API_VERSION,
    deployment: AZURE_OPENAI_API_DEPLOYMENT_NAME,
    baseURL: AZURE_OPENAI_API_BASE,
    timeout: timeout || 8000,  // ← 8 seconds
    maxRetries: maxRetries || 2,
    dangerouslyAllowBrowser: !isProd,
  })
  setDefaultOpenAIClient(client)
}
```

---

## 9. Runner Type Annotations

### Ralph Lauren Version
**Explicit type annotations**

```typescript
// runner.ts
private getToolsExecuted(
  result: any,
  context: Context<TPlugins, TExtraData>
): ToolExecution[] {
  return (
    result.newItems
      ?.filter((item: any) => item instanceof RunToolCallItem)  // ← Explicit type annotation
      .map((item: RunToolCallItem) =>
        this.getToolExecutionInfo(item as RunToolCallItem, context)
      )
      // ...
  )
}
```

### Botonic Plugin Version
**Implicit type inference**

```typescript
// runner.ts
private getToolsExecuted(
  result,  // ← No type annotation
  context: Context<TPlugins, TExtraData>
): ToolExecution[] {
  return (
    result.newItems
      ?.filter(item => item instanceof RunToolCallItem)  // ← Implicit type
      .map((item: RunToolCallItem) =>
        this.getToolExecutionInfo(item as RunToolCallItem, context)
      )
      // ...
  )
}
```

---

## Summary Table

| Feature | Ralph Lauren Version | Botonic Plugin Version |
|---------|---------------------|------------------------|
| **Prompt Files** | `prompt.ts`, `promptt.ts` with default fallback | No default prompts |
| **OpenAI Provider** | Both OpenAI + Azure | Azure only |
| **Model Configuration** | Explicit model + reasoning/text verbosity | Tool choice logic |
| **Constructor** | Positional parameters | Options object |
| **Campaign Context** | ❌ Not supported | ✅ Supported |
| **Default Instructions** | ✅ Falls back to AGENT_PROMPT | ❌ Must be provided |
| **Timeout** | 16 seconds (OpenAI) | 8 seconds (Azure) |
| **Message Sender** | SENDERS enum | String comparison |
| **Type Annotations** | Explicit | Implicit |

---

## Key Takeaways

1. **Ralph Lauren version** is more flexible with provider support and includes brand-specific defaults
2. **Botonic plugin version** is more generic and includes campaign context support for dynamic agent behavior
3. Both versions serve different purposes: one is brand-specific, the other is a reusable plugin
4. The plugin version uses a more modern options-based API pattern
5. The Ralph Lauren version has more explicit configuration options for model behavior

