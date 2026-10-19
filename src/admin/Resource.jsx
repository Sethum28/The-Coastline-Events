import { useEffect, useRef, useState } from 'react'
import { api } from './api.js'

function ImageField({ value, onChange, id }) {
  const [busy, setBusy] = useState(false), [err, setErr] = useState('')
  const pick = async (e) => {
    const f = e.target.files[0]; if (!f) return
    setBusy(true); setErr('')
    try { const fd = new FormData(); fd.append('file', f); const r = await api.post('/admin/upload', fd); onChange(r.url) } catch (x) { setErr(x.message) } finally { setBusy(false); e.target.value = '' }
  }
  return (<div className="imgf">
    {value && <img src={value} alt="Preview" />}
    <div><input id={id} type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/… or https://…" />
      <label className="btn s sm up">{busy ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pick} hidden /></label>
      {err && <p className="err" role="alert">{err}</p>}</div></div>)
}
function Input({ f, value, onChange, artists }) {
  const id = 'f_' + f.key
  if (f.type === 'textarea') return <textarea id={id} rows={f.rows || 4} value={value} maxLength={f.max} onChange={(e) => onChange(e.target.value)} />
  if (f.type === 'select') return <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>{f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
  if (f.type === 'checkbox') return <span className="chk"><input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.checkLabel || 'Yes'}</span>
  if (f.type === 'image') return <ImageField id={id} value={value} onChange={onChange} />
  if (f.type === 'artists') return (<div className="chk-list">{artists.length ? artists.map(a => <label key={a.id} className="chk"><input type="checkbox" checked={value.includes(a.id)} onChange={(e) => onChange(e.target.checked ? [...value, a.id] : value.filter(x => x !== a.id))} /> {a.name}</label>) : <span className="mut">No artists yet.</span>}</div>)
  return <input id={id} type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'} value={value} maxLength={f.max} onChange={(e) => onChange(e.target.value)} />
}

// Config-driven list + create/edit form used for Events, Artists, Gallery and FAQs.
export default function Resource({ title, path, columns, fields, blank = {}, intro }) {
  const [rows, setRows] = useState(null), [err, setErr] = useState(''), [edit, setEdit] = useState(null), [artists, setArtists] = useState([]), [busy, setBusy] = useState(false), [ferr, setFerr] = useState('')
  const load = () => api.get(path).then(setRows).catch(e => setErr(e.message))
  useEffect(() => { setRows(null); load(); if (fields.some(f => f.type === 'artists')) api.get('/admin/artists').then(setArtists).catch(() => {}) }, [path]) // eslint-disable-line
  const open = (row) => {
    const d = {}
    for (const f of fields) d[f.key] = row ? (f.type === 'checkbox' ? !!row[f.key] : f.type === 'artists' ? (row.artist_ids || []) : row[f.key] ?? '') : (blank[f.key] ?? (f.type === 'checkbox' ? true : f.type === 'artists' ? [] : ''))
    setFerr(''); setEdit({ id: row?.id, d })
  }
  const save = async (e) => {
    e.preventDefault(); setBusy(true); setFerr('')
    const body = {}
    for (const f of fields) { const v = edit.d[f.key]; if (f.type === 'number') { if (v !== '') body[f.key] = Number(v) } else body[f.key] = v }
    try { edit.id ? await api.put(`${path}/${edit.id}`, body) : await api.post(path, body); setEdit(null); await load() } catch (x) { setFerr(x.message) } finally { setBusy(false) }
  }
  const del = async (r) => { if (!window.confirm('Delete this item? This cannot be undone.')) return; try { await api.del(`${path}/${r.id}`); await load() } catch (x) { setErr(x.message) } }
  const first = useRef(null)
  useEffect(() => { if (edit) first.current?.querySelector('input,textarea,select')?.focus(); const k = (e) => e.key === 'Escape' && setEdit(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k) }, [edit?.id, !!edit]) // eslint-disable-line
  return (<div>
    <header className="ad-h"><div><h1>{title}</h1>{intro && <p className="mut">{intro}</p>}</div><button className="btn p sm" onClick={() => open(null)}>+ Add new</button></header>
    {err && <p className="err" role="alert">{err}</p>}
    {!rows ? <p className="mut">Loading…</p> : !rows.length ? <p className="mut empty">Nothing here yet. Click “Add new”.</p> :
      <div className="tbl"><table><thead><tr>{columns.map(c => <th key={c[0]}>{c[1]}</th>)}<th /></tr></thead><tbody>
        {rows.map(r => <tr key={r.id}>{columns.map(([k, , render]) => <td key={k}>{render ? render(r[k], r) : String(r[k] ?? '')}</td>)}
          <td className="act"><button className="btn s sm" onClick={() => open(r)}>Edit</button><button className="btn s sm danger" onClick={() => del(r)}>Delete</button></td></tr>)}</tbody></table></div>}
    {edit && <div className="mod" data-lenis-prevent role="dialog" aria-modal="true" aria-label={edit.id ? 'Edit item' : 'New item'} onClick={(e) => e.target === e.currentTarget && setEdit(null)}>
      <form className="box adform" onSubmit={save} noValidate ref={first}>
        <h2>{edit.id ? 'Edit' : 'New'} — {title}</h2>
        {fields.map(f => <div className="fld" key={f.key}><label htmlFor={'f_' + f.key}>{f.label}{f.required && ' *'}</label>
          <Input f={f} value={edit.d[f.key]} artists={artists} onChange={(v) => setEdit({ ...edit, d: { ...edit.d, [f.key]: v } })} />{f.help && <small className="mut">{f.help}</small>}</div>)}
        {ferr && <p className="err" role="alert">{ferr}</p>}
        <div className="two-btn"><button type="button" className="btn s" onClick={() => setEdit(null)}>Cancel</button><button className="btn p" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
      </form></div>}
  </div>)
}
