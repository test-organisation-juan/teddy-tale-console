import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Gamepad2, 
  Settings,
  LogOut,
  Menu,
  X,
  Baby,
  MessageSquare,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import talkingTeddyLogo from '@/assets/talking-teddy-logo.png'

const navigationItems = [
  { title: 'Kid Context', url: '/kid-context', icon: User },
  { title: 'Stories', url: '/stories', icon: BookOpen },
  { title: 'Courses', url: '/courses', icon: GraduationCap },
  { title: 'Games', url: '/games', icon: Gamepad2 },
  { title: 'Search', url: '/search', icon: Search },
  { title: 'Settings', url: '/settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const [kidData, setKidData] = useState({
    kid_name: '',
    kid_age: '',
    user_prompt: ''
  })

  useEffect(() => {
    loadKidData()
  }, [])

  const loadKidData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const data = await api.getUserData(session.user.id)
        setKidData({
          kid_name: data.kid_name || '',
          kid_age: data.kid_age || '',
          user_prompt: data.user_prompt || ''
        })
      }
    } catch (error) {
      console.error('Error loading kid data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: 'Logout Failed',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 gradient-card border-r border-border/50 
        transform transition-transform duration-300 ease-in-out
        ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        md:relative md:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border/50">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src={talkingTeddyLogo} 
                alt="Talking Teddy Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-primary bg-clip-text text-transparent">
                Talking Teddy
              </h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth
                    ${isActive 
                      ? 'gradient-primary text-white shadow-glow' 
                      : 'hover:bg-muted/50 text-foreground'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Kid Information */}
          {(kidData.kid_name || kidData.kid_age || kidData.user_prompt) && (
            <div className="p-4 border-t border-border/50 space-y-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Kid Profile
              </div>
              
              {kidData.kid_name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium">Name:</span>
                  <span className="text-muted-foreground">{kidData.kid_name}</span>
                </div>
              )}
              
              {kidData.kid_age && (
                <div className="flex items-center gap-2 text-sm">
                  <Baby className="w-4 h-4 text-primary" />
                  <span className="font-medium">Age:</span>
                  <span className="text-muted-foreground">{kidData.kid_age}</span>
                </div>
              )}
              
              {kidData.user_prompt && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <span className="font-medium">Prompt:</span>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                      {kidData.user_prompt}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logout button */}
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  )
}