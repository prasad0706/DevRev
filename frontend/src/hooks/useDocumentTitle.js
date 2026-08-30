import { useEffect } from 'react';

/**
 * Custom Hook: useDocumentTitle
 * Purpose: Reusable hook to handle the side effect of setting the document title.
 * Demonstrates: Custom Hook calling useEffect with dependency array [title].
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | DevReview` : 'DevReview - Peer Code Review Platform';

    // Cleanup effect when component unmounts or title changes
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
