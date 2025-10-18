'use client'

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useUIStore } from '@/lib/store'
import { ChatTranscript } from '@/components/chat/ChatTranscript'
import { ContentViewer } from '@/components/content/ContentViewer'
import { ContentList } from '@/components/content/ContentList'

export function ThreePanelLayout() {
  const { panelSizes, setPanelSize } = useUIStore()

  const handlePanelResize = (sizes: number[]) => {
    setPanelSize('transcript', sizes[0])
    setPanelSize('viewer', sizes[1])
    setPanelSize('contents', sizes[2])
  }

  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      <PanelGroup direction="horizontal" onLayout={handlePanelResize}>
        {/* Transcript Panel */}
        <Panel defaultSize={panelSizes.transcript} minSize={25} maxSize={60}>
          <div className="h-full border-r border-gray-200 dark:border-gray-700">
            <ChatTranscript />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />

        {/* Content Viewer Panel */}
        <Panel defaultSize={panelSizes.viewer} minSize={20} maxSize={50}>
          <div className="h-full border-r border-gray-200 dark:border-gray-700">
            <ContentViewer />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" />

        {/* Contents List Panel */}
        <Panel defaultSize={panelSizes.contents} minSize={20} maxSize={40}>
          <div className="h-full">
            <ContentList />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
