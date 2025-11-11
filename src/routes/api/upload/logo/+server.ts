import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BETTER_AUTH_URL } from '$env/static/private';

const getRandomId = () => {
    return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(6))))
        .replace(/[+/=]/g, '');
};

export const POST = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('logo') as File;

        if (!file) {
            return json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return json({ error: 'Invalid file type. Only PNG, JPEG, WebP, and SVG are allowed.' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Generate unique filename
        const extension = path.extname(file.name);
        const id = getRandomId();
        const filename = `${id}${extension}`;

        // Ensure logos directory exists
        const logosDir = path.join(process.cwd(), 'images', 'logos');
        await fs.mkdir(logosDir, { recursive: true });

        // Save file
        const filePath = path.join(logosDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, buffer);

        // Construct URL
        const logoUrl = `${BETTER_AUTH_URL}/api/files/logos/${filename}`;

        // Update organization with logo info
        await db
            .update(organization)
            .set({
                logo: {
                    name: file.name,
                    type: file.type,
                    url: logoUrl
                }
            })
            .where(eq(organization.userId, session.user.id));

        return json({
            success: true,
            logo: {
                name: file.name,
                type: file.type,
                url: logoUrl
            }
        });
    } catch (error) {
        console.error('Error uploading logo:', error);
        return json({ error: 'Failed to upload logo' }, { status: 500 });
    }
};