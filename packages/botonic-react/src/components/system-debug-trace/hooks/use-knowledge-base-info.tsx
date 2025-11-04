import { KnowledgebaseFailReason } from '@botonic/core'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import { ChunkIdsGroupedBySourceData } from '../../../index-types'
import { WebchatContext } from '../../../webchat/context'
import { HubtypeChunk, HubtypeSource } from '../events/knowledge-bases-types'
import { FilePdfSvg, FileWordSvg, LinkSvg } from '../icons'

interface UseKnowledgeBaseInfoParams {
  sourceIds: string[]
  chunkIds: string[]
  messageId?: string
  existingChunksWithSources?: ChunkIdsGroupedBySourceData[]
  failReason?: string
}

export const useKnowledgeBaseInfo = ({
  sourceIds,
  chunkIds,
  messageId,
  existingChunksWithSources,
  failReason,
}: UseKnowledgeBaseInfoParams) => {
  const { updateMessage, webchatState, previewUtils } =
    useContext(WebchatContext)

  // Check if we have cached data
  const hasCachedData = existingChunksWithSources !== undefined

  // Initialize state from existing chunks with sources if available
  const initialChunksWithSources = existingChunksWithSources || []
  const initialSources = initialChunksWithSources.map(item => item.source)
  const initialChunks = initialChunksWithSources.flatMap(item => item.chunks)

  const [chunksWithSources, setChunksWithSources] = useState<
    ChunkIdsGroupedBySourceData[]
  >(initialChunksWithSources)
  const [sources, setSources] = useState<HubtypeSource[]>(initialSources)
  const [chunks, setChunks] = useState<HubtypeChunk[]>(initialChunks)
  const [isLoading, setIsLoading] = useState(false)

  const updateMessageWithKnowledgeData = (
    fetchedChunksWithSources: ChunkIdsGroupedBySourceData[]
  ) => {
    if (!messageId) {
      return
    }

    const message = webchatState.messagesJSON.find(m => m.id === messageId)
    if (!message) {
      return
    }

    // Parse the existing data if it's a string (shouldn't be, but handle it)
    const parsedData =
      typeof message.data === 'string' ? JSON.parse(message.data) : message.data

    // Update with fetched chunks with sources and preserve original IDs
    const updatedData = {
      ...parsedData,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      knowledgebase_sources_ids: sourceIds,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      knowledgebase_chunks_ids: chunkIds,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      knowledge_base_chunks_with_sources: fetchedChunksWithSources,
    }

    // Update the message in webchat state - keep data as object
    updateMessage({
      ...message,
      data: updatedData,
    })
  }

  const fetchChunksWithSources = async () => {
    if (chunkIds.length === 0 || !previewUtils) return []
    setIsLoading(true)
    try {
      const fetchedChunksWithSources =
        await previewUtils.getChunkIdsGroupedBySource(chunkIds)
      return fetchedChunksWithSources
    } catch (error) {
      console.error('Error fetching chunks with sources:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getIconForSourceType = (source: HubtypeSource) => {
    switch (source.type) {
      case 'file':
        if (source.activeExtractionJob.fileName.endsWith('.pdf')) {
          return <FilePdfSvg />
        } else {
          return <FileWordSvg />
        }
      case 'url':
        return <LinkSvg />
      default:
        return null
    }
  }

  const { hasKnowledge, isFaithful } = useMemo(() => {
    const typedFailReason = failReason as unknown as KnowledgebaseFailReason

    if (typedFailReason === KnowledgebaseFailReason.NoKnowledge) {
      return {
        hasKnowledge: false,
        isFaithful: false,
      }
    }
    if (typedFailReason === KnowledgebaseFailReason.Hallucination) {
      return {
        hasKnowledge: true,
        isFaithful: false,
      }
    }
    return {
      hasKnowledge: true,
      isFaithful: true,
    }
  }, [failReason])

  useEffect(() => {
    // If we already have cached data (even if empty), don't fetch again
    if (hasCachedData) {
      return
    }

    // Only fetch if previewUtils is available
    if (!previewUtils) {
      return
    }

    // Otherwise, fetch the data
    const fetchData = async () => {
      const fetchedChunksWithSources = await fetchChunksWithSources()

      // Extract sources and chunks from chunks with sources
      const fetchedSources = fetchedChunksWithSources.map(item => item.source)
      const fetchedChunks = fetchedChunksWithSources.flatMap(
        item => item.chunks
      )

      setChunksWithSources(fetchedChunksWithSources)
      setSources(fetchedSources)
      setChunks(fetchedChunks)

      // Always update the message with the fetched data (even if empty arrays)
      // This marks the data as fetched so we don't fetch again
      updateMessageWithKnowledgeData(fetchedChunksWithSources)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    sources,
    chunks,
    chunksWithSources,
    isLoading,
    getIconForSourceType,
    hasKnowledge,
    isFaithful,
  }
}
