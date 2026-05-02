import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import PropertiesGrid from "../common/PropertiesGrid";
import axios from "axios";
import { serverUrl } from "../../index";
import { neighborhoods } from "../../consts/neighborhoods";
import SyncIcon from '@mui/icons-material/Sync';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';

const ROOMS = ['3', '3.5', '4', '4.5', '5'];

const defaultFilters = {
    rooms: '',
    minMeters: '',
    maxMeters: '',
    minPrice: '',
    maxPrice: '',
    minFloor: '',
    maxFloor: '',
    merchant: '',
};

const hasActiveFilters = (f) =>
    Object.values(f).some(v => v !== '');

const NewProperties = () => {
    const [APIData, setAPIData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [neighborhood, setNeighborhood] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState(defaultFilters);
    const [debouncedFilters, setDebouncedFilters] = useState(defaultFilters);
    const debounceTimer = useRef(null);
    const loadingRef = useRef(false);
    const sentinelRef = useRef(null);

    const onDeleteHandler = (key) => {
        setAPIData(prev => prev.filter(item => item.propertyId !== key));
    };

    const setFilter = (key, value) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        setPage(1);
        const isTyped = ['minMeters', 'maxMeters', 'minPrice', 'maxPrice', 'minFloor', 'maxFloor'].includes(key);
        if (isTyped) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => setDebouncedFilters(next), 400);
        } else {
            setDebouncedFilters(next);
        }
    };

    const clearFilters = () => {
        setFilters(defaultFilters);
        setDebouncedFilters(defaultFilters);
        setPage(1);
    };

    const syncProperties = () => {
        setSyncing(true);
        axios.post(`${serverUrl()}/properties/sync`)
            .then(() => {
                setPage(1);
                setRefreshKey(k => k + 1);
            })
            .finally(() => setSyncing(false));
    };

    // Fetch page — appends if page > 1, replaces if page === 1
    useEffect(() => {
        const controller = new AbortController();
        loadingRef.current = true;
        setLoading(true);

        const params = new URLSearchParams({ page });
        if (neighborhood) params.set('neighborhood', neighborhood);
        Object.entries(debouncedFilters).forEach(([k, v]) => { if (v !== '') params.set(k, v); });

        axios.get(`${serverUrl()}/properties?${params}`, { signal: controller.signal })
            .then((response) => {
                const newItems = response.data.properties;
                setAPIData(prev => page === 1 ? newItems : [...prev, ...newItems]);
                setTotalCount(response.data.pagination.count);
                setHasMore(page * 30 < response.data.pagination.count);
            })
            .catch((err) => {
                if (axios.isCancel(err)) return;
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                    loadingRef.current = false;
                }
            });

        return () => {
            controller.abort();
            loadingRef.current = false;
        };
    }, [page, neighborhood, debouncedFilters, refreshKey]);

    // Infinite scroll sentinel
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMore && !loadingRef.current) {
                setPage(prev => prev + 1);
            }
        }, { rootMargin: '300px' });

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore]);

    const activeCount = Object.values(filters).filter(v => v !== '').length + (neighborhood ? 1 : 0);

    return (
        <div className="p-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">New Properties</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {totalCount > 0 ? `${totalCount} listings` : 'Browse latest listings'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter toggle */}
                    <button
                        onClick={() => setFiltersOpen(o => !o)}
                        className={`inline-flex items-center gap-2 h-9 px-3 text-sm font-medium rounded-md border transition-colors ${
                            filtersOpen || activeCount > 0
                                ? 'bg-foreground text-background border-foreground'
                                : 'border-border bg-background hover:bg-accent text-foreground'
                        }`}
                    >
                        <TuneIcon style={{ fontSize: 16 }} />
                        Filters
                        {activeCount > 0 && (
                            <span className="bg-background text-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {activeCount}
                            </span>
                        )}
                    </button>

                    {/* Sync */}
                    <button
                        onClick={syncProperties}
                        disabled={syncing}
                        className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-md border border-border bg-background hover:bg-accent text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <SyncIcon style={{ fontSize: 16, animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
                        {syncing ? 'Syncing…' : 'Sync'}
                    </button>
                </div>
            </div>

            {/* Filter panel */}
            {filtersOpen && (
                <div className="mb-5 p-4 rounded-xl border border-border bg-secondary/30 space-y-4">
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        {/* Neighborhood */}
                        <FilterGroup label="Neighborhood">
                            <select
                                value={neighborhood}
                                onChange={e => { setNeighborhood(e.target.value); setPage(1); }}
                                className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                dir="rtl"
                            >
                                <option value="">All</option>
                                {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </FilterGroup>

                        {/* Rooms */}
                        <FilterGroup label="Rooms">
                            <div className="flex gap-1">
                                {ROOMS.map(r => (
                                    <ToggleChip
                                        key={r}
                                        active={filters.rooms === r}
                                        onClick={() => setFilter('rooms', filters.rooms === r ? '' : r)}
                                    >
                                        {r}
                                    </ToggleChip>
                                ))}
                            </div>
                        </FilterGroup>

                        {/* Meters */}
                        <FilterGroup label="Size (m²)">
                            <div className="flex items-center gap-1.5">
                                <RangeInput
                                    placeholder="Min"
                                    value={filters.minMeters}
                                    onChange={v => setFilter('minMeters', v)}
                                />
                                <span className="text-muted-foreground text-xs">–</span>
                                <RangeInput
                                    placeholder="Max"
                                    value={filters.maxMeters}
                                    onChange={v => setFilter('maxMeters', v)}
                                />
                            </div>
                        </FilterGroup>

                        {/* Price */}
                        <FilterGroup label="Price (₪)">
                            <div className="flex items-center gap-1.5">
                                <RangeInput
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={v => setFilter('minPrice', v)}
                                    wide
                                />
                                <span className="text-muted-foreground text-xs">–</span>
                                <RangeInput
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={v => setFilter('maxPrice', v)}
                                    wide
                                />
                            </div>
                        </FilterGroup>

                        {/* Floor */}
                        <FilterGroup label="Floor">
                            <div className="flex items-center gap-1.5">
                                <RangeInput
                                    placeholder="Min"
                                    value={filters.minFloor}
                                    onChange={v => setFilter('minFloor', v)}
                                />
                                <span className="text-muted-foreground text-xs">–</span>
                                <RangeInput
                                    placeholder="Max"
                                    value={filters.maxFloor}
                                    onChange={v => setFilter('maxFloor', v)}
                                />
                            </div>
                        </FilterGroup>

                        {/* Type */}
                        <FilterGroup label="Type">
                            <SegmentedControl
                                options={[['', 'All'], ['false', 'Private'], ['true', 'Agency']]}
                                value={filters.merchant}
                                onChange={v => setFilter('merchant', v)}
                            />
                        </FilterGroup>
                    </div>

                    {/* Clear */}
                    {hasActiveFilters(filters) && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <CloseIcon style={{ fontSize: 13 }} />
                            Clear all filters
                        </button>
                    )}
                </div>
            )}

            <PropertiesGrid data={APIData} mode="new" onDeleteHandler={onDeleteHandler} />

            {/* Infinite scroll sentinel + spinner */}
            <div ref={sentinelRef} className="flex justify-center py-6">
                {loading && APIData.length > 0 && (
                    <div className="w-5 h-5 rounded-full border-2 border-border border-t-foreground animate-spin" />
                )}
            </div>
        </div>
    );
};

// Small reusable UI primitives

const FilterGroup = ({ label, children }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        {children}
    </div>
);

const ToggleChip = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
            active
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-foreground border-border hover:bg-accent'
        }`}
    >
        {children}
    </button>
);

const RangeInput = ({ placeholder, value, onChange, wide }) => (
    <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${wide ? 'w-28' : 'w-20'}`}
    />
);

const SegmentedControl = ({ options, value, onChange }) => (
    <div className="flex">
        {options.map(([val, label], i) => (
            <button
                key={val}
                onClick={() => onChange(val)}
                className={[
                    'px-3 py-1 text-sm font-medium border-y border-r transition-colors',
                    i === 0 ? 'border-l rounded-l-md' : '',
                    i === options.length - 1 ? 'rounded-r-md' : '',
                    value === val
                        ? 'bg-foreground text-background border-foreground z-10'
                        : 'bg-background text-foreground border-border hover:bg-accent',
                ].join(' ')}
            >
                {label}
            </button>
        ))}
    </div>
);

export default NewProperties;
