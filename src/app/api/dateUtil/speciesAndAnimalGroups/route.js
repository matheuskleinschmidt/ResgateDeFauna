import { getSpeciesAndAnimalGroups } from '@/app/api/controllers/utils';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const data = await getSpeciesAndAnimalGroups();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Error fetching species and animal groups:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
}
