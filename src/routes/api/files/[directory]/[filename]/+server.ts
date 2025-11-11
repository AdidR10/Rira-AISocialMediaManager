import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET({ params }) {

  if (params.directory !== 'logos' && params.directory !== 'photocards')
    return new Response('File not found', { status: 404 });

  const filePath = path.join(process.cwd(), 'images', params.directory, params.filename);

  try {
    const fileContent = await fs.readFile(filePath);
    return new Response(fileContent, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    console.log(error)
    return new Response('File not found', { status: 404 });
  }
}