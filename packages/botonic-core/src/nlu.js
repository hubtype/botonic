import axios from 'axios'
//import { AssistantV1 } from 'watson-developer-cloud/assistant/v1'

export async function getNLU(input, integrations) {
  const df_session_id = Math.random()
  let intent = null
  let confidence = 0
  let intents = []
  let entities = []
  if (!integrations) return { intent, confidence, intents, entities }
  if (integrations.dialogflow) {
    try {
      const dialogflow_resp = await axios({
        headers: {
          Authorization: 'Bearer ' + integrations.dialogflow.token,
        },
        url: 'https://api.dialogflow.com/v1/query',
        params: {
          query: input.data,
          lang: 'en',
          sessionId: df_session_id,
        },
      })
      if (dialogflow_resp && dialogflow_resp.data) {
        intent = dialogflow_resp.data.result.metadata.intentName
        entities = dialogflow_resp.data.result.parameters
      }
    } catch (e) {}
  } else if (integrations.watson) {
    // AssistantV1 only works for Node
    /*let w = integrations.watson
    let assistant = new AssistantV1({
      version: '2017-05-26',
      ...integrations.watson
    })

    assistant.message = util.promisify(assistant.message)

    try {
      let res = await assistant.message({
        input: { text: input.data },
        workspace_id: integrations.watson.workspace_id
      })
      intent = res.intents[0].intent
      confidence = res.intents[0].confidence
      intents = res.intents
      entities = res.entities
    } catch (e) {}*/
  } else if (integrations.luis) {
    const luis = integrations.luis
    try {
      const luis_resp = await axios({
        url: `https://${luis.region}.api.cognitive.microsoft.com/luis/v2.0/apps/${luis.appID}`,
        params: {
          'subscription-key': luis.endpointKey,
          q: input.data,
          verbose: true,
        },
      })
      if (luis_resp && luis_resp.data) {
        intent = luis_resp.data.topScoringIntent.intent
        confidence = luis_resp.data.topScoringIntent.score
        intents = luis_resp.data.intents
        entities = luis_resp.data.entities
      }
    } catch (e) {}
  }
  return { intent, confidence, intents, entities }
}
