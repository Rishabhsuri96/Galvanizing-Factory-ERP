export type SizeOption = {
  id: number;
  name: string;
};

export async function getSizesByCategory(
  categoryId: number
): Promise<SizeOption[]> {
  const response = await fetch(
    `/api/sizes?categoryId=${categoryId}`
  );

  if (!response.ok) {
    throw new Error("Failed to load sizes.");
  }

  return response.json();
}