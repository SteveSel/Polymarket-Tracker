// app/actions.ts
'use server'

import { prisma } from '../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function saveMarketToDb(formData: FormData) {
  const id = formData.get('id') as string;
  const question = formData.get('question') as string;
  const status = formData.get('status') as string;

  await prisma.market.upsert({
    where: { id: id },
    update: { question: question, status: status },
    create: { id: id, question: question, status: status },
  });

  revalidatePath('/');
}

export async function saveWhaleToDb(address: string, alias: string = "Ballena") {
  await prisma.whale.upsert({
    where: { address: address },
    update: { alias: alias },
    create: { address: address, alias: alias },
  });
  
  revalidatePath('/');
}

export async function getSavedWhales() {
  return await prisma.whale.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getDeepWhalesData() {
  const cabecerasSeguras = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
  };

  try {
    const marketRes = await fetch("https://gamma-api.polymarket.com/markets?limit=10&active=true&order=volumeNum&ascending=false", {
      cache: "no-store",
      headers: cabecerasSeguras 
    });
    
    if (!marketRes.ok) throw new Error("Fallo en Gamma API");
    const topMarkets = await marketRes.json();
    
    if (!topMarkets || topMarkets.length === 0) return { whales: [], stats: { markets: 0, trades: 0 } };

    let allActivities: any[] = [];
    let mercadosExitosos = 0;

    for (const m of topMarkets) {
      try {
        const res = await fetch(`https://data-api.polymarket.com/trades?market=${m.conditionId}&limit=50`, {
          cache: "no-store",
          headers: cabecerasSeguras
        });
        
        if (res.ok) {
          const data = await res.json();
          const tradesArray = Array.isArray(data) ? data : (data.data || []);
          
          if (tradesArray.length > 0) {
            const tradesConTitulo = tradesArray.map((t: any) => ({
              ...t,
              injectedTitle: m.question
            }));
            allActivities.push(...tradesConTitulo);
            mercadosExitosos++;
          }
        }
      } catch (err) {
      }
    }

    console.log(`📡 Análisis completado: ${allActivities.length} trades. MUESTRA CRUDA DEL PRIMER TRADE:`, allActivities[0]);

    const whaleMap = new Map();

    allActivities.forEach((trade: any) => {
      const user = trade.user || trade.taker_address || trade.maker_address || trade.owner || trade.address;
      
      let amount = 0;
      if (trade.usdSize) {
        amount = parseFloat(trade.usdSize);
      } else if (trade.volume) {
        amount = parseFloat(trade.volume);
      } else if (trade.amount) {
         amount = parseFloat(trade.amount);
      } else if (trade.size && trade.price) {
        amount = parseFloat(trade.size) * parseFloat(trade.price);
      } else if (trade.size) {
        amount = parseFloat(trade.size); 
      }

      if (user && amount > 0 && !isNaN(amount)) {
        if (!whaleMap.has(user)) {
          whaleMap.set(user, {
            address: user,
            totalVolume: 0,
            tradeCount: 0,
            markets: new Set(),
          });
        }
        
        const whale = whaleMap.get(user);
        whale.totalVolume += amount;
        whale.tradeCount += 1;
        whale.markets.add(trade.title || trade.injectedTitle || "Mercado Top");
      }
    });

    const finalWhales = Array.from(whaleMap.values())
      .map(w => ({ ...w, markets: Array.from(w.markets) }))
      .filter(w => w.totalVolume > 10) 
      .sort((a, b) => b.totalVolume - a.totalVolume);

    console.log(`🐳 Carteras procesadas y válidas: ${finalWhales.length}`);

    return {
      whales: finalWhales.slice(0, 30),
      stats: {
        markets: mercadosExitosos,
        trades: allActivities.length
      }
    };

  } catch (error) {
    console.error("Error catastrófico en el backend:", error);
    return { whales: [], stats: { markets: 0, trades: 0 } };
  }
}