import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { User, Baby, MessageSquare, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function KidContext() {
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    kid_name: '',
    kid_age: '',
    user_prompt: ''
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const data = await api.getUserData(session.user.id)
        setUserData({
          kid_name: data.kid_name || '',
          kid_age: data.kid_age || '',
          user_prompt: data.user_prompt || ''
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleUpdateKidName = async () => {
    setLoading(true)
    try {
      await api.updateKidName(userData.kid_name)
      toast({
        title: 'Success',
        description: 'Kid name updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update kid name',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateKidAge = async () => {
    setLoading(true)
    try {
      await api.updateKidAge(userData.kid_age)
      toast({
        title: 'Success',
        description: 'Kid age updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update kid age',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUserPrompt = async () => {
    setLoading(true)
    try {
      await api.updateUserPrompt(userData.user_prompt)
      toast({
        title: 'Success',
        description: 'User prompt updated successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user prompt',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Kid Context Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure personalized settings for your child's Talking Teddy experience
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Kid Name */}
        <Card className="shadow-card hover:shadow-card-hover transition-smooth border-0 gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              Kid Name
            </CardTitle>
            <CardDescription>
              Set your child's name for personalized interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kid_name">Name</Label>
              <Input
                id="kid_name"
                value={userData.kid_name}
                onChange={(e) => setUserData({ ...userData, kid_name: e.target.value })}
                placeholder="Enter kid's name"
              />
            </div>
            <Button
              onClick={handleUpdateKidName}
              disabled={loading}
              variant="gradient"
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Name
            </Button>
          </CardContent>
        </Card>

        {/* Kid Age */}
        <Card className="shadow-card hover:shadow-card-hover transition-smooth border-0 gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Baby className="w-4 h-4 text-white" />
              </div>
              Kid Age
            </CardTitle>
            <CardDescription>
              Set your child's age for age-appropriate content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="kid_age">Age</Label>
              <Input
                id="kid_age"
                value={userData.kid_age}
                onChange={(e) => setUserData({ ...userData, kid_age: e.target.value })}
                placeholder="Enter kid's age"
              />
            </div>
            <Button
              onClick={handleUpdateKidAge}
              disabled={loading}
              variant="gradient"
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Age
            </Button>
          </CardContent>
        </Card>

        {/* User Prompt */}
        <Card className="shadow-card hover:shadow-card-hover transition-smooth border-0 gradient-card md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              User Prompt
            </CardTitle>
            <CardDescription>
              Customize the system prompt for personalized responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user_prompt">Custom Prompt</Label>
              <Textarea
                id="user_prompt"
                value={userData.user_prompt}
                onChange={(e) => setUserData({ ...userData, user_prompt: e.target.value })}
                placeholder="Enter custom system prompt..."
                rows={4}
              />
            </div>
            <Button
              onClick={handleUpdateUserPrompt}
              disabled={loading}
              variant="gradient"
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Update Prompt
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}