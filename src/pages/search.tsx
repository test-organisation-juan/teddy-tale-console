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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Search
        </h1>
        <p className="text-muted-foreground">
          Find content and resources using our intelligent search
        </p>
      </div>

      <Card className="shadow-card border-0 gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SearchIcon className="w-5 h-5 text-primary" />
            Search Content
          </CardTitle>
          <CardDescription>
            Enter your search query to find relevant content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !query.trim()}
              className="px-6"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SearchIcon className="w-4 h-4" />
              )}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((result, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-smooth border-0 gradient-card">
                <CardHeader>
                  <CardTitle className="text-base">Result {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result}</p>
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
        <Card className="shadow-card border-0 gradient-card">
          <CardContent className="py-8 text-center">
            <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No results found for "{query}". Try a different search term.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}