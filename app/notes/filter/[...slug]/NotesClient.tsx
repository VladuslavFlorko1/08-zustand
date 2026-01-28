"use client";

import Link from "next/link";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import { fetchNotes } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Toaster, toast } from "react-hot-toast";

import css from "./page.module.css";

type Props = {
  tag?: string;
};

const NotesClient = ({ tag }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch,
        tag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isSuccess && data?.notes.length === 0) {
      toast.error("No notes found for your request.");
    }
  }, [isSuccess, data]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox searchValue={searchQuery} onSearch={handleSearchChange} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            page={currentPage}
            onChange={setCurrentPage}
            totalPages={totalPages}
          />
        )}
        <Link href="/notes/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <Toaster />

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
    </div>
  );
};

export default NotesClient;
