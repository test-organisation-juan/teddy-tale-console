import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Eye } from 'lucide-react'

interface ContentCardProps {
  title: string
  content?: string
  description?: string
  onView: () => void
  onDelete: () => void
  icon: React.ReactNode
}

export function ContentCard({ title, content, description, onView, onDelete, icon }: ContentCardProps) {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth border-0 gradient-card group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <span className="truncate">{title}</span>
        </CardTitle>
        {(content || description) && (
          <CardDescription className="line-clamp-2">
            {content || description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button
          onClick={onView}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          onClick={onDelete}
          variant="destructive"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-smooth"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  )
}