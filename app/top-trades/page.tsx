// app/top-trades/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getDeepWhalesData } from "../actions";

export default function TopTrades() {
  const [whales, setWhales] = useState<any[]>([]);
  const [stats, setStats] = useState({ markets: 0, trades: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getDeepWhalesData();
      setWhales(data.whales);
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 45000); // Actualizar cada 45s
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-10 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <div className="mb-8 flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Escáner de Profundidad (Top 50)</h1>
              <p className="text-gray-500 mt-2">
                Analizando simultáneamente los 50 mercados con más volumen global.
              </p>
            </div>
            <div className="flex space-x-4">
               <div className="text-right px-4 border-r">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mercados</p>
                  <p className="text-2xl font-black text-gray-800">{stats.markets}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trades Analizados</p>
                  <p className="text-2xl font-black text-blue-600">{stats.trades}</p>
               </div>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4">
               <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-500 font-bold animate-pulse">Escanenado 50 mercados en tiempo real...</p>
            </div>
          ) : whales.length === 0 ? (
            <div className="p-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500 italic">No se detectaron acumulaciones significativas en este bloque de datos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {whales.map((whale, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white border rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-blue-600 font-bold">{whale.address.substring(0, 10)}...</span>
                      {whale.totalVolume > 5000 && (
                        <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Fuego 🔥</span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {whale.markets.slice(0, 2).map((m: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">
                          {m.substring(0, 40)}...
                        </span>
                      ))}
                      {whale.markets.length > 2 && (
                        <span className="text-[10px] text-gray-400">+{whale.markets.length - 2} más</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Operaciones</p>
                      <p className="font-bold text-gray-700">{whale.tradeCount}</p>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Volumen Total</p>
                      <p className="text-2xl font-black text-green-600">
                        ${whale.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}