import { useState } from 'react'
import { Search as SearchIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) {
      toast({
        title: 'Search Query Required',
        description: 'Please enter a search query',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    
    try {
      const response = await api.search(query.trim())
      console.log(response)
      const results = response.results

      setResults(results)
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Search Failed',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight gradient-primary bg-clip-text text-transparent animate-float">
          Magical Search
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover amazing stories, games, and educational content with our intelligent search
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-elegant border-0 gradient-card hover:shadow-glow transition-all duration-500">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <SearchIcon className="w-6 h-6 text-primary animate-glow" />
              Search Content
            </CardTitle>
            <CardDescription className="text-base">
              Enter your search query to discover magical content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input
                type="text"
                placeholder="Search for magical adventures..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 h-12 px-6 text-base rounded-xl border-2 border-border hover:border-primary focus:border-primary transition-all duration-300 shadow-card"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !query.trim()}
                variant="gradient"
                className="px-8 h-12 text-base font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <SearchIcon className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {results.length > 0 && (
        <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
          <h2 className="text-2xl font-semibold text-primary text-center">
            ✨ Search Results ({results.length}) ✨
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow hover:scale-105 transition-all duration-300 border-0 gradient-card group">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent group-hover:animate-pulse" />
                    Magic Result {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{result}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching...
          </div>
        </div>
      )}

      {!isLoading && results.length === 0 && query && (
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant border-0 gradient-card">
            <CardContent className="py-12 text-center">
              <SearchIcon className="w-16 h-16 mx-auto text-primary mb-6 animate-float" />
              <h3 className="text-xl font-semibold text-primary mb-2">No Magic Found</h3>
              <p className="text-muted-foreground">
                No results found for "<span className="font-semibold text-accent">{query}</span>". 
                Try a different magical search term!
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}