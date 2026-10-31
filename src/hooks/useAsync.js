import { useEffect, useState, useCallback } from 'react';

export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const run = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(run, [run]);
  return { ...state, retry: run };
}
