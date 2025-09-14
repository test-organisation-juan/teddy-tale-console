import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { ContentCard } from '@/components/content/content-card'
import { CreateContentDialog } from '@/components/content/create-content-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { GraduationCap } from 'lucide-react'

interface Course {
  id: string
  title: string
  content: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      const courseIds = await api.getCourses()
      const coursesData = await Promise.all(
        courseIds.map((id: string) => api.getCourse(id))
      )
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  const handleCreateCourse = async (data: { title: string; content?: string }) => {
    setLoading(true)
    try {
      await api.createCourse(data.title, data.content || '')
      toast({
        title: 'Success',
        description: 'Course created successfully',
      })
      loadCourses()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create course',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await api.deleteCourse(courseId)
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
      })
      loadCourses()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Courses Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage educational courses for Talking Teddy
          </p>
        </div>
        <CreateContentDialog
          title="Course"
          description="Create a new educational course for children"
          onSubmit={handleCreateCourse}
          loading={loading}
          type="course"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <ContentCard
            key={course.id}
            title={course.title}
            content={course.content}
            onView={() => setSelectedCourse(course)}
            onDelete={() => handleDeleteCourse(course.id)}
            icon={<GraduationCap className="w-4 h-4 text-white" />}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No courses yet</h3>
          <p className="text-sm text-muted-foreground">Create your first course to get started</p>
        </div>
      )}

      {/* View Course Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[600px] border-0 gradient-card">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title}</DialogTitle>
            <DialogDescription>Course Content</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedCourse?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}