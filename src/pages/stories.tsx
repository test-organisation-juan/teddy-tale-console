import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { ContentCard } from '@/components/content/content-card'
import { CreateContentDialog } from '@/components/content/create-content-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { BookOpen } from 'lucide-react'

interface Story {
  id: string
  title: string
  content: string
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      const storyIds = await api.getStories()
      const storiesData = await Promise.all(
        storyIds.map((id: string) => api.getStory(id))
      )
      setStories(storiesData)
    } catch (error) {
      console.error('Error loading stories:', error)
    }
  }

  const handleCreateStory = async (data: { title: string; content?: string }) => {
    setLoading(true)
    try {
      await api.createStory(data.title, data.content || '')
      toast({
        title: 'Success',
        description: 'Story created successfully',
      })
      loadStories()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create story',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStory = async (storyId: string) => {
    try {
      await api.deleteStory(storyId)
      toast({
        title: 'Success',
        description: 'Story deleted successfully',
      })
      loadStories()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete story',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Stories Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage interactive stories for Talking Teddy
          </p>
        </div>
        <CreateContentDialog
          title="Story"
          description="Create a new interactive story for children"
          onSubmit={handleCreateStory}
          loading={loading}
          type="story"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => (
          <ContentCard
            key={story.id}
            title={story.title}
            content={story.content}
            onView={() => setSelectedStory(story)}
            onDelete={() => handleDeleteStory(story.id)}
            icon={<BookOpen className="w-4 h-4 text-white" />}
          />
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No stories yet</h3>
          <p className="text-sm text-muted-foreground">Create your first story to get started</p>
        </div>
      )}

      {/* View Story Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="sm:max-w-[600px] border-0 gradient-card">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
            <DialogDescription>Story Content</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedStory?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}