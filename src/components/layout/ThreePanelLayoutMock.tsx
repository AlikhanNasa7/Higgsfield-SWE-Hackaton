'use client'

import { useMemo } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useUIStore } from '@/lib/store'
import { mockContents } from '@/mockData'
import { ChatTranscriptMock } from '@/components/chat/ChatTranscriptMock'
import { ContentViewerMock } from '@/components/content/ContentViewerMock'
import { ContentListMock } from '@/components/content/ContentListMock'

export function ThreePanelLayoutMock() {
  const { panelSizes, setPanelSize, selectedChat, selectedContent } = useUIStore()

  // Check if the current chat has any generated content
  const hasContent = useMemo(() => {
    return selectedChat ? (mockContents[selectedChat.id]?.length ?? 0) > 0 : false
  }, [selectedChat])

  const hasSelectedContent = !!selectedContent

  // Determine layout mode
  const layoutMode = useMemo(() => {
    if (!hasContent) return 'single'
    if (!hasSelectedContent) return 'two-panel'
    return 'three-panel'
  }, [hasContent, hasSelectedContent])

  // If no content exists at all, show only transcript
  if (layoutMode === 'single') {
    return (
      <div className="h-full w-full overflow-hidden bg-white dark:bg-gray-900">
        <ChatTranscriptMock />
      </div>
    )
  }

  // If content exists but none selected, show transcript and content list
  if (layoutMode === 'two-panel') {
    return (
      <div className="h-full w-full overflow-hidden bg-white dark:bg-gray-900">
        <PanelGroup
          key="two-panel-layout"
          direction="horizontal"
          onLayout={sizes => {
            if (sizes[0] !== undefined) setPanelSize('transcript', sizes[0])
            if (sizes[1] !== undefined) setPanelSize('contents', sizes[1])
          }}
        >
          {/* Transcript Panel */}
          <Panel id="transcript-two" defaultSize={60} minSize={30} maxSize={80}>
            <div className="h-full w-full border-r border-gray-200 dark:border-gray-700 overflow-hidden">
              <ChatTranscriptMock />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />

          {/* Contents List Panel */}
          <Panel id="contents-two" defaultSize={40} minSize={20} maxSize={70}>
            <div className="h-full w-full overflow-hidden">
              <ContentListMock />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    )
  }

  // If content exists and one is selected, show all three panels
  return (
    <div className="h-full w-full overflow-hidden bg-white dark:bg-gray-900">
      <PanelGroup
        key="three-panel-layout"
        direction="horizontal"
        onLayout={sizes => {
          if (sizes[0] !== undefined) setPanelSize('transcript', sizes[0])
          if (sizes[1] !== undefined) setPanelSize('viewer', sizes[1])
          if (sizes[2] !== undefined) setPanelSize('contents', sizes[2])
        }}
      >
        {/* Transcript Panel */}
        <Panel id="transcript-three" defaultSize={panelSizes.transcript} minSize={25} maxSize={60}>
          <div className="h-full w-full border-r border-gray-200 dark:border-gray-700 overflow-hidden">
            <ChatTranscriptMock />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />

        {/* Content Viewer Panel */}
        <Panel id="viewer-three" defaultSize={panelSizes.viewer} minSize={20} maxSize={50}>
          <div className="h-full w-full border-r border-gray-200 dark:border-gray-700 overflow-hidden">
            <ContentViewerMock />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />

        {/* Contents List Panel */}
        <Panel id="contents-three" defaultSize={panelSizes.contents} minSize={20} maxSize={40}>
          <div className="h-full w-full overflow-hidden">
            <ContentListMock />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
