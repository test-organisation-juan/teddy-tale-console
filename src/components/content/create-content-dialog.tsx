import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'

interface CreateContentDialogProps {
  title: string
  description: string
  onSubmit: (data: { title: string; content?: string; description?: string }) => void
  loading: boolean
  type: 'story' | 'course' | 'game'
}

export function CreateContentDialog({ title, description, onSubmit, loading, type }: CreateContentDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type === 'game') {
      onSubmit({ title: formData.title, description: formData.description })
    } else {
      onSubmit({ title: formData.title, content: formData.content })
    }
    setFormData({ title: '', content: '', description: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Create {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-0 gradient-card">
        <DialogHeader>
          <DialogTitle>Create New {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder={`Enter ${title.toLowerCase()} title`}
            />
          </div>
          
          {type === 'game' ? (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="Enter game description"
                rows={4}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder={`Enter ${title.toLowerCase()} content`}
                rows={4}
              />
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={loading}
            >
              {loading ? 'Creating...' : `Create ${title}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}