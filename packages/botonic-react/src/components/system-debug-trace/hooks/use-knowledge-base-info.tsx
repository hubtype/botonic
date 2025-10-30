import { KnowledgebaseFailReason } from '@botonic/core'
import React, { useContext, useEffect, useMemo, useState } from 'react'

import { WebchatContext } from '../../../webchat/context'
import { HubtypeChunk, HubtypeSource } from '../events/knowledge-bases-types'
import { FilePdfSvg, FileWordSvg, LinkSvg } from '../icons'

interface UseKnowledgeBaseInfoParams {
  sourceIds: string[]
  chunkIds: string[]
  messageId?: string
  existingSources?: HubtypeSource[]
  existingChunks?: HubtypeChunk[]
  failReason?: string
}

export const useKnowledgeBaseInfo = ({
  sourceIds,
  chunkIds,
  messageId,
  existingSources,
  existingChunks,
  failReason,
}: UseKnowledgeBaseInfoParams) => {
  const { updateMessage, webchatState, previewUtils } =
    useContext(WebchatContext)

  // Check if we have cached data (existingSources/existingChunks are defined, even if empty arrays)
  const hasCachedData =
    existingSources !== undefined || existingChunks !== undefined

  const [sources, setSources] = useState<HubtypeSource[]>(existingSources || [])
  const [chunks, setChunks] = useState<HubtypeChunk[]>(existingChunks || [])
  const [isLoading, setIsLoading] = useState(false)

  const updateMessageWithKnowledgeData = (
    fetchedSources: HubtypeSource[],
    fetchedChunks: HubtypeChunk[]
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

    // Update with fetched sources and chunks, preserving the original IDs
    const updatedData = {
      ...parsedData,
      // Preserve the original IDs (they're already in parsedData, but being explicit)
      // These IDs are needed for reference and debugging
      // eslint-disable-next-line @typescript-eslint/naming-convention
      knowledge_base_sources: fetchedSources,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      knowledge_base_chunks: fetchedChunks,
    }

    // Update the message in webchat state - keep data as object
    updateMessage({
      ...message,
      data: updatedData,
    })
  }

  const fetchSources = async () => {
    if (sourceIds.length === 0 || !previewUtils) return []
    setIsLoading(true)
    try {
      const fetchedSources = await previewUtils.getSourcesByIds(sourceIds)
      return fetchedSources
    } catch (error) {
      console.error('Error fetching sources:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChunks = async () => {
    if (chunkIds.length === 0 || !previewUtils) return []

    try {
      const fetchedChunks = await previewUtils.getChunksByIds(chunkIds)
      return fetchedChunks
    } catch (error) {
      console.error('Error fetching chunks:', error)
      return []
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
      const [fetchedSources, fetchedChunks] = await Promise.all([
        fetchSources(),
        fetchChunks(),
      ])

      setSources(fetchedSources)
      setChunks(fetchedChunks)

      // Always update the message with the fetched data (even if empty arrays)
      // This marks the data as fetched so we don't fetch again
      updateMessageWithKnowledgeData(fetchedSources, fetchedChunks)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    sources,
    chunks,
    isLoading,
    getIconForSourceType,
    hasKnowledge,
    isFaithful,
  }
}
