'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import styles from './page.module.css';

const languages = ['Python', 'JavaScript', 'Java', 'C++', 'C#', 'Kotlin', 'R', 'SQL'] as const;
const roomIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RoomMessage = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type SharedRoom = {
  code: string;
  language: (typeof languages)[number];
  messages: RoomMessage[];
  updatedAt: string;
};

function emptyRoom(): SharedRoom {
  return { code: '', language: 'JavaScript', messages: [], updatedAt: new Date(0).toISOString() };
}

export default function CollaboratePage() {
  return (
    <Suspense fallback={<main className={`page-shell ${styles.page}`}><p>Loading coding room…</p></main>}>
      <CollaborateContent />
    </Suspense>
  );
}

function CollaborateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('room')?.toLowerCase() ?? '';
  const [room, setRoom] = useState<SharedRoom>(emptyRoom);
  const [author, setAuthor] = useState('Byte Knight');
  const [messageDraft, setMessageDraft] = useState('');
  const [roomInput, setRoomInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shared, setShared] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [savingCode, setSavingCode] = useState(false);
  const codeDirty = useRef(false);
  const codeVersion = useRef(0);
  const latestRoom = useRef(room);

  useEffect(() => {
    latestRoom.current = room;
  }, [room]);

  const applyRoom = useCallback((nextRoom: SharedRoom, allowCodeUpdate: boolean) => {
    setRoom((current) => {
      const updated = {
        ...nextRoom,
        code: allowCodeUpdate ? nextRoom.code : current.code,
        language: allowCodeUpdate ? nextRoom.language : current.language,
      };
      latestRoom.current = updated;
      return updated;
    });
  }, []);

  useEffect(() => {
    if (!roomId || !roomIdPattern.test(roomId)) {
      setRoom(emptyRoom());
      setLoading(false);
      if (roomId) setError('That room link is invalid. Create a room or enter a valid room ID.');
      return;
    }

    let active = true;
    setLoading(true);
    setError('');

    const refreshRoom = async () => {
      try {
        const response = await fetch(`/api/collaboration?room=${encodeURIComponent(roomId)}`, { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Could not load this room.');
        if (!active) return;
        const currentTimestamp = Date.parse(latestRoom.current.updatedAt);
        const responseTimestamp = Date.parse(data.room.updatedAt);
        const canUpdateCode = !codeDirty.current && responseTimestamp >= currentTimestamp;
        applyRoom(data.room, canUpdateCode);
        setShared(data.shared);
        setError('');
      } catch (loadError: unknown) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load this room.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void refreshRoom();
    const interval = window.setInterval(() => void refreshRoom(), 3_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [roomId, applyRoom]);

  useEffect(() => {
    if (!roomId || !codeDirty.current) return;

    const version = codeVersion.current;
    const timer = window.setTimeout(async () => {
      setSavingCode(true);
      try {
        const response = await fetch(`/api/collaboration?room=${encodeURIComponent(roomId)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'code', code: room.code, language: room.language }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Could not save shared code.');
        setShared(data.shared);
        if (version === codeVersion.current) {
          codeDirty.current = false;
          applyRoom(data.room, true);
          setStatus('Shared code saved.');
        }
      } catch (saveError: unknown) {
        setError(saveError instanceof Error ? saveError.message : 'Could not save shared code.');
      } finally {
        setSavingCode(false);
      }
    }, 650);

    return () => window.clearTimeout(timer);
  }, [room.code, room.language, roomId, applyRoom]);

  const updateCode = (code: string) => {
    codeVersion.current += 1;
    codeDirty.current = true;
    setRoom((current) => {
      const updated = { ...current, code };
      latestRoom.current = updated;
      return updated;
    });
    setStatus('Unsaved changes');
  };

  const updateLanguage = (language: (typeof languages)[number]) => {
    codeVersion.current += 1;
    codeDirty.current = true;
    setRoom((current) => {
      const updated = { ...current, language };
      latestRoom.current = updated;
      return updated;
    });
    setStatus('Unsaved changes');
  };

  const createRoom = () => {
    const id = crypto.randomUUID();
    router.push(`/collaborate?room=${id}`);
  };

  const joinRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = roomInput.trim().toLowerCase();
    if (!roomIdPattern.test(id)) {
      setError('Enter the complete room ID shared by your group.');
      return;
    }
    setError('');
    router.push(`/collaborate?room=${id}`);
  };

  const shareRoom = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus('Room link copied.');
    } catch {
      setCopyStatus('Could not copy the link. Copy it from your browser address bar.');
    }
  };

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setStatus('');
    try {
      const response = await fetch(`/api/collaboration?room=${encodeURIComponent(roomId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'message', author, text: messageDraft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Could not send your message.');
      applyRoom(data.room, !codeDirty.current);
      setShared(data.shared);
      setMessageDraft('');
      setStatus('Message sent.');
    } catch (sendError: unknown) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send your message.');
    }
  };

  return (
    <main className={`page-shell ${styles.page}`}>
      <nav className="top-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-mark"><span className="brand-orb">CQ</span> Code Quest</Link>
        <div className="nav-links">
          <Link href="/">Academy</Link>
          <Link href="/quests">Quest board</Link>
          <Link href="/reviews">Peer reviews</Link>
          <span className="profile-pill"><span className="online-dot" /> Collaborate</span>
        </div>
      </nav>

      <header className={styles.hero}>
        <p className="eyebrow">BUILD TOGETHER</p>
        <h1>Shared coding room</h1>
        <p>Work on one shared code sample and talk through the next step with your group. Changes sync every few seconds.</p>
      </header>

      {!roomId || !roomIdPattern.test(roomId) ? (
        <section className={styles.lobby} aria-label="Join or create a coding room">
          <div>
            <p className="eyebrow">START A PROJECT</p>
            <h2>Create a room</h2>
            <p>Start a shared workspace, then send its private link to your group.</p>
            <button type="button" className={styles.primaryButton} onClick={createRoom}>Create coding room</button>
          </div>
          <form onSubmit={joinRoom}>
            <p className="eyebrow">JOIN YOUR GROUP</p>
            <h2>Enter a room ID</h2>
            <label htmlFor="room-id">Room ID</label>
            <input id="room-id" value={roomInput} onChange={(event) => setRoomInput(event.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" required />
            <button type="submit" className={styles.secondaryButton}>Join room</button>
          </form>
        </section>
      ) : (
        <>
          <section className={styles.roomBar}>
            <div>
              <span className={styles.roomLabel}>ROOM ID</span>
              <code>{roomId}</code>
            </div>
            <div className={styles.roomActions}>
              <span className={shared ? styles.sharedState : styles.localState}>
                {shared ? 'Shared across deployments' : 'Temporary server storage'}
              </span>
              <button type="button" className={styles.secondaryButton} onClick={shareRoom}>Copy room link</button>
              <button type="button" className={styles.secondaryButton} onClick={() => router.push('/collaborate')}>Leave room</button>
            </div>
          </section>

          <p className={styles.privacyNote}>Anyone with this link can view and edit the room. Use pseudonyms and do not share secrets or personal information.</p>
          {error && <p className={styles.alertError} role="alert">{error}</p>}
          {status && <p className={styles.alertStatus} role="status">{status}</p>}
          {copyStatus && <p className={styles.alertStatus} role="status">{copyStatus}</p>}

          <div className={styles.workspace}>
            <section className={styles.editorPanel} aria-label="Shared code editor">
              <div className={styles.panelHeading}>
                <div>
                  <p className="eyebrow">PROJECT WORKSPACE</p>
                  <h2>Shared code</h2>
                </div>
                <label className={styles.languagePicker}>
                  Language
                  <select value={room.language} onChange={(event) => updateLanguage(event.target.value as (typeof languages)[number])}>
                    {languages.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>
              </div>
              {loading && !room.updatedAt ? <p className={styles.loading}>Loading room…</p> : (
                <CodeEditor language={room.language} value={room.code} onChange={updateCode} />
              )}
              <p className={styles.saveState}>{savingCode ? 'Saving shared code…' : 'Edits are shared automatically.'}</p>
            </section>

            <section className={styles.chatPanel} aria-label="Group discussion">
              <div className={styles.panelHeading}>
                <div>
                  <p className="eyebrow">GROUP DISCUSSION</p>
                  <h2>Project chat</h2>
                </div>
                <span className={styles.messageCount}>{room.messages.length} / 100</span>
              </div>
              <div className={styles.messages} aria-live="polite">
                {room.messages.length === 0 ? (
                  <div className={styles.emptyChat}>
                    <strong>Start the conversation.</strong>
                    <p>Ask a question, share an idea, or suggest a code improvement.</p>
                  </div>
                ) : room.messages.map((message) => (
                  <article key={message.id} className={styles.message}>
                    <div>
                      <strong>{message.author}</strong>
                      <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</time>
                    </div>
                    <p>{message.text}</p>
                  </article>
                ))}
              </div>
              <form className={styles.chatForm} onSubmit={sendMessage}>
                <label>
                  Display name
                  <input value={author} onChange={(event) => setAuthor(event.target.value)} minLength={2} maxLength={40} required />
                </label>
                <label>
                  Message
                  <textarea value={messageDraft} onChange={(event) => setMessageDraft(event.target.value)} maxLength={500} placeholder="Share a thought with your group…" required />
                </label>
                <button type="submit" className={styles.primaryButton} disabled={!messageDraft.trim()}>Send message</button>
              </form>
            </section>
          </div>
        </>
      )}
      {error && (!roomId || !roomIdPattern.test(roomId)) && <p className={styles.alertError} role="alert">{error}</p>}
    </main>
  );
}
