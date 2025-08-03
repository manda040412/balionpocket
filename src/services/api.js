const BASE_URL = '';

let errorFlags = {
  packages: false,
  packageById: {},
};

export async function fetchPackages() {
  if (errorFlags.packages) return null;
  const response = await fetch(`${BASE_URL}/packages`);
  if (!response.ok) {
    errorFlags.packages = true;
    throw new Error('Gagal mengambil data packages');
  }
  return await response.json();
}

export async function fetchPackageById(id) {
  if (errorFlags.packageById[id]) return null;
  const response = await fetch(`${BASE_URL}/packages/${id}`);
  if (!response.ok) {
    errorFlags.packageById[id] = true;
    throw new Error('Gagal mengambil detail paket');
  }
  return await response.json();
}

// Untuk reset error flags
export function resetApiErrorFlags() {
  errorFlags = {
    packages: false,
    packageById: {},
  };
}