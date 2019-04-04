import axios from 'axios'
export async function segmentAPI(endpoint, headers, params) {
  try {
    await axios.post(`https://api.segment.io/v1/${endpoint}`, params, headers)
  } catch (e) {
    console.log(e)
  }
}
