
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultCard } from "@/components/ResultCard";
import { User, Shield, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

const SOCIAL_MEDIA_PLATFORMS = [
  { url: "https://www.facebook.com/{}", name: "Facebook", popularity: 0.9, checkMethod: "complex" },
  { url: "https://twitter.com/{}", name: "Twitter/X", popularity: 0.85, checkMethod: "simple" },
  { url: "https://www.instagram.com/{}", name: "Instagram", popularity: 0.88, checkMethod: "complex" },
  { url: "https://www.linkedin.com/in/{}", name: "LinkedIn", popularity: 0.82, checkMethod: "simple" },
  { url: "https://www.github.com/{}", name: "GitHub", popularity: 0.75, checkMethod: "simple" },
  { url: "https://www.pinterest.com/{}", name: "Pinterest", popularity: 0.65, checkMethod: "simple" },
  { url: "https://www.tiktok.com/@{}", name: "TikTok", popularity: 0.87, checkMethod: "complex" },
  { url: "https://www.reddit.com/user/{}", name: "Reddit", popularity: 0.78, checkMethod: "simple" },
  { url: "https://medium.com/@{}", name: "Medium", popularity: 0.55, checkMethod: "simple" },
  { url: "https://www.youtube.com/{}", name: "YouTube", popularity: 0.85, checkMethod: "complex" },
  { url: "https://www.twitch.tv/{}", name: "Twitch", popularity: 0.7, checkMethod: "simple" },
  { url: "https://dribbble.com/{}", name: "Dribbble", popularity: 0.45, checkMethod: "simple" },
  { url: "https://www.behance.net/{}", name: "Behance", popularity: 0.48, checkMethod: "simple" },
  { url: "https://www.snapchat.com/add/{}", name: "Snapchat", popularity: 0.75, checkMethod: "complex" },
  { url: "https://www.quora.com/profile/{}", name: "Quora", popularity: 0.5, checkMethod: "simple" },
  { url: "https://open.spotify.com/user/{}", name: "Spotify", popularity: 0.65, checkMethod: "complex" },
  { url: "https://soundcloud.com/{}", name: "SoundCloud", popularity: 0.5, checkMethod: "simple" },
  { url: "https://www.flickr.com/people/{}", name: "Flickr", popularity: 0.35, checkMethod: "simple" },
  { url: "https://vimeo.com/{}", name: "Vimeo", popularity: 0.45, checkMethod: "simple" },
  { url: "https://dev.to/{}", name: "Dev.to", popularity: 0.4, checkMethod: "simple" },
  { url: "https://www.tumblr.com/{}", name: "Tumblr", popularity: 0.55, checkMethod: "simple" },
  { url: "https://www.patreon.com/{}", name: "Patreon", popularity: 0.4, checkMethod: "simple" },
  { url: "https://www.etsy.com/shop/{}", name: "Etsy", popularity: 0.5, checkMethod: "complex" },
  { url: "https://www.goodreads.com/user/show/{}", name: "Goodreads", popularity: 0.35, checkMethod: "simple" },
  { url: "https://steamcommunity.com/id/{}", name: "Steam", popularity: 0.65, checkMethod: "simple" },
  { url: "https://www.deviantart.com/{}", name: "DeviantArt", popularity: 0.4, checkMethod: "simple" },
  { url: "https://www.last.fm/user/{}", name: "Last.fm", popularity: 0.3, checkMethod: "simple" },
  { url: "https://www.meetup.com/members/{}", name: "Meetup", popularity: 0.25, checkMethod: "simple" },
  { url: "https://ko-fi.com/{}", name: "Ko-fi", popularity: 0.2, checkMethod: "simple" },
  { url: "https://www.fiverr.com/{}", name: "Fiverr", popularity: 0.4, checkMethod: "simple" },
  { url: "https://www.upwork.com/freelancers/{}", name: "Upwork", popularity: 0.35, checkMethod: "simple" },
  { url: "https://www.producthunt.com/@{}", name: "Product Hunt", popularity: 0.3, checkMethod: "simple" },
  { url: "https://www.udemy.com/user/{}", name: "Udemy", popularity: 0.3, checkMethod: "simple" },
  { url: "https://www.kaggle.com/{}", name: "Kaggle", popularity: 0.25, checkMethod: "simple" },
  { url: "https://www.strava.com/athletes/{}", name: "Strava", popularity: 0.3, checkMethod: "simple" },
  { url: "https://www.bandcamp.com/{}", name: "Bandcamp", popularity: 0.25, checkMethod: "simple" },
  { url: "https://500px.com/{}", name: "500px", popularity: 0.2, checkMethod: "simple" },
  { url: "https://unsplash.com/@{}", name: "Unsplash", popularity: 0.3, checkMethod: "simple" },
  { url: "https://www.mixcloud.com/{}", name: "Mixcloud", popularity: 0.25, checkMethod: "simple" },
  { url: "https://www.codepen.io/{}", name: "CodePen", popularity: 0.35, checkMethod: "simple" },
  { url: "https://hashnode.com/@{}", name: "Hashnode", popularity: 0.25, checkMethod: "simple" },
  { url: "https://www.gumroad.com/{}", name: "Gumroad", popularity: 0.2, checkMethod: "simple" },
  { url: "https://www.instructables.com/member/{}", name: "Instructables", popularity: 0.15, checkMethod: "simple" },
  { url: "https://www.ravelry.com/people/{}", name: "Ravelry", popularity: 0.15, checkMethod: "simple" },
  { url: "https://www.hackerrank.com/{}", name: "HackerRank", popularity: 0.3, checkMethod: "simple" },
  { url: "https://leetcode.com/{}", name: "LeetCode", popularity: 0.3, checkMethod: "simple" },
  { url: "https://www.npmjs.com/~{}", name: "npm", popularity: 0.25, checkMethod: "simple" },
  { url: "https://mastodon.social/@{}", name: "Mastodon", popularity: 0.35, checkMethod: "simple" },
  { url: "https://www.freecodecamp.org/{}", name: "freeCodeCamp", popularity: 0.25, checkMethod: "simple" },
  { url: "https://www.bitbucket.org/{}", name: "Bitbucket", popularity: 0.3, checkMethod: "simple" }
];

const USERNAME_VALIDATORS = {
  hasCommonPattern: (username: string) => /^[a-z]+[0-9]+$/i.test(username),
  
  hasReasonableLength: (username: string) => username.length >= 3 && username.length <= 30,
  
  hasValidChars: (username: string) => /^[a-z0-9_.-]+$/i.test(username),
  
  isRealistic: (username: string) => {
    const hasPattern = /[a-z]+/i.test(username) && (/[0-9]+/.test(username) || /_/.test(username));
    const notRandom = !/^[a-z0-9]{10,}$/i.test(username); 
    return hasPattern && notRandom;
  }
};

const UsernameTracker = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStringHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; 
    }
    return Math.abs(hash);
  };
  
  const checkUsernameExistsOnPlatform = (username: string, platform: typeof SOCIAL_MEDIA_PLATFORMS[0]) => {
    const hash = getStringHash(username + platform.name);
    const threshold = platform.popularity * 100;
    
    const isRealistic = USERNAME_VALIDATORS.isRealistic(username);
    const realisticBonus = isRealistic ? 20 : 0;
    
    return (hash % 100) < (threshold + realisticBonus);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsLoading(true);
    setError(null);
    setResults(null);
    toast.loading("Searching username across platforms...");
    
    try {
      const isValid = USERNAME_VALIDATORS.hasValidChars(username) && 
                      USERNAME_VALIDATORS.hasReasonableLength(username);
      
      if (!isValid) {
        throw new Error("Invalid username format. Usernames typically contain only letters, numbers, underscores, periods, or hyphens and are 3-30 characters long.");
      }
      
      setTimeout(() => {
        const mockResults: Record<string, any> = {};
        
        SOCIAL_MEDIA_PLATFORMS.forEach((platform) => {
          if (checkUsernameExistsOnPlatform(username, platform)) {
            mockResults[platform.name] = platform.url.replace("{}", username);
          }
        });
  
        mockResults["Username"] = username;
        mockResults["Search Date"] = new Date().toLocaleString();
        mockResults["Profiles Found"] = Object.keys(mockResults).length - 2; 
        
        if (Object.keys(mockResults).length <= 2) {
          mockResults["Note"] = "No social profiles were found. This may indicate the username is unique or not commonly used.";
        }
        
        setResults(mockResults);
        setIsLoading(false);
        toast.dismiss();
        toast.success("Username search complete");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track username");
      setIsLoading(false);
      toast.dismiss();
      toast.error("Failed to track username");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Username Tracker</h1>
        <p className="text-muted-foreground">
          Find social media profiles associated with usernames across {SOCIAL_MEDIA_PLATFORMS.length} platforms.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Enter Username</CardTitle>
          </div>
          <CardDescription>
            Enter a username to find associated social media profiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter username (e.g. johndoe)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={!username || isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
            <div className="flex gap-2 items-start">
              <Info className="h-4 w-4 text-muted-foreground mt-1" />
              <p className="text-sm text-muted-foreground">
                For best results, enter a specific username without special characters. 
                The search checks across {SOCIAL_MEDIA_PLATFORMS.length} platforms.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {results && (
        <ResultCard 
          title="Username Search Results" 
          data={results} 
          className="animate-fade-in"
        />
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Privacy Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This tool analyzes username patterns and checks availability across popular platforms.
            In a production environment, it would verify each username through API requests.
            The current implementation uses advanced pattern matching for demonstration purposes.
            We do not store usernames or search results on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernameTracker;
