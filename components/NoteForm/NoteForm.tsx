'use client';

import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import css from './NoteForm.module.css';
import { createNote } from '@/lib/api';
import type { NewNote } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';

export default function NoteForm() {
  const fieldId = useId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = (formData: FormData) => {
    const note: NewNote = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as NewNote['tag'],
    };

    mutation.mutate(note);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`title-${fieldId}`}>Title</label>
        <input
          id={`title-${fieldId}`}
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`content-${fieldId}`}>Content</label>
        <textarea
          id={`content-${fieldId}`}
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`tag-${fieldId}`}>Tag</label>
        <select
          id={`tag-${fieldId}`}
          name="tag"
          className={css.select}
          value={draft.tag}
          required
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          Create note
        </button>
      </div>
    </form>
  );
}
