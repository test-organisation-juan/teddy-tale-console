import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  Heart, 
  User, 
  BookOpen, 
  GraduationCap, 
  Gamepad2, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

const navigationItems = [
  { title: 'Kid Context', url: '/kid-context', icon: User },
  { title: 'Stories', url: '/stories', icon: BookOpen },
  { title: 'Courses', url: '/courses', icon: GraduationCap },
  { title: 'Games', url: '/games', icon: Gamepad2 },
  { title: 'Settings', url: '/settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

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
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-white" />
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