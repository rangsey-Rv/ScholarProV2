'use client';
import { useEffect } from 'react';
import { useHeader } from '@/components/header/header-context';

export default function TitleSetter({ title }: { title: string }) {
  const { setTitle } = useHeader();
  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);
  return null;
}