
export interface YoutubeVideoData {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      default: { url: string; width: number; height: number };
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
      standard?: { url: string; width: number; height: number };
      maxres?: { url: string; width: number; height: number };
    };
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

export const extractVideoId = (url: string): string | null => {
  const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

export const fetchYoutubeData = async (videoId: string, apiKey: string): Promise<YoutubeVideoData> => {
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,statistics`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error("No video found or API limit reached.");
  }
  
  return data.items[0];
};
