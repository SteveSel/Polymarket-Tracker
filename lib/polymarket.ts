const GAMMA_API_URL = "https://gamma-api.polymarket.com";
const DATA_API_URL = "https://data-api.polymarket.com";

export async function getMarketBySlug(slug: string) {
  try {
    const response = await fetch(`${GAMMA_API_URL}/markets?slug=${slug}`, {
      next: { revalidate: 60 } 
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.length > 0 ? data[0] : null;
    
  } catch (error) {
    console.error("Failed to fetch Polymarket data:", error);
    return null;
  }
}

export async function getUserPositions(walletAddress: string) {
  try {
    const response = await fetch(`${DATA_API_URL}/positions?user=${walletAddress}`, {
      next: { revalidate: 30 } 
    });

    if (!response.ok) {
      throw new Error(`Data API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("Failed to fetch user positions:", error);
    return [];
  }
}