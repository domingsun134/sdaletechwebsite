import React, { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, List } from 'lucide-react';

/**
 * Lightweight rich text editor with Bold, Italic, and Bullet List support.
 * Stores content as HTML string.
 */
const RichTextEditor = ({ value, onChange, minHeight = '8rem', placeholder = '' }) => {
    const editorRef = useRef(null);
    const isUserTyping = useRef(false);

    // Set initial content once on mount
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = value || '';
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync external value changes (e.g. switching jobs) without overwriting cursor
    useEffect(() => {
        if (editorRef.current && !isUserTyping.current) {
            const current = editorRef.current.innerHTML;
            if (current !== (value || '')) {
                editorRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    const handleInput = useCallback(() => {
        isUserTyping.current = true;
        onChange(editorRef.current.innerHTML);
        // Reset flag after a short delay
        setTimeout(() => { isUserTyping.current = false; }, 100);
    }, [onChange]);

    const execCmd = (command) => {
        editorRef.current.focus();
        document.execCommand(command, false, null);
        onChange(editorRef.current.innerHTML);
    };

    const toolbarBtn = 'p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors';

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200">
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCmd('bold'); }}
                    title="Bold"
                    className={toolbarBtn}
                >
                    <Bold size={14} />
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCmd('italic'); }}
                    title="Italic"
                    className={toolbarBtn}
                >
                    <Italic size={14} />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList'); }}
                    title="Bullet List"
                    className={toolbarBtn}
                >
                    <List size={14} />
                </button>
            </div>

            {/* Editable area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                data-placeholder={placeholder}
                className="w-full px-4 py-3 outline-none text-slate-700 leading-relaxed rich-editor-content"
                style={{ minHeight }}
            />
        </div>
    );
};

export default RichTextEditor;
