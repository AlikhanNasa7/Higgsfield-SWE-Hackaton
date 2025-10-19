'use client'

import { useMemo } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useUIStore } from '@/lib/store'
import { mockContents } from '@/mockData'
import { ChatTranscript } from '@/components/chat/ChatTranscript'
import { ContentViewer } from '@/components/content/ContentViewer'
import { ContentList } from '@/components/content/ContentList'

function ResizeHandle() {
  return <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />
}

export function ThreePanelLayoutMock() {
  const { panelSizes, setPanelSize, selectedChat, selectedContent } = useUIStore()

  // Check if the current chat has any generated content
  const hasContent = useMemo(() => {
    return selectedChat ? selectedContent !== null : false
  }, [selectedChat, selectedContent])

  // If no content exists at all, show only transcript
  if (!hasContent) {
    return (
      <div className="h-full w-full overflow-hidden">
        <ChatTranscript />
      </div>
    )
  }
  // If content exists but none selected, show transcript and content list
  if (!selectedContent) {
    return (
      <div className="h-full w-full overflow-hidden">
        <PanelGroup
          key="two-panel-layout"
          direction="horizontal"
          onLayout={sizes => {
            if (sizes[0] !== undefined) setPanelSize('transcript', sizes[0])
            if (sizes[1] !== undefined) setPanelSize('contents', sizes[1])
          }}
        >
          <Panel id="transcript-two" defaultSize={60} minSize={30} maxSize={80}>
            <div className="h-full w-full border-r border-border overflow-hidden">
              <ChatTranscript />
            </div>
          </Panel>

          <ResizeHandle />

          <Panel id="contents-two" defaultSize={40} minSize={20} maxSize={70}>
            <div className="h-full w-full overflow-hidden">
              <ContentList />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    )
  }

  // If content exists and one is selected, show all three panels
  return (
    <div className="h-full w-full overflow-hidden">
      <PanelGroup
        key="three-panel-layout"
        direction="horizontal"
        onLayout={sizes => {
          if (sizes[0] !== undefined) setPanelSize('transcript', sizes[0])
          if (sizes[1] !== undefined) setPanelSize('viewer', sizes[1])
        }}
      >
        <Panel id="transcript-three" defaultSize={panelSizes.transcript} minSize={25} maxSize={60}>
          <div className="h-full w-full border-r border-border overflow-hidden">
            <ChatTranscript />
          </div>
        </Panel>

        <ResizeHandle />

        <Panel id="content-panel" defaultSize={50} minSize={35} maxSize={70}>
          <div className="h-full w-full overflow-hidden">
            <PanelGroup
              direction="vertical"
              onLayout={sizes => {
                // Update the combined viewer and contents panel sizes
                if (sizes[0] !== undefined && sizes[1] !== undefined) {
                  const totalSize = sizes[0] + sizes[1]
                  const viewerRatio = sizes[0] / totalSize
                  const contentsRatio = sizes[1] / totalSize

                  // Update the individual panel sizes proportionally
                  const combinedSize = 50 // Fixed combined size
                  setPanelSize('viewer', combinedSize * viewerRatio)
                  setPanelSize('contents', combinedSize * contentsRatio)
                }
              }}
            >
              <Panel id="viewer-vertical" defaultSize={65} minSize={40} maxSize={85}>
                <div className="h-full w-full border-b border-border overflow-hidden">
                  <ContentViewer />
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 transition-colors" />

              <Panel id="contents-vertical" defaultSize={35} minSize={15} maxSize={60}>
                <div className="h-full w-full overflow-hidden">
                  <ContentList />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
