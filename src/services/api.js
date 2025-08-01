const BASE_URL = '';

export async function fetchPackages() {
  const response = await fetch(`${BASE_URL}/packages`);
  if (!response.ok) throw new Error('Gagal mengambil data packages');
  return await response.json();
}

export async function fetchPackageById(id) {
  const response = await fetch(`${BASE_URL}/packages/${id}`);
  if (!response.ok) throw new Error('Gagal mengambil detail paket');
  return await response.json();
}