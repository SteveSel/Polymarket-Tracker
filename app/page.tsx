// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { saveWhaleToDb, getSavedWhales } from "./actions";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [activeWallet, setActiveWallet] = useState("0x2a2c53bd278c04da9962fcf96490e17f3dfb9bc1");
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [savedWhales, setSavedWhales] = useState<any[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch(`https://data-api.polymarket.com/positions?user=${activeWallet}`);
        if (response.ok) {
          const data = await response.json();
          setPositions(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchPositions();
    const intervalId = setInterval(fetchPositions, 10000);

    return () => clearInterval(intervalId);
  }, [activeWallet]);

  const loadSavedWhales = async () => {
    const whales = await getSavedWhales();
    setSavedWhales(whales);
  };

  useEffect(() => {
    loadSavedWhales();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length > 0) {
      setActiveWallet(searchInput.trim());
      setSearchInput(""); 
    }
  };

  const handleSaveWhale = async () => {
    await saveWhaleToDb(activeWallet, `Ballena ${activeWallet.substring(0, 6)}`);
    await loadSavedWhales(); // Recargamos la lista tras guardar
  };

  const totalPortfolioValue = positions.reduce(
    (sum, pos: any) => sum + parseFloat(pos.currentValue || 0), 
    0
  );

  return (
    <main className="min-h-screen p-10 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- BARRA LATERAL DE BALLENAS GUARDADAS --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Mis Ballenas</h2>
            {savedWhales.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No has guardado carteras aún.</p>
            ) : (
              <ul className="space-y-3">
                {savedWhales.map((whale) => (
                  <li key={whale.address}>
                    <button 
                      onClick={() => setActiveWallet(whale.address)}
                      className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                        activeWallet === whale.address 
                          ? "bg-blue-50 border-blue-200 text-blue-800 font-semibold" 
                          : "bg-gray-50 border-gray-100 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <div className="truncate">{whale.alias}</div>
                      <div className="text-xs font-mono text-gray-400 truncate mt-1">
                        {whale.address}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Analítica de Cartera</h1>
              <div className="flex items-center space-x-2 text-sm text-green-600 font-medium">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span>En vivo</span>
              </div>
            </div>
            
            <form onSubmit={handleSearch} className="mb-8 flex space-x-4">
              <input
                type="text"
                placeholder="Pegar dirección pública (0x...)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Rastrear
              </button>
            </form>

            {/* --- DASHBOARD WIDGETS CON GRÁFICO --- */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Tarjetas de Datos (Ocupan 1 columna cada una) */}
              <div className="flex flex-col gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl shadow-lg text-white flex-1 flex flex-col justify-center">
                  <h3 className="text-blue-100 font-medium mb-1 uppercase tracking-wider text-sm">Valor de Exposición</h3>
                  <div className="text-4xl font-black truncate" title={`$${totalPortfolioValue}`}>
                    ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col justify-center">
                  <h3 className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-sm">Mercados Activos</h3>
                  <div className="text-4xl font-black text-gray-800 mb-3">
                    {positions.length}
                  </div>
                  <button 
                    onClick={handleSaveWhale}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded border border-gray-300 transition-colors text-sm"
                  >
                    ⭐ Guardar Ballena
                  </button>
                </div>
              </div>

              {/* Gráfico de Distribución (Ocupa 2 columnas) */}
              <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64">
                <h3 className="text-gray-500 font-medium mb-2 uppercase tracking-wider text-sm">Distribución de la Cartera</h3>
                {positions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={positions
                          // Ordenamos por valor y tomamos las 5 posiciones más grandes
                          .sort((a: any, b: any) => parseFloat(b.currentValue) - parseFloat(a.currentValue))
                          .slice(0, 5)
                          .map((p: any) => ({
                            name: p.title.length > 25 ? p.title.substring(0, 25) + '...' : p.title,
                            value: parseFloat(p.currentValue)
                          }))
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >

                        {[...Array(5)].map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#1e3a8a', '#1d4ed8', '#2563eb', '#3b82f6', '#93c5fd'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin datos para graficar</div>
                )}
              </div>

            </div>
          )}

            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Posiciones Activas <span className="font-mono text-sm text-gray-500 font-normal ml-2">{activeWallet}</span>
            </h2>
            
            {isLoading ? (
              <div className="h-32 flex items-center justify-center">
                 <p className="text-gray-500 italic animate-pulse">Escaneando blockchain...</p>
              </div>
            ) : positions.length === 0 ? (
              <p className="text-gray-500 italic">No se encontraron posiciones activas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-sm uppercase tracking-wider text-gray-600">
                      <th className="p-3 border-b">Mercado</th>
                      <th className="p-3 border-b">Predicción</th>
                      <th className="p-3 border-b text-right">Acciones</th>
                      <th className="p-3 border-b text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-b font-medium max-w-xs truncate" title={pos.title}>
                          {pos.title}
                        </td>
                        <td className="p-3 border-b text-blue-600 font-bold">
                          {pos.outcome}
                        </td>
                        <td className="p-3 border-b text-right font-mono">
                          {parseFloat(pos.size).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 border-b text-green-600 font-semibold text-right font-mono">
                          ${parseFloat(pos.currentValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}