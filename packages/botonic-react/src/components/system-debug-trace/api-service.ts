import axios from 'axios'
const HUBTYPE_API_URL = process.env.HUBTYPE_API_URL || 'https://api.hubtype.com'

/* eslint-disable @typescript-eslint/naming-convention */
interface HubtypeExtractionJob {
  id: string
  file_name: string
  file_url: string
  url: string | null
  is_active: boolean
  status: string
  hash: string
  created_at: string
}

export interface HubtypeSource {
  id: string
  name: string
  type: string
  scraping_country_code: string | null
  created_at: string
  created_by: string
  last_updated_at: string
  last_updated_by: string
  active_extraction_job: HubtypeExtractionJob
  last_extraction_job: HubtypeExtractionJob
}

export interface HubtypeChunk {
  id: string
  text: string
}

export class DebugHubtypeApiService {
  private hubtypeApiUrl = HUBTYPE_API_URL
  private token: string
  private headers: Record<string, string>
  private sourcesCache: Map<string, HubtypeSource> = new Map()
  private chunksCache: Map<string, HubtypeChunk> = new Map()

  constructor(token: string = '30d23696750fdaf9356164552ebafe') {
    this.token = token
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    }
  }

  async getSourcesByIds(ids: string[]): Promise<HubtypeSource[]> {
    // Check cache first
    const cachedSources: HubtypeSource[] = []
    const uncachedIds: string[] = []

    for (const id of ids) {
      const cached = this.sourcesCache.get(id)
      if (cached) {
        cachedSources.push(cached)
      } else {
        uncachedIds.push(id)
      }
    }

    // If all sources are cached, return them
    if (uncachedIds.length === 0) {
      return cachedSources
    }

    // Fetch missing sources from API
    try {
      const { data } = await axios.get(
        `${this.hubtypeApiUrl}/external/v1/knowledge_base/sources/?ids=${uncachedIds.join(',')}`,
        { headers: this.headers }
      )

      if (data.results.length === 0) {
        return cachedSources
      }

      const fetchedSources = data.results.map((source: any) => ({
        id: source.id,
        name: source.name,
        type: source.type,
        scraping_country_code: source.scraping_country_code,
        created_at: source.created_at,
        created_by: source.created_by,
        last_updated_at: source.last_updated_at,
        last_updated_by: source.last_updated_by,
        active_extraction_job: source.active_extraction_job,
        last_extraction_job: source.last_extraction_job,
      }))

      // Cache the fetched sources
      for (const source of fetchedSources) {
        this.sourcesCache.set(source.id, source)
      }

      return [...cachedSources, ...fetchedSources]
    } catch (error) {
      console.error(error)
      return cachedSources
    }
  }

  async getChunksByIds(ids: string[]): Promise<HubtypeChunk[]> {
    // Check cache first
    const cachedChunks: HubtypeChunk[] = []
    const uncachedIds: string[] = []

    for (const id of ids) {
      const cached = this.chunksCache.get(id)
      if (cached) {
        cachedChunks.push(cached)
      } else {
        uncachedIds.push(id)
      }
    }

    // If all chunks are cached, return them
    if (uncachedIds.length === 0) {
      return cachedChunks
    }

    // Fetch missing chunks from API
    try {
      const { data } = await axios.get(
        `${this.hubtypeApiUrl}/external/v1/knowledge_base/chunks/?ids=${uncachedIds.join(',')}`,
        { headers: this.headers }
      )

      if (data.results.length === 0) {
        return cachedChunks
      }

      const fetchedChunks = data.results.map((chunk: any) => ({
        id: chunk.id,
        text: chunk.text,
      }))

      // Cache the fetched chunks
      for (const chunk of fetchedChunks) {
        this.chunksCache.set(chunk.id, chunk)
      }

      return [...cachedChunks, ...fetchedChunks]
    } catch (error) {
      console.error(error)
      return cachedChunks
    }
  }
}
