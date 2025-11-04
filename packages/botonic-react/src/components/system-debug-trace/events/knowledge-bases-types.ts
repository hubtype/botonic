interface HubtypeExtractionJob {
  id: string
  fileName: string
  fileUrl: string
  url: string | null
  isActive: boolean
  status: string
  hash: string
  createdAt: string
}

export interface HubtypeSource {
  id: string
  name: string
  type: string
  scrapingCountryCode: string | null
  createdAt: string
  createdBy: string
  lastUpdatedAt: string
  lastUpdatedBy: string
  activeExtractionJob: HubtypeExtractionJob
  lastExtractionJob: HubtypeExtractionJob
}

export interface HubtypeChunk {
  id: string
  text: string
}

export interface ChunkIdsGroupedBySourceData {
  source: HubtypeSource
  chunks: HubtypeChunk[]
}
