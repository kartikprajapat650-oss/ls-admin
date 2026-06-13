export async function backendFetch(path: string, options: RequestInit = {}) {
  const baseUrl ="https://ls-backend-production-bdef.up.railway.app/";
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Backend fetch failed');
  }

  return response.json();
}
