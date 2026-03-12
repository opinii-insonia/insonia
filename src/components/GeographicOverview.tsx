import React, { useState, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Lead } from '@/services/api';
import { Map, MapPin } from 'lucide-react';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/brazil/brazil-states.json";

interface Props {
  leads: Lead[];
}

type MetricType = 'total' | 'avg_epworth' | 'avg_insomnia' | 'severe_count';

export const GeographicOverview: React.FC<Props> = ({ leads }) => {
  const [metric, setMetric] = useState<MetricType>('total');
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const stateData = useMemo(() => {
    const data: Record<string, { uf: string, total: number, epworthSum: number, insomniaSum: number, severe: number }> = {};
    
    leads.forEach(lead => {
      const uf = lead.estado;
      if (!uf) return;
      if (!data[uf]) data[uf] = { uf, total: 0, epworthSum: 0, insomniaSum: 0, severe: 0 };
      
      data[uf].total += 1;
      data[uf].epworthSum += lead.epworth_score;
      data[uf].insomniaSum += lead.insomnia_score;
      if (lead.overall_risk === 'ALTO') data[uf].severe += 1;
    });

    return Object.values(data).map(item => ({
      ...item,
      avgEpworth: item.epworthSum / item.total,
      avgInsomnia: item.insomniaSum / item.total,
    }));
  }, [leads]);

  const maxVal = Math.max(...stateData.map(d => {
    if (metric === 'total') return d.total;
    if (metric === 'avg_epworth') return d.avgEpworth;
    if (metric === 'avg_insomnia') return d.avgInsomnia;
    return d.severe;
  }), 1); // Evita 0

  const colorScale = scaleLinear<string>()
    .domain([0, maxVal])
    .range(
      metric === 'severe_count' ? ["#ffe4e6", "#be123c"] : // Rose para graves
      metric === 'total' ? ["#eff6ff", "#1d4ed8"] : // Blue para totais
      ["#fef3c7", "#b45309"] // Amber para médias
    );

  const getMetricValue = (uf: string) => {
    const state = stateData.find(s => s.uf === uf);
    if (!state) return 0;
    if (metric === 'total') return state.total;
    if (metric === 'avg_epworth') return state.avgEpworth;
    if (metric === 'avg_insomnia') return state.avgInsomnia;
    return state.severe;
  };

  const ranking = [...stateData].sort((a, b) => {
    if (metric === 'total') return b.total - a.total;
    if (metric === 'avg_epworth') return b.avgEpworth - a.avgEpworth;
    if (metric === 'avg_insomnia') return b.avgInsomnia - a.avgInsomnia;
    return b.severe - a.severe;
  }).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-8 relative">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-slate-600">
            <Map size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Visão Geográfica</h2>
        </div>
        
        <select 
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricType)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 mt-4 md:mt-0"
        >
          <option value="total">Total de Avaliações</option>
          <option value="severe_count">Quantidade de Casos Graves</option>
          <option value="avg_epworth">Média Escala de Epworth</option>
          <option value="avg_insomnia">Média Índice de Insônia</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAPA */}
        <div className="lg:col-span-2 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center min-h-[400px]">
          {tooltip.show && (
            <div 
              className="absolute bg-slate-900 text-white p-4 rounded-xl shadow-xl text-sm z-50 pointer-events-none transition-opacity"
              style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -120%)' }}
            >
              <div dangerouslySetInnerHTML={{ __html: tooltip.content }} />
            </div>
          )}
          
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 650, center: [-54, -15] }}
            className="w-full h-full"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const uf = geo.id; // TopoJSON do Brasil geralmente usa a sigla da UF no id
                  const val = getMetricValue(uf);
                  const stateStats = stateData.find(s => s.uf === uf);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={val > 0 ? colorScale(val) : "#e2e8f0"}
                      stroke="#ffffff"
                      strokeWidth={1}
                      onMouseEnter={(e) => {
                        const content = stateStats ? `
                          <div class="font-bold text-base border-b border-slate-700 pb-2 mb-2">${geo.properties.name} (${uf})</div>
                          <div class="space-y-1">
                            <div>Avaliações: <span class="font-bold text-blue-400">${stateStats.total}</span></div>
                            <div>Casos Graves: <span class="font-bold text-rose-400">${stateStats.severe}</span></div>
                            <div>Média Epworth: <span class="font-bold text-amber-400">${stateStats.avgEpworth.toFixed(1)}</span></div>
                            <div>Média Insônia: <span class="font-bold text-amber-400">${stateStats.avgInsomnia.toFixed(1)}</span></div>
                          </div>
                        ` : `<div class="font-bold">${geo.properties.name}</div><div class="text-slate-400 mt-1">Nenhuma avaliação</div>`;
                        
                        setTooltip({ show: true, content, x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        // Offset the tooltip based on mouse relative to the container
                        const containerRect = e.currentTarget.closest('.bg-slate-50')?.getBoundingClientRect();
                        if (containerRect) {
                           setTooltip(prev => ({ ...prev, x: e.clientX - containerRect.left, y: e.clientY - containerRect.top }));
                        }
                      }}
                      onMouseLeave={() => setTooltip(prev => ({ ...prev, show: false }))}
                      style={{
                        default: { outline: "none", transition: "all 250ms" },
                        hover: { fill: "#475569", outline: "none", cursor: "pointer", strokeWidth: 2 },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* RANKING */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center">
            <MapPin size={18} className="text-blue-500 mr-2" />
            Top 5 Estados
          </h3>
          <div className="space-y-3 flex-1">
            {ranking.length > 0 ? ranking.map((st, i) => (
              <div key={st.uf} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center">
                  <span className="w-6 text-slate-400 font-bold text-sm mr-2">{i + 1}º</span>
                  <span className="font-bold text-slate-700">{st.uf}</span>
                </div>
                <div className="font-medium text-slate-800 text-sm">
                  {metric === 'total' && `${st.total} leads`}
                  {metric === 'severe_count' && `${st.severe} graves`}
                  {metric === 'avg_epworth' && `${st.avgEpworth.toFixed(1)} pts (Epw)`}
                  {metric === 'avg_insomnia' && `${st.avgInsomnia.toFixed(1)} pts (Ins)`}
                </div>
              </div>
            )) : (
              <div className="text-center p-6 text-slate-500 text-sm border border-dashed rounded-xl border-slate-200">
                Nenhum dado registrado para gerar o ranking.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};