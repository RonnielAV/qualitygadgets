'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Upload, RefreshCw, Layers, DollarSign, Check, X, Sparkles, Copy, Tag, Building2 } from 'lucide-react';
import { useStore, Product, ProductOption, ProductVariant } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface ProductFormProps {
  initialProduct?: Product | null;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ initialProduct, onSaveSuccess, onCancel }: ProductFormProps) {
  const { brands, categories, addProduct, updateProduct, addCategory, addBrand } = useStore();
  const safeBrands = brands || [];
  const safeCategories = categories || [];

  // Basic Form State
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [brandId, setBrandId] = useState(
    initialProduct?.brandId || (typeof initialProduct?.brand === 'object' ? (initialProduct.brand as any)?.id : initialProduct?.brand) || safeBrands[0]?.id || ''
  );
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || (typeof initialProduct?.category === 'object' ? (initialProduct.category as any)?.id : initialProduct?.category) || safeCategories[0]?.id || ''
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(initialProduct?.thumbnailUrl || '');
  const [isDeal, setIsDeal] = useState(!!initialProduct?.isDeal);
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured !== false);
  const [isUploading, setIsUploading] = useState(false);

  // Fast Creation Modals
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isNewBrandModalOpen, setIsNewBrandModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');

  // Single / Base Pricing
  const firstVariant = initialProduct?.variants?.[0];
  const [basePriceDop, setBasePriceDop] = useState(firstVariant?.priceDop || 25000);
  const [baseComparePrice, setBaseComparePrice] = useState(firstVariant?.compareAtPriceDop || 28000);
  const [baseCostPrice, setBaseCostPrice] = useState(firstVariant?.costPriceDop || 19000);
  const [baseStock, setBaseStock] = useState(firstVariant?.physicalStock ?? 10);
  const [baseSku, setBaseSku] = useState(firstVariant?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);

  // Interactive Variant Builder
  const [hasVariants, setHasVariants] = useState((initialProduct?.options?.length || 0) > 0 || (initialProduct?.variants?.length || 0) > 1);
  const [options, setOptions] = useState<ProductOption[]>(
    Array.isArray(initialProduct?.options) && initialProduct.options.length > 0
      ? initialProduct.options
      : [{ name: 'Color', values: ['Titanio Natural', 'Titanio Negro'] }]
  );
  const [generatedVariants, setGeneratedVariants] = useState<ProductVariant[]>(
    Array.isArray(initialProduct?.variants) && initialProduct.variants.length > 0
      ? initialProduct.variants
      : []
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default brand/category if not set
  useEffect(() => {
    if (!brandId && safeBrands.length > 0) {
      setBrandId(safeBrands[0].id);
    }
    if (!categoryId && safeCategories.length > 0) {
      setCategoryId(safeCategories[0].id);
    }
  }, [safeBrands, safeCategories, brandId, categoryId]);

  // Handle Photo Upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setThumbnailUrl(data.url);
      } else {
        alert(data.message || 'Error al subir imagen');
      }
    } catch {
      alert('Error en subida');
    } finally {
      setIsUploading(false);
    }
  };

  // Crear categoría rápida
  const handleSaveFastCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      description: newCatDesc.trim(),
    });
    // Set active category to the name
    setTimeout(() => {
      const found = (useStore.getState().categories || []).find((c) => c.name.toLowerCase() === newCatName.trim().toLowerCase());
      if (found) setCategoryId(found.id);
    }, 50);
    setNewCatName('');
    setNewCatDesc('');
    setIsNewCategoryModalOpen(false);
  };

  // Crear marca rápida
  const handleSaveFastBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    addBrand({
      name: newBrandName.trim(),
      description: newBrandDesc.trim(),
    });
    setTimeout(() => {
      const found = (useStore.getState().brands || []).find((b) => b.name.toLowerCase() === newBrandName.trim().toLowerCase());
      if (found) setBrandId(found.id);
    }, 50);
    setNewBrandName('');
    setNewBrandDesc('');
    setIsNewBrandModalOpen(false);
  };

  // Preset Option Helpers
  const handleAddPresetOption = (name: string, defaultValues: string[]) => {
    const exists = options.some((o) => o.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert(`La opción "${name}" ya está agregada.`);
      return;
    }
    setOptions([...options, { name, values: defaultValues }]);
    setHasVariants(true);
  };

  // Add new Custom Option Axis
  const handleAddOption = () => {
    setOptions([...options, { name: '', values: [] }]);
    setHasVariants(true);
  };

  const handleRemoveOption = (index: number) => {
    const updated = options.filter((_, idx) => idx !== index);
    setOptions(updated);
    if (updated.length === 0 && generatedVariants.length <= 1) {
      setHasVariants(false);
    }
  };

  const handleOptionNameChange = (index: number, name: string) => {
    const updated = [...options];
    updated[index].name = name;
    setOptions(updated);
  };

  const handleOptionValuesChange = (index: number, commaSeparatedValues: string) => {
    const updated = [...options];
    const vals = commaSeparatedValues
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    updated[index].values = vals;
    setOptions(updated);
  };

  // CARTESIAN PRODUCT GENERATOR FOR VARIANTS
  const generateCartesianVariants = () => {
    const validOptions = options.filter((o) => (o?.name || '').trim().length > 0 && Array.isArray(o?.values) && o.values.length > 0);

    if (validOptions.length === 0) {
      alert('Por favor agrega al menos una opción con valores separados por coma (ej. Negro, Azul).');
      return;
    }

    const cartesian = (arrays: string[][]): string[][] => {
      return arrays.reduce(
        (acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])),
        [[]] as string[][]
      );
    };

    const valueArrays = validOptions.map((o) => o.values);
    const combinations = cartesian(valueArrays);

    const newVariants: ProductVariant[] = combinations.map((combo, idx) => {
      const optionMap: Record<string, string> = {};
      validOptions.forEach((opt, optIdx) => {
        optionMap[opt.name] = combo[optIdx];
      });

      const title = combo.join(' / ');
      const skuCode = combo.map((c) => c.substring(0, 3).toUpperCase()).join('-');
      const sku = `${baseSku || 'SKU'}-${skuCode}-${idx + 1}`;

      const existing = generatedVariants.find((v) => v.title === title);

      return {
        id: existing?.id || `var-${Date.now()}-${idx}`,
        productId: initialProduct?.id || 'new-prod',
        sku: existing?.sku || sku,
        title,
        priceDop: existing?.priceDop || basePriceDop,
        compareAtPriceDop: existing?.compareAtPriceDop || baseComparePrice,
        costPriceDop: existing?.costPriceDop || baseCostPrice,
        physicalStock: existing?.physicalStock ?? baseStock,
        committedStock: existing?.committedStock || 0,
        availableStock: existing?.availableStock ?? baseStock,
        imageUrls: [thumbnailUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
        options: optionMap,
      };
    });

    setGeneratedVariants(newVariants);
    setHasVariants(true);
  };

  // Añadir Variante Manual Individual
  const handleAddManualVariant = () => {
    const count = generatedVariants.length + 1;
    const newVar: ProductVariant = {
      id: `var-manual-${Date.now()}`,
      productId: initialProduct?.id || 'prod',
      sku: `${baseSku || 'SKU'}-V${count}`,
      title: `Variante Personalizada #${count}`,
      priceDop: basePriceDop,
      compareAtPriceDop: baseComparePrice,
      costPriceDop: baseCostPrice,
      physicalStock: baseStock,
      committedStock: 0,
      availableStock: baseStock,
      imageUrls: [thumbnailUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      options: { Versión: `V${count}` },
    };
    setGeneratedVariants([...generatedVariants, newVar]);
    setHasVariants(true);
  };

  const handleDuplicateVariant = (idx: number) => {
    const source = generatedVariants[idx];
    if (!source) return;
    const cloned: ProductVariant = {
      ...source,
      id: `var-clone-${Date.now()}`,
      title: `${source.title} (Copia)`,
      sku: `${source.sku}-C`,
    };
    setGeneratedVariants([...generatedVariants, cloned]);
  };

  const handleRemoveVariant = (idx: number) => {
    const updated = generatedVariants.filter((_, i) => i !== idx);
    setGeneratedVariants(updated);
    if (updated.length === 0) {
      setHasVariants(false);
    }
  };

  const handleUpdateVariantField = (idx: number, field: keyof ProductVariant, value: any) => {
    const updated = [...generatedVariants];
    (updated[idx] as any)[field] = value;
    if (field === 'physicalStock') {
      updated[idx].availableStock = Math.max(0, Number(value) - (updated[idx].committedStock || 0));
    }
    setGeneratedVariants(updated);
  };

  // Aplicar Precio y Stock Masivo a Todas las Variantes
  const handleApplyMassPrice = () => {
    const p = prompt('Ingresa el precio DOP para aplicar a TODAS las variantes:', basePriceDop.toString());
    if (p && !isNaN(Number(p))) {
      setGeneratedVariants(generatedVariants.map((v) => ({ ...v, priceDop: Number(p) })));
    }
  };

  const handleApplyMassStock = () => {
    const s = prompt('Ingresa el stock físico para aplicar a TODAS las variantes:', baseStock.toString());
    if (s && !isNaN(Number(s))) {
      const stockNum = Number(s);
      setGeneratedVariants(
        generatedVariants.map((v) => ({
          ...v,
          physicalStock: stockNum,
          availableStock: Math.max(0, stockNum - (v.committedStock || 0)),
        }))
      );
    }
  };

  // Guardar Producto en Zustand Store
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('El título del gadget es obligatorio.');
      return;
    }

    const defaultImg =
      thumbnailUrl ||
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

    let finalVariants: ProductVariant[] = [];

    if (hasVariants && generatedVariants.length > 0) {
      finalVariants = generatedVariants;
    } else {
      finalVariants = [
        {
          id: firstVariant?.id || `var-${Date.now()}`,
          productId: initialProduct?.id || 'prod-single',
          sku: baseSku,
          title: 'Estándar',
          priceDop: Number(basePriceDop),
          compareAtPriceDop: Number(baseComparePrice),
          costPriceDop: Number(baseCostPrice),
          physicalStock: Number(baseStock),
          committedStock: 0,
          availableStock: Number(baseStock),
          imageUrls: [defaultImg],
          options: {},
        },
      ];
    }

    const selectedBrandObj = safeBrands.find((b) => b.id === brandId);
    const selectedCatObj = safeCategories.find((c) => c.id === categoryId);

    if (initialProduct?.id) {
      updateProduct(initialProduct.id, {
        brandId,
        brand: selectedBrandObj?.name || 'Marca',
        categoryId,
        category: selectedCatObj?.name || 'Categoría',
        title,
        description,
        thumbnailUrl: defaultImg,
        images: [defaultImg],
        isDeal,
        isFeatured,
        options: hasVariants ? options : [],
        variants: finalVariants,
      });
    } else {
      addProduct({
        brandId,
        brand: selectedBrandObj?.name || 'Marca',
        categoryId,
        category: selectedCatObj?.name || 'Categoría',
        title,
        description,
        status: 'published',
        thumbnailUrl: defaultImg,
        images: [defaultImg],
        ratingAvg: 5.0,
        ratingCount: 1,
        isDeal,
        isFeatured,
        options: hasVariants ? options : [],
        variants: finalVariants,
      });
    }

    onSaveSuccess();
  };

  const profitDop = basePriceDop - baseCostPrice;
  const marginPercentage = basePriceDop > 0 ? Math.round((profitDop / basePriceDop) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs text-text-pure">
      {/* 1. INFORMACIÓN PRINCIPAL & MULTIMEDIA */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-black text-white border-b border-dark-border/80 pb-2 flex items-center gap-2">
          <span>1. Información Principal & Multimedia</span>
        </h4>

        {/* Carga de Foto */}
        <div className="rounded-2xl border border-dashed border-dark-border p-4 bg-dark-obsidian/70">
          <label className="font-bold text-white block mb-2">Foto Principal del Gadget (WebP)</label>
          <div className="flex items-center gap-4">
            {thumbnailUrl ? (
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-brand-cyan bg-dark-elevated">
                <Image src={thumbnailUrl} alt="Preview" fill className="object-contain" />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-dark-elevated text-text-muted">
                <Upload className="h-6 w-6" />
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 rounded-xl bg-brand-indigo px-4 py-2 text-xs font-black text-brand-cyan border border-brand-cyan/40 hover:bg-brand-indigo/80 cursor-pointer"
              >
                {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{isUploading ? 'Subiendo foto...' : 'Subir Foto desde tu Equipo'}</span>
              </button>
              <input
                type="url"
                placeholder="O pega una URL de imagen..."
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-surface p-2.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-text-muted">Título Comercial del Gadget *</label>
          <input
            type="text"
            required
            placeholder="Ej. iPhone 16 Pro Max Titanium 256GB"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-text-muted">Marca (Brands Manager) *</label>
              <button
                type="button"
                onClick={() => setIsNewBrandModalOpen(true)}
                className="text-[11px] font-black text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>+ Nueva Marca</span>
              </button>
            </div>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
            >
              {safeBrands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b?.name || b?.slug || 'Marca'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-text-muted">Categoría *</label>
              <button
                type="button"
                onClick={() => setIsNewCategoryModalOpen(true)}
                className="text-[11px] font-black text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>+ Nueva Categoría</span>
              </button>
            </div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
            >
              {safeCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c?.name || c?.handle || 'Categoría'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-text-muted">Descripción Enriquecida</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Características clave, compatibilidad y especificaciones técnicas..."
            className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* 2. PRECIOS & MARGEN DE GANANCIA */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-dark-border/80 pb-2">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>2. Precios Base & Margen de Ganancia (DOP)</span>
          </h4>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-[11px] font-black text-emerald-400">
            Margen: {marginPercentage}% (Ganancia: RD$ {profitDop.toLocaleString('es-DO')})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Precio de Venta DOP *</label>
            <input
              type="number"
              required
              value={basePriceDop}
              onChange={(e) => setBasePriceDop(Number(e.target.value))}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Precio Comparación (Tachado)</label>
            <input
              type="number"
              value={baseComparePrice}
              onChange={(e) => setBaseComparePrice(Number(e.target.value))}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-bold text-text-muted focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Costo por Artículo (DOP)</label>
            <input
              type="number"
              value={baseCostPrice}
              onChange={(e) => setBaseCostPrice(Number(e.target.value))}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-bold text-text-muted focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">SKU Base</label>
            <input
              type="text"
              value={baseSku}
              onChange={(e) => setBaseSku(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-mono font-bold text-brand-cyan focus:border-brand-cyan focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isDeal}
              onChange={(e) => setIsDeal(e.target.checked)}
              className="rounded accent-brand-magenta h-4 w-4"
            />
            <span className="font-black text-brand-magenta">Activar como Oferta Flash</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded accent-brand-cyan h-4 w-4"
            />
            <span className="font-bold text-white">Destacar en Portada</span>
          </label>
        </div>
      </div>

      {/* 3. CONSTRUCTOR DE OPCIONES & MATRIZ DE VARIANTES */}
      <div className="rounded-3xl border border-brand-indigo bg-dark-surface p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dark-border/80 pb-3">
          <div>
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-cyan" />
              <span>3. Constructor de Variantes & Opciones de Producto</span>
            </h4>
            <p className="text-[11px] text-text-muted mt-0.5">
              Crea opciones (Color, Almacenamiento, Tamaño), calcula el producto cartesiano o añade variantes manuales con SKU y stock independiente.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAddOption}
              className="flex items-center gap-1 rounded-xl bg-dark-obsidian border border-dark-border px-3 py-1.5 text-xs font-bold text-brand-cyan hover:border-brand-cyan cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Opción Personalizada</span>
            </button>
            <button
              type="button"
              onClick={handleAddManualVariant}
              className="flex items-center gap-1 rounded-xl bg-dark-obsidian border border-brand-cyan/40 px-3 py-1.5 text-xs font-bold text-brand-cyan hover:bg-brand-cyan/10 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Variante Manual</span>
            </button>
            <button
              type="button"
              onClick={generateCartesianVariants}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-4 py-1.5 text-xs font-black text-white shadow-glow-purple cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Calcular Matriz Cartesiana</span>
            </button>
          </div>
        </div>

        {/* Presets Rápidos de Opciones */}
        <div className="p-3.5 rounded-2xl bg-dark-obsidian/60 border border-dark-border flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-text-muted mr-1">⚡ Presets Rápidos:</span>
          <button
            type="button"
            onClick={() => handleAddPresetOption('Color', ['Titanio Natural', 'Titanio Negro', 'Azul Titanio', 'Blanco'])}
            className="rounded-lg border border-dark-border bg-dark-elevated px-2.5 py-1 text-[11px] font-bold text-text-pure hover:border-brand-cyan cursor-pointer"
          >
            🎨 Colores
          </button>
          <button
            type="button"
            onClick={() => handleAddPresetOption('Almacenamiento', ['128GB', '256GB', '512GB', '1TB'])}
            className="rounded-lg border border-dark-border bg-dark-elevated px-2.5 py-1 text-[11px] font-bold text-text-pure hover:border-brand-cyan cursor-pointer"
          >
            💾 Almacenamiento
          </button>
          <button
            type="button"
            onClick={() => handleAddPresetOption('Tamaño', ['41mm', '45mm', '49mm Ultra'])}
            className="rounded-lg border border-dark-border bg-dark-elevated px-2.5 py-1 text-[11px] font-bold text-text-pure hover:border-brand-cyan cursor-pointer"
          >
            📏 Tamaño Caja
          </button>
          <button
            type="button"
            onClick={() => handleAddPresetOption('Conectividad', ['GPS', 'GPS + Cellular 5G'])}
            className="rounded-lg border border-dark-border bg-dark-elevated px-2.5 py-1 text-[11px] font-bold text-text-pure hover:border-brand-cyan cursor-pointer"
          >
            📶 Conectividad
          </button>
        </div>

        {/* Lista de Ejes / Opciones */}
        <div className="space-y-3">
          {options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center gap-3 p-3 rounded-2xl bg-dark-obsidian border border-dark-border">
              <div className="w-1/3">
                <label className="text-[10px] text-text-muted font-bold block mb-1">Nombre de la Opción</label>
                <input
                  type="text"
                  placeholder="Ej. Color, Capacidad..."
                  value={opt?.name || ''}
                  onChange={(e) => handleOptionNameChange(optIdx, e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-surface p-2 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="text-[10px] text-text-muted font-bold block mb-1">Valores (separados por coma)</label>
                <input
                  type="text"
                  placeholder="Ej. Negro, Azul, Titanio Natural"
                  value={Array.isArray(opt?.values) ? opt.values.join(', ') : ''}
                  onChange={(e) => handleOptionValuesChange(optIdx, e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-surface p-2 text-xs font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveOption(optIdx)}
                className="mt-4 p-2 text-brand-magenta hover:bg-brand-magenta/20 rounded-xl transition-all cursor-pointer"
                title="Eliminar opción"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Tabla de Variantes Generadas / Creadas */}
        {hasVariants && generatedVariants.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">
                Total Variantes Activas: <strong className="text-brand-cyan">{generatedVariants.length}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyMassPrice}
                  className="rounded-lg border border-dark-border bg-dark-elevated px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:border-emerald-400 cursor-pointer"
                >
                  💵 Precio a Todas
                </button>
                <button
                  type="button"
                  onClick={handleApplyMassStock}
                  className="rounded-lg border border-dark-border bg-dark-elevated px-2.5 py-1 text-[11px] font-bold text-brand-cyan hover:border-brand-cyan cursor-pointer"
                >
                  📦 Stock a Todas
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-dark-border bg-dark-obsidian">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-dark-border bg-dark-elevated text-[10px] uppercase font-black text-text-muted">
                  <tr>
                    <th className="px-4 py-3">Variante</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Precio DOP</th>
                    <th className="px-4 py-3">Stock Físico</th>
                    <th className="px-4 py-3">Disponible</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/60 font-medium">
                  {generatedVariants.map((v, vIdx) => (
                    <tr key={v.id || vIdx} className="hover:bg-dark-elevated/30">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={v?.title || ''}
                          onChange={(e) => handleUpdateVariantField(vIdx, 'title', e.target.value)}
                          className="w-full rounded-lg border border-dark-border bg-dark-surface p-1.5 text-xs font-bold text-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={v?.sku || ''}
                          onChange={(e) => handleUpdateVariantField(vIdx, 'sku', e.target.value)}
                          className="w-28 rounded-lg border border-dark-border bg-dark-surface p-1.5 text-[11px] font-mono text-brand-cyan focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={v?.priceDop ?? 0}
                          onChange={(e) => handleUpdateVariantField(vIdx, 'priceDop', Number(e.target.value))}
                          className="w-24 rounded-lg border border-dark-border bg-dark-surface p-1.5 text-[11px] font-bold text-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={v?.physicalStock ?? 10}
                          onChange={(e) => handleUpdateVariantField(vIdx, 'physicalStock', Number(e.target.value))}
                          className="w-20 rounded-lg border border-dark-border bg-dark-surface p-1.5 text-[11px] font-bold text-emerald-400 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 font-black text-emerald-400">
                        {v?.availableStock ?? v?.physicalStock ?? 10}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicateVariant(vIdx)}
                            className="p-1.5 text-text-muted hover:text-white rounded-lg hover:bg-dark-surface"
                            title="Duplicar variante"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(vIdx)}
                            className="p-1.5 text-brand-magenta hover:bg-brand-magenta/20 rounded-lg"
                            title="Eliminar variante"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-dark-border bg-dark-obsidian px-5 py-3 font-bold text-text-muted hover:text-white cursor-pointer"
        >
          Cancelar
        </button>
        <PrimaryButton type="submit" variant="primary" className="py-3 px-8 text-xs font-black shadow-glow-purple cursor-pointer">
          <Check className="h-4 w-4 mr-2" />
          <span>Guardar en Store & Publicar en Tienda</span>
        </PrimaryButton>
      </div>

      {/* MODAL CREAR CATEGORÍA RÁPIDA */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-cyan" />
                <span>Crear Nueva Categoría</span>
              </h3>
              <button type="button" onClick={() => setIsNewCategoryModalOpen(false)} className="text-text-muted hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-text-muted block mb-1">Nombre de la Categoría *</label>
                <input
                  type="text"
                  placeholder="Ej. Consolas & Gaming, Laptops..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-bold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-text-muted block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Equipos, accesorios y componentes..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="rounded-xl border border-dark-border px-4 py-2 text-xs font-bold text-text-muted hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveFastCategory}
                  className="rounded-xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-5 py-2 text-xs font-black text-white shadow-glow-purple"
                >
                  Guardar Categoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR MARCA RÁPIDA */}
      {isNewBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-cyan" />
                <span>Crear Nueva Marca</span>
              </h3>
              <button type="button" onClick={() => setIsNewBrandModalOpen(false)} className="text-text-muted hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-text-muted block mb-1">Nombre de la Marca *</label>
                <input
                  type="text"
                  placeholder="Ej. Sony, Apple, Bose..."
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-bold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-text-muted block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Fabricante líder..."
                  value={newBrandDesc}
                  onChange={(e) => setNewBrandDesc(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewBrandModalOpen(false)}
                  className="rounded-xl border border-dark-border px-4 py-2 text-xs font-bold text-text-muted hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveFastBrand}
                  className="rounded-xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-5 py-2 text-xs font-black text-white shadow-glow-purple"
                >
                  Guardar Marca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
