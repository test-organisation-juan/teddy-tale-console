import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { ContentCard } from '@/components/content/content-card'
import { CreateContentDialog } from '@/components/content/create-content-dialog'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Gamepad2 } from 'lucide-react'

interface Game {
  id: string
  title: string
  description: string
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      const gameIds = await api.getGames()
      const gamesData = await Promise.all(
        gameIds.map((id: string) => api.getGame(id))
      )
      setGames(gamesData)
    } catch (error) {
      console.error('Error loading games:', error)
    }
  }

  const handleCreateGame = async (data: { title: string; description?: string }) => {
    setLoading(true)
    try {
      await api.createGame(data.title, data.description || '')
      toast({
        title: 'Success',
        description: 'Game created successfully',
      })
      loadGames()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create game',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGame = async (gameId: string) => {
    try {
      await api.deleteGame(gameId)
      toast({
        title: 'Success',
        description: 'Game deleted successfully',
      })
      loadGames()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete game',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Games Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage interactive games for Talking Teddy
          </p>
        </div>
        <CreateContentDialog
          title="Game"
          description="Create a new interactive game for children"
          onSubmit={handleCreateGame}
          loading={loading}
          type="game"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <ContentCard
            key={game.id}
            title={game.title}
            description={game.description}
            onView={() => setSelectedGame(game)}
            onDelete={() => handleDeleteGame(game.id)}
            icon={<Gamepad2 className="w-4 h-4 text-white" />}
          />
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">No games yet</h3>
          <p className="text-sm text-muted-foreground">Create your first game to get started</p>
        </div>
      )}

      {/* View Game Dialog */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="sm:max-w-[600px] border-0 gradient-card">
          <DialogHeader>
            <DialogTitle>{selectedGame?.title}</DialogTitle>
            <DialogDescription>Game Description</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {selectedGame?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}