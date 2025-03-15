"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import parse from "html-react-parser";


interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
}

interface Post {
  id: string;
  title?: string;
  content?: string;
  author?: User;
}

interface JobListing {
  id: string;
  title?: string;
  location?: string;
  shortDescription?: string;
}

type SearchResult = {
  type: 'user' | 'post' | 'listing';
  id: string;
  title?: string;
  name?: string;
  description?: string;
  data: User | Post | JobListing;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const encodedSearchQuery = encodeURI(searchQuery);

    router.push(`/search?q=${encodedSearchQuery}`);
  };

  useEffect(() => {
    // Debounce function to prevent too many API calls
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performDynamicSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performDynamicSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/search`, {
        params: { 
          q: searchQuery, 
          page: 1, 
          pageSize: 3, 
          from: "dynamic"
        },
      });

      console.log(response.data)
      
      const data = response.data;
      const combinedResults: SearchResult[] = [
        ...data.users.map((user: User): SearchResult => ({
          type: 'user',
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          data: user
        })),
        ...data.posts.map((post: Post): SearchResult => ({
          type: 'post',
          id: post.id,
          title: post.title,
          description: post.content?.substring(0, 100),
          data: post
        })),
        ...data.listings.map((listing: JobListing): SearchResult => ({
          type: 'listing',
          id: listing.id,
          title: listing.title,
          description: listing.shortDescription || "",
          data: listing
        }))
      ];
      // Take only the first 3 results total across all categories
      setSearchResults(combinedResults.slice(0, 3));
    } catch (error) {
      console.error("Error performing dynamic search:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const dynamicSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const navigateToResult = (result: SearchResult) => {
    setSearchQuery("");
    
    switch (result.type) {
      case 'user':
        router.push(`/ec/${result.id}`);
        break;
      case 'post':
        router.push(`/posts/${result.id}`);
        break;
      case 'listing':
        router.push(`/job/${result.id}`);
        break;
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <form onSubmit={onSearch} className="w-full">
        <input
          value={searchQuery}
          onChange={dynamicSearch}
          placeholder="Search"
          className="px-5 py-1 sm:px-5 sm:py-3 flex-1 text-zinc-800 bg-zinc-200 rounded-xl w-full"
        />
      </form>
      
      {searchQuery.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-md z-10 w-full md:w-[150%] md:left-1/2 md:transform md:-translate-x-1/2 max-w-2xl">
          {isLoading ? (
            <div className="p-3 text-center">Loading...</div>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <li 
                  key={index} 
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigateToResult(result)}
                >
                  <div className="flex items-start gap-3 overflow-hidden">
                    {result.type === 'user' && (
                      <>
                        <div className="h-8 w-8 bg-gray-300 rounded-full mr-2 flex-shrink-0">
                          {result.id && (
                            <img 
                              src={`https://econnectbucket.s3.amazonaws.com/image/${result.id}`} 
                              alt={result.name} 
                              className="h-full w-full rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{result.name}</p>
                          <p className="text-xs text-gray-500">User</p>
                        </div>
                      </>
                    )}
                    
                    {result.type === 'post' && (
                      <div className="w-full">
                        <p className="font-medium">{result.title}</p>
                        {result.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{parse(result.description)}</p>
                        )}
                        <p className="text-xs text-gray-500">Post</p>
                      </div>
                    )}
                    
                    {result.type === 'listing' && (
                      <div className="w-full">
                        <p className="font-medium">{result.title}</p>
                        {result.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">{parse(result.description)}</p>
                        )}
                        <p className="text-xs text-gray-500">Job Listing</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
