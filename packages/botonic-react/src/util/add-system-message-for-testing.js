/**
 * Temporal utility for testing system debug trace messages.
 * Can be removed once testing is done.
 *
 * Three ai_agent variants:
 * 1. getDefaultSystemMessage()  – only retrieve_knowledge (Query + Knowledge gathered + Executed tools)
 * 2. getDefault2SystemMessage() – only other tools (e.g. get_current_weather: Tool arguments JSON + Tool results)
 * 3. getDefault3SystemMessage() – retrieve_knowledge + other tools (both layouts)
 *
 * Usage in dev: window.addSystemMessage(getDefaultSystemMessage()) etc.
 */
import { EventAction, INPUT } from '@botonic/core'

const TOOLS_EXECUTED = [
  {
    tool_name: 'retrieve_knowledge',
    tool_arguments: {
      query: 'Ralph Lauren product categories',
    },
    tool_results:
      '["- [Hotels](https://hotels.easyjet.com/index.html?aid=347810&lang=en&label=easy-homepage-navtab-hotels2;selected_currency=GBP)\\n    - [Apartments](https://hotels.easyjet.com/apartments/index.html?aid=347810&lang=en&label=easy-homepage-navtab-apartments;selected_currency=GBP)\\n    - [Resorts](https://hotels.easyjet.com/resorts/index.html?aid=347810&lang=en&label=easy-homepage-navtab-resorts;selected_currency=GBP)\\n    - [Villas](https://hotels.easyjet.com/villas/index.html?aid=347810&lang=en&label=easy-homepage-navtab-villas;selected_currency=GBP)\\n    - [Hostels](https://hotels.easyjet.com/hostels/index.html?aid=347810&lang=en&label=easy-homepage-navtab-hostels;selected_currency=GBP)\\n    - [Bed & Breakfast](https://hotels.easyjet.com/bed-and-breakfast/index.html?aid=347810&lang=en&label=easy-homepage-navtab-bnbs;selected_currency=GBP)\\n  + Top hotel destinations","- [Business](https://www.easyjet.com/en/business)\\n    - [Why fly with us for business?](https://www.easyjet.com/en/routemap)\\n    - [Business fares](https://www.easyjet.com/en/business/business-fares)\\n    - [Distribution charter](https://www.easyjet.com/en/business/distribution-charter)\\n    - [Group bookings](https://www.easyjet.com/en/book/groups?link_megadrop)\\n    - [Travel trade partners](https://www.easyjet.com/en/business/travel-trade-partners)\\n  + Everything you need","- [easyJet Plus](https://plus.easyjet.com/?language=en&partnerid=Business&utm_medium=CMS&utm_campaign=MegaNav&utm_source=Business&utm_content=EN)\\n    - [Airport lounges](https://parking.easyjet.com/airport-lounges&utm_source=ej_CMS&utm_medium=EN_Homepage&utm_term=Business&utm_content=colC_link7&utm_campaign=MegaNav)\\n    - [Airport transfers](https://airporttransfers.easyjet.com/en/transfers?utm_source=ej_CMS&utm_medium=EN_Homepage&utm_term=Transport&utm_content=colD_link3&utm_campaign=MegaNav)\\n    - [Business hotels](https://hotels.easyjet.com/business/index.html?aid=347806&lang=en&selected_currency=GBP&label=easy-homepage-navtab-themes2label=easy-homepage-navtab-business)\\n    - [Mobile boarding pass](https://www.easyjet.com/en/mobile/mobile-boarding-passes)\\n  + Keep up to date","+ Car Rental\\n\\n    - [All car rental deals](https://cars.easyjet.com/en/?clientId=530590&utm_medium=Mega_nav_bar&utm_source=easyjet&utm_campaign=All_car_rental_deals)\\n    - [Great cars in top destinations](https://cars.easyjet.com/en/?clientId=530590&utm_medium=Mega_nav_bar&utm_source=easyjet&utm_campaign=Great_cars_in_top_destinations)\\n    - [Help and info](https://cars.easyjet.com/en/managebooking?clientId=530590&utm_medium=Mega_nav_bar&utm_source=easyjet&utm_campaign=help_and_info)\\n  + Other services","- [Business](https://www.easyjet.com/en/business)\\n    - [Why fly with us for business?](https://www.easyjet.com/en/routemap)\\n    - [Business fares](https://www.easyjet.com/en/business/business-fares)\\n    - [Distribution charter](https://www.easyjet.com/en/business/distribution-charter)\\n    - [Group bookings](https://www.easyjet.com/en/book/groups?link_megadrop)\\n    - [Travel trade partners](https://www.easyjet.com/en/business/travel-trade-partners)\\n  + Everything you need"]',
    knowledgebase_sources_ids: ['019a5ec4-f008-7081-9261-709f444f7106'],
    knowledgebase_chunks_ids: [
      '019a5ec5-0881-7d41-ba91-f64e4f8d390a',
      '019a5ec5-0bdf-7992-a8da-890f34d01906',
      '019a5ec5-0c4e-7b50-965c-a959a0230cad',
      '019cc1fa-d9ca-7333-9a63-eccb75b1f5be',
      '019cc1fa-dd06-73b1-a6c2-8bd298896ce0',
    ],
  },
]

/** (2) Only other tools: e.g. get_current_weather (no retrieve_knowledge). */
const ONLY_OTHER_TOOLS_DATA = {
  action: EventAction.AiAgent,
  flow_node_content_id: 'only other tools',
  tools_executed: [
    {
      tool_name: 'get_current_weather',
      tool_arguments: { cityName: 'Barcelona' },
      tool_results:
        '{"location":{"name":"Barcelona","region":"Catalonia","country":"Spain","lat":41.3833,"lon":2.1833,"tz_id":"Europe/Madrid","localtime_epoch":1772799878,"localtime":"2026-03-06 13:24"},"current":{"temp_c":15.4,"temp_f":59.7,"condition":{"text":"Mist","icon":"//cdn.weatherapi.com/weather/64x64/day/143.png","code":1030},...}',
    },
  ],
  input_guardrails_triggered: [],
  output_guardrails_triggered: [],
  exit: false,
  error: false,
}

/** (3) retrieve_knowledge + other tools (tools_recommender). */
const RETRIEVE_AND_OTHER_TOOLS_DATA = {
  action: 'ai_agent',
  format_version: 5,
  user_locale: 'en-GB',
  user_country: 'GB',
  system_locale: 'en',
  flow_thread_id: '019cc31b-9af8-7336-b6b5-79b6ee21fea3',
  flow_id: '0a2b5ce4-9cbe-518c-b70c-17544eea0365',
  flow_name: 'AI Agents',
  flow_node_id: '019cc2bc-1092-7649-a37e-af51f152266f',
  flow_node_content_id: 'knowledge + other tools',
  flow_node_is_meaningful: true,
  memory_length: 3,
  input_message_id: '019cc31b-a86e-7121-9886-2842f0f9ed2c',
  input_guardrails_triggered: [],
  output_guardrails_triggered: [],
  exit: false,
  error: false,
  tools_executed: [
    {
      tool_name: 'retrieve_knowledge',
      tool_arguments: { query: 'current weather in Barcelona' },
      tool_results:
        '"[\\"[![easyJet Homepage](/ejcms/cache/medialibrary/Images/Global/A-Header-Graphics/easyJet-main-web-header-logo2.jpg)](/en/)\\\\n\\\\nEnglish\\\\nFrançais\\\\nDeutsch\\\\nItaliano\\\\nFrançais (Suisse)\\\\nDeutsch (Schweiz)\\\\nCastellano\\\\nNederlands\\\\nPortugues\\\\nCatalà\\\\nČesky\\\\nDansk\\\\nEλληνικά\\\\nMagyarul\\\\nPolski\\\\nTürkçe\\\\nעברית\\\\n\\\\nEnglish\\\\n![](/ejcms/cache/medialibrary/Images/Global/Flags/Flag_of_the_United_Kingdom_W22H13px.png)\\",\\"* [![](/ejcms/cache/medialibrary/Images/Global/Flags/Flag_of_Portugal_W22H13px.png)\\\\n  Portugues](https://www.easyjet.com/pt)\\\\n* [![](/ejcms/cache/medialibrary/Images/Global/Flags/Flag_of_Catalonia_W22H13px.png)\\\\n  Català](https://www.easyjet.com/ca)\\\\n...\\",\\"- [City breaks](https://www.easyjet.com/en/inspireme?im=...)\\\\n  + Top destination guides\\\\n\\\\n    - [Barcelona](https://www.easyjet.com/en/cheap-flights/spain/barcelona)\\\\n...\\",\\"Deutsch](https://www.easyjet.com/de)\\\\n* [![](/ejcms/...)\\\\n  Italiano](https://www.easyjet.com/it)\\\\n...\\",\\"Català](https://www.easyjet.com/ca)\\\\n...\\\\nWhat would you like to know?\\\\n============================\\\\n\\\\nTop searches:\\"]"',
      knowledgebase_sources_ids: [
        '019c51d0-ace4-7833-85d6-0b795ac0d1ce',
        '019c767f-04da-74a3-be96-aff56b0528c4',
        '019c4d75-265f-79c2-bf9f-a3754b0a2272',
      ],
      knowledgebase_chunks_ids: [
        '019cc272-5837-7842-8814-635a4de5c8c4',
        '019cc272-59b2-78a3-996f-2ff501f52551',
        '019cc272-6319-7b60-9a60-6a9b0f92324f',
        '019cc272-6a50-7110-80b7-38ecd4e8dde4',
        '019cc272-6bdb-7013-9737-0a532c165e48',
      ],
    },
    {
      tool_name: 'get_current_weather',
      tool_arguments: { cityName: 'Barcelona' },
      tool_results:
        '{"location":{"name":"Barcelona","region":"Catalonia","country":"Spain","lat":41.3833,"lon":2.1833,"tz_id":"Europe/Madrid","localtime_epoch":1772799878,"localtime":"2026-03-06 13:24"},"current":{"last_updated_epoch":1772799300,"last_updated":"2026-03-06 13:15","temp_c":15.4,"temp_f":59.7,"is_day":1,"condition":{"text":"Mist","icon":"//cdn.weatherapi.com/weather/64x64/day/143.png","code":1030},"wind_mph":16.8,"wind_kph":27,"wind_degree":76,"wind_dir":"ENE","pressure_mb":1013,"pressure_in":29.91,"precip_mm":0.21,"precip_in":0.01,"humidity":94,"cloud":100,"feelslike_c":15.4,"feelslike_f":59.7,"windchill_c":10.2,"windchill_f":50.5,"heatindex_c":12.7,"heatindex_f":54.8,"dewpoint_c":11.9,"dewpoint_f":53.4,"vis_km":2.5,"vis_miles":1,"uv":3,"gust_mph":22.2,"gust_kph":35.7},...truncated',
    },
  ],
  bot_version: '71',
}

/**
 * (1) Only retrieve_knowledge – Query, Knowledge gathered, Executed tools (no tool results).
 * Use in dev: window.addSystemMessage(getDefaultSystemMessage())
 */
export function getDefaultSystemMessage() {
  return {
    type: INPUT.SYSTEM_DEBUG_TRACE,
    data: {
      action: EventAction.AiAgent,
      flow_node_content_id: 'only retrieve_knowledge',
      tools_executed: TOOLS_EXECUTED,
      input_guardrails_triggered: [],
      output_guardrails_triggered: [],
      exit: false,
      error: false,
    },
  }
}

/**
 * (2) Only other tools (e.g. get_current_weather) – Tool arguments (JSON) + Tool results.
 * Use in dev: window.addSystemMessage(getDefault2SystemMessage())
 */
export function getDefault2SystemMessage() {
  return {
    type: INPUT.SYSTEM_DEBUG_TRACE,
    data: ONLY_OTHER_TOOLS_DATA,
  }
}

/**
 * (3) retrieve_knowledge + other tools – Query, Knowledge gathered, Executed tools + other tools with JSON args/results.
 * Use in dev: window.addSystemMessage(getDefault3SystemMessage())
 */
export function getDefault3SystemMessage() {
  return {
    type: INPUT.SYSTEM_DEBUG_TRACE,
    data: RETRIEVE_AND_OTHER_TOOLS_DATA,
  }
}
