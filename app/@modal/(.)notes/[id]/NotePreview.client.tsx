"use client";

import css from "./NotePreview.module.css";
import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";

interface NotePreviewClientProps {
  id?: string; 
}

const NotePreviewClient: FC<NotePreviewClientProps> = ({ id: propId }) => {
  const params = useParams<{ id: string }>();
  const id = propId || params?.id; 
  const router = useRouter();
  const handleClickBack = () => {
    router.back();
  };

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id, 
    refetchOnMount: false,
  });

  if (!id) return <p>No note ID provided.</p>;
  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  const formattedDate = `Created at: ${note.createdAt}`;

  return (
    <Modal onClose={handleClickBack}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
          <p className={css.tag}>{note.tag}</p>
          <button className={css.backBtn} onClick={handleClickBack}>
            Back
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;
