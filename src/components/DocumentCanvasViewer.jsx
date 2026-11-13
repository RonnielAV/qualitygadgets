import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Move, Smartphone, Monitor } from 'lucide-react';

export default function DocumentCanvasViewer({ children, docType }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoomMode, setZoomMode] = useState('fit'); // 'fit' | 'actual' | 'custom'
  const [customZoom, setCustomZoom] = useState(1);
  const [measuredHeight, setMeasuredHeight] = useState(1050);

  // Reference base width for high-fidelity A4 layout
  const BASE_WIDTH = 750;
  // A4 ratio 1414 x 2000 => base height ~1060px
  const DEFAULT_BASE_HEIGHT = 1060;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
      }
      if (contentRef.current) {
        const h = contentRef.current.scrollHeight || contentRef.current.offsetHeight;
        if (h > 500) {
          setMeasuredHeight(h);
        }
      }
    };

    updateDimensions();
    // Re-check after images/fonts load
    const timer = setTimeout(updateDimensions, 400);

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [docType]);

  // Calculate fit-to-screen scale factor
  const isMobileOrTablet = containerWidth > 0 && containerWidth < (BASE_WIDTH + 32);
  const padding = containerWidth < 450 ? 8 : 24;
  const availableWidth = Math.max(260, containerWidth - padding);
  const fitScale = isMobileOrTablet ? Math.min(1, availableWidth / BASE_WIDTH) : 1;

  // Active scale
  let currentScale = 1;
  if (zoomMode === 'fit') {
    currentScale = fitScale;
  } else if (zoomMode === 'actual') {
    currentScale = 1;
  } else {
    currentScale = customZoom;
  }

  const handleZoomIn = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.min(1.4, +(prev + 0.15).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomMode('custom');
    setCustomZoom((prev) => Math.max(0.35, +(prev - 0.15).toFixed(2)));
  };

  const handleSetFit = () => {
    setZoomMode('fit');
    setCustomZoom(fitScale);
  };

  const handleSetActual = () => {
    setZoomMode('actual');
    setCustomZoom(1.0);
  };

  const baseHeight = measuredHeight > 0 ? measuredHeight : DEFAULT_BASE_HEIGHT;
  const scaledWidth = Math.round(BASE_WIDTH * currentScale);
  const scaledHeight = Math.round(baseHeight * currentScale);

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center">
      {/* Mobile/Tablet Zoom Toolbar - Floating Friendly Controls */}
      <div className="no-print w-full max-w-[760px] mb-2 px-1 flex flex-wrap items-center justify-between gap-1.5 text-xs">
        {/* Mode Selector */}
        <div className="inline-flex items-center rounded-xl bg-stone-200/80 p-0.5 border border-stone-300 shadow-2xs">
          <button
            type="button"
            onClick={handleSetFit}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
              zoomMode === 'fit'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Ajustar documento al ancho de la pantalla sin cortes"
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-[11px]">Ajustar Pantalla</span>
          </button>

          <button
            type="button"
            onClick={handleSetActual}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
              zoomMode === 'actual'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Ver al tamaño real 100% con desplazamiento libre"
          >
            <Monitor className="w-3.5 h-3.5 text-stone-700" />
            <span className="text-[11px]">Tamaño Real (100%)</span>
          </button>
        </div>

        {/* Zoom Steppers & Percent Badge */}
        <div className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded-xl border border-stone-300 shadow-2xs">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            title="Alejar"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-mono font-bold text-stone-700 min-w-[36px] text-center">
            {Math.round(currentScale * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
            title="Acercar"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Viewport Frame with overflow handling */}
      <div 
        className="w-full flex justify-center overflow-x-auto overflow-y-visible px-1 pb-4 transition-all"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="relative transition-all duration-150 origin-top flex justify-center"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            maxWidth: currentScale < 1 ? '100%' : 'none',
          }}
        >
          <div
            ref={contentRef}
            className="origin-top"
            style={{
              width: `${BASE_WIDTH}px`,
              transform: `scale(${currentScale})`,
              transformOrigin: 'top center',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

