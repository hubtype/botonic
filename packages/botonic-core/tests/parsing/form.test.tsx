import { BotonicOutputParserTester } from '../helpers/parsing'

const tester = new BotonicOutputParserTester()
describe('Parsing Form responses', () => {
    fit('TEST: Form', () => {
    const botResponse = `
    <message typing="0" delay="0" markdown="1" type="form" form_title="test_form" form_answers="[{&quot;question&quot;:&quot;Type of Product&quot;,&quot;selected_answers&quot;:[{&quot;id&quot;:&quot;1&quot;,&quot;value&quot;:&quot;option1&quot;,&quot;answer_type&quot;:&quot;selector&quot;}]},{&quot;question&quot;:&quot;Item Condition&quot;,&quot;selected_answers&quot;:[{&quot;id&quot;:&quot;1&quot;,&quot;value&quot;:&quot;defective&quot;,&quot;answer_type&quot;:&quot;text&quot;}]},{&quot;question&quot;:&quot;Supporting Documents&quot;,&quot;selected_answers&quot;:[{&quot;id&quot;:&quot;1&quot;,&quot;value&quot;:&quot;nothing&quot;,&quot;answer_type&quot;:&quot;text&quot;}]}]"></message>
`
        const expected = [
            {
                ack: undefined,
                from: undefined,
                typing: 0,
                delay: 0,
                eventType: "message",
                type: "form",
                form_title: "test_form",
                form_answers: JSON.stringify([
                    { "question": "Type of Product", "selected_answers": [{ "id": "1", "value": "option1", "answer_type": "selector" }] },
                    { "question": "Item Condition", "selected_answers": [{ "id": "1", "value": "defective", "answer_type": "text" }] },
                    { "question": "Supporting Documents", "selected_answers": [{ "id": "1", "value": "nothing", "answer_type": "text" }] }
                ]),
            },
        ]
        tester.parseResponseAndAssert(botResponse, expected)
    })
})
