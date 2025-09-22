const baseurl = '/api/set-password';

export async function setPassword(email: string, password: string) {
  try {
    const response = await fetch(baseurl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Set password failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error('Failed to set password: ' + (error as Error).message);
  }
}
