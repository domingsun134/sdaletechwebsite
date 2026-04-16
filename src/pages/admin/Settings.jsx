import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, ToggleLeft, ToggleRight, Save, Mail } from 'lucide-react';

// Human-readable labels for hr_lookup types
const LOOKUP_TYPE_LABELS = {
    Nationality:   'Nationality',
    Race:          'Race / Ethnicity',
    Religion:      'Religion',
    Dialect:       'Dialect',
    Gender:        'Gender',
    'Marital Status': 'Marital Status',
    'Address Type':   'Address Type',
    Relation:      'Relationship',
    Contributions: 'CPF Self-Help Contributions',
    IdentityType:  'Identity Type',
};

const Settings = () => {
    // ── Job Locations ────────────────────────────────────────────
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const fetchLocations = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('job_locations')
            .select('id, name, is_active, sort_order')
            .order('sort_order', { ascending: true });
        if (!error) setLocations(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleAdd = async () => {
        const trimmed = newLocation.trim();
        if (!trimmed) return;
        if (locations.find(l => l.name.toLowerCase() === trimmed.toLowerCase())) {
            setError('Location already exists.');
            return;
        }
        setSaving(true);
        setError('');
        const maxOrder = locations.reduce((m, l) => Math.max(m, l.sort_order || 0), 0);
        const { error: err } = await supabase
            .from('job_locations')
            .insert({ name: trimmed, is_active: true, sort_order: maxOrder + 1 });
        if (err) setError(err.message);
        else { setNewLocation(''); await fetchLocations(); }
        setSaving(false);
    };

    const handleToggle = async (loc) => {
        const { error: err } = await supabase
            .from('job_locations')
            .update({ is_active: !loc.is_active })
            .eq('id', loc.id);
        if (!err) setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, is_active: !l.is_active } : l));
    };

    const handleDelete = async (loc) => {
        if (!window.confirm(`Delete "${loc.name}"? This cannot be undone.`)) return;
        const { error: err } = await supabase.from('job_locations').delete().eq('id', loc.id);
        if (!err) setLocations(prev => prev.filter(l => l.id !== loc.id));
    };

    // ── HR Lookup Options ────────────────────────────────────────
    const [hrLookups, setHrLookups] = useState({});
    const [activeType, setActiveType] = useState(null);
    const [lookupLoading, setLookupLoading] = useState(true);

    const authHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const fetchHrLookups = async () => {
        setLookupLoading(true);
        try {
            const { data, error } = await supabase
                .from('hr_lookups')
                .select('id, type, item, item_full_name, is_active, sort_order')
                .order('type')
                .order('sort_order');
            if (error) throw error;
            const grouped = (data || []).reduce((acc, row) => {
                (acc[row.type] = acc[row.type] || []).push(row);
                return acc;
            }, {});
            setHrLookups(grouped);
            setActiveType(prev => prev && grouped[prev] ? prev : Object.keys(grouped)[0] || null);
        } catch (err) {
            console.error('Failed to fetch HR lookups:', err);
        }
        setLookupLoading(false);
    };

    useEffect(() => { fetchHrLookups(); }, []);

    // ── System Settings ──────────────────────────────────────────
    const DEFAULT_RPA_EMAILS = 'meichern.oh@sdaletech.com;linkang.sun@sdaletech.com;elaine.tua@sdaletech.com;vivien.lye@sdaletech.com;jessica.wong@sdaletech.com;helen.ng@sdaletech.com;pohwi.tan@sdaletech.com';
    const [rpaEmails, setRpaEmails] = useState(DEFAULT_RPA_EMAILS);
    const [rpaEmailsSaving, setRpaEmailsSaving] = useState(false);
    const [rpaEmailsSaved, setRpaEmailsSaved] = useState(false);

    useEffect(() => {
        fetch('/api/system-settings', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(r => r.json())
            .then(d => { if (d.rpa_notification_emails) setRpaEmails(d.rpa_notification_emails); })
            .catch(() => {});
    }, []);

    const handleSaveRpaEmails = async () => {
        setRpaEmailsSaving(true);
        setRpaEmailsSaved(false);
        try {
            const res = await fetch('/api/system-settings/rpa_notification_emails', {
                method: 'PATCH',
                headers: authHeaders(),
                body: JSON.stringify({ value: rpaEmails.trim() })
            });
            if (res.ok) { setRpaEmailsSaved(true); setTimeout(() => setRpaEmailsSaved(false), 3000); }
        } finally {
            setRpaEmailsSaving(false);
        }
    };

    const handleToggleLookup = async (item) => {
        const newValue = !item.is_active;
        // Optimistic update
        setHrLookups(prev => ({
            ...prev,
            [item.type]: prev[item.type].map(r =>
                r.id === item.id ? { ...r, is_active: newValue } : r
            )
        }));
        const res = await fetch(`/api/hr-lookups/${item.id}`, {
            method: 'PATCH',
            headers: authHeaders(),
            body: JSON.stringify({ is_active: newValue })
        });
        if (!res.ok) {
            // Revert on failure
            setHrLookups(prev => ({
                ...prev,
                [item.type]: prev[item.type].map(r =>
                    r.id === item.id ? { ...r, is_active: item.is_active } : r
                )
            }));
            console.error('Failed to save lookup toggle');
        }
    };

    const typeKeys = Object.keys(hrLookups).sort((a, b) => {
        const order = Object.keys(LOOKUP_TYPE_LABELS);
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });

    const activeItems = activeType ? (hrLookups[activeType] || []) : [];
    const activeCount = activeItems.filter(r => r.is_active).length;

    return (
        <AdminLayout>
            <div className="p-6 max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-1">Settings</h1>
                    <p className="text-slate-500 text-sm">Configure system-wide options</p>
                </div>

                {/* ── Job Locations ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-700">Job Locations</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Manage the location options available when creating or editing jobs.</p>
                    </div>

                    {loading ? (
                        <div className="p-6 text-slate-400 text-sm">Loading…</div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {locations.map(loc => (
                                <li key={loc.id} className="flex items-center justify-between px-6 py-3">
                                    <span className={`text-sm ${loc.is_active ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {loc.name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggle(loc)}
                                            title={loc.is_active ? 'Disable' : 'Enable'}
                                            className="text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {loc.is_active
                                                ? <ToggleRight size={22} className="text-green-500" />
                                                : <ToggleLeft size={22} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(loc)}
                                            title="Delete"
                                            className="text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="px-6 py-4 border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={newLocation}
                            onChange={e => { setNewLocation(e.target.value); setError(''); }}
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            placeholder="Add new location…"
                            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={saving || !newLocation.trim()}
                            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            <Plus size={16} /> Add
                        </button>
                    </div>
                    {error && <p className="px-6 pb-4 text-xs text-red-500">{error}</p>}
                </div>

                {/* ── RPA Notification Emails ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                        <Mail size={16} className="text-indigo-500" />
                        <div>
                            <h2 className="font-semibold text-slate-700">RPA Notification Emails</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Semicolon-separated list of recipients for AD provisioning notifications sent by the RPA workflow.</p>
                        </div>
                    </div>
                    <div className="px-6 py-4 space-y-3">
                        <textarea
                            value={rpaEmails}
                            onChange={e => setRpaEmails(e.target.value)}
                            rows={3}
                            placeholder="email1@sdaletech.com;email2@sdaletech.com"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono resize-none"
                        />
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-slate-400">{rpaEmails.split(';').filter(e => e.trim()).length} recipients</p>
                            <button
                                onClick={handleSaveRpaEmails}
                                disabled={rpaEmailsSaving}
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                <Save size={14} />
                                {rpaEmailsSaved ? 'Saved!' : rpaEmailsSaving ? 'Saving…' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── HR Lookup Options ── */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="font-semibold text-slate-700">Onboarding Form Options</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Control which options appear in each dropdown on the candidate onboarding form. Toggle off to hide an option without deleting it.
                        </p>
                    </div>

                    {lookupLoading ? (
                        <div className="p-6 text-slate-400 text-sm">Loading…</div>
                    ) : (
                        <>
                            {/* Type tabs */}
                            <div className="px-4 pt-3 pb-0 flex flex-wrap gap-1.5 border-b border-slate-100">
                                {typeKeys.map(type => {
                                    const count = (hrLookups[type] || []).filter(r => r.is_active).length;
                                    const total = (hrLookups[type] || []).length;
                                    const isActive = activeType === type;
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setActiveType(type)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap
                                                ${isActive
                                                    ? 'border-primary text-primary bg-primary/5'
                                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                                }`}
                                        >
                                            {LOOKUP_TYPE_LABELS[type] || type}
                                            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                                                count === total ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {count}/{total}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Items for active type */}
                            {activeType && (
                                <div>
                                    <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            {activeCount} of {activeItems.length} options visible in the form
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={async () => {
                                                    const inactive = activeItems.filter(r => !r.is_active);
                                                    if (!inactive.length) return;
                                                    const ids = inactive.map(r => r.id);
                                                    setHrLookups(prev => ({
                                                        ...prev,
                                                        [activeType]: prev[activeType].map(r => ({ ...r, is_active: true }))
                                                    }));
                                                    await fetch('/api/hr-lookups/bulk', {
                                                        method: 'PATCH',
                                                        headers: authHeaders(),
                                                        body: JSON.stringify({ ids, is_active: true })
                                                    });
                                                }}
                                                className="text-xs text-slate-400 hover:text-green-600 transition-colors"
                                            >
                                                Enable all
                                            </button>
                                            <span className="text-slate-200">|</span>
                                            <button
                                                onClick={async () => {
                                                    const active = activeItems.filter(r => r.is_active);
                                                    if (!active.length) return;
                                                    const ids = active.map(r => r.id);
                                                    setHrLookups(prev => ({
                                                        ...prev,
                                                        [activeType]: prev[activeType].map(r => ({ ...r, is_active: false }))
                                                    }));
                                                    await fetch('/api/hr-lookups/bulk', {
                                                        method: 'PATCH',
                                                        headers: authHeaders(),
                                                        body: JSON.stringify({ ids, is_active: false })
                                                    });
                                                }}
                                                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                Disable all
                                            </button>
                                        </div>
                                    </div>

                                    <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                                        {activeItems.map(row => (
                                            <li key={row.id} className="flex items-center justify-between px-6 py-2.5">
                                                <div className="flex flex-col min-w-0">
                                                    <span className={`text-sm truncate ${row.is_active ? 'text-slate-800' : 'text-slate-400'}`}>
                                                        {row.item}
                                                    </span>
                                                    {row.item_full_name && row.item_full_name !== row.item && (
                                                        <span className="text-xs text-slate-400 truncate">{row.item_full_name}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleToggleLookup(row)}
                                                    title={row.is_active ? 'Hide from form' : 'Show in form'}
                                                    className="ml-4 shrink-0 transition-colors"
                                                >
                                                    {row.is_active
                                                        ? <ToggleRight size={22} className="text-green-500" />
                                                        : <ToggleLeft size={22} className="text-slate-300" />}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;
