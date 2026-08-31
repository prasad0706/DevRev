import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | DevReview` : 'DevReview - Peer Code Review Platform';

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
