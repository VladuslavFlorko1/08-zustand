'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NoteDetails.module.css';

interface NotePreviewClientProps {
  id?: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const noteId = id ?? params.id;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  if (!noteId) return null;

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong.</p>}

      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}



