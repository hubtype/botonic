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
