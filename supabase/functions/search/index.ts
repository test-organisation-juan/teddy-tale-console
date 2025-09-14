import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Sample data for search functionality
const sampleContent = [
  "Interactive storytelling with AI companions",
  "Educational games for children aged 5-12",
  "Math learning through fun activities",
  "Science experiments for curious minds",
  "Creative writing workshops",
  "Language learning with animated characters",
  "Problem-solving adventures",
  "History lessons through time travel stories",
  "Art and creativity sessions",
  "Music and rhythm games",
  "Social skills development activities",
  "Reading comprehension exercises",
  "Geography exploration quests",
  "Nature and environment awareness",
  "Coding basics for young learners",
  "Emotional intelligence building",
  "Critical thinking challenges",
  "Communication skills practice",
  "Friendship and teamwork stories",
  "Healthy habits and wellness tips"
]

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Search query received:', query)

    // Simple search algorithm - filter content that includes the query (case-insensitive)
    const searchTerm = query.toLowerCase().trim()
    const results = sampleContent.filter(content => 
      content.toLowerCase().includes(searchTerm)
    )

    // If no exact matches, try fuzzy matching by splitting query into words
    if (results.length === 0) {
      const queryWords = searchTerm.split(' ').filter(word => word.length > 2)
      const fuzzyResults = sampleContent.filter(content => 
        queryWords.some(word => content.toLowerCase().includes(word))
      )
      
      console.log('Fuzzy search results:', fuzzyResults.length)
      
      return new Response(
        JSON.stringify({ 
          results: fuzzyResults.slice(0, 10), // Limit to 10 results
          query: query,
          total: fuzzyResults.length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Direct search results:', results.length)

    return new Response(
      JSON.stringify({ 
        results: results.slice(0, 10), // Limit to 10 results
        query: query,
        total: results.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Search function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})