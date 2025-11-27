
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    console.log('[GridSection API] POST called');
    const body = await request.json();
    const sections = Array.isArray(body.sections) ? body.sections : [];
    console.log('[GridSection API] Sections to save:', JSON.stringify(sections));

    // Upsert each section by index (0,1,2)
    for (let i = 0; i < 3; i++) {
      const s = sections[i];
      if (s && (s.title || s.path || (s.productIds && s.productIds.length))) {
        console.log(`[GridSection API] Upserting section index ${i}:`, s);
        await prisma.gridSection.upsert({
          where: { index: i },
          update: {
            title: s.title || '',
            path: s.path || '',
            productIds: s.productIds || [],
          },
          create: {
            index: i,
            title: s.title || '',
            path: s.path || '',
            productIds: s.productIds || [],
          },
        });
      } else {
        console.log(`[GridSection API] Deleting section index ${i}`);
        await prisma.gridSection.deleteMany({ where: { index: i } });
      }
    }
    console.log('[GridSection API] POST complete');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[GridSection API] POST error:', error);
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function GET() {
  console.log('[GridSection API] GET called');
  const dbSections = await prisma.gridSection.findMany({ orderBy: { index: 'asc' } });
  console.log('[GridSection API] Sections from DB:', JSON.stringify(dbSections));
  // Always return 3 slots for UI
  const sections = [0, 1, 2].map(i => {
    const s = dbSections.find(x => x.index === i);
    return s
      ? { title: s.title, path: s.path, productIds: s.productIds }
      : { title: '', path: '', productIds: [] };
  });
  console.log('[GridSection API] Sections returned to client:', JSON.stringify(sections));
  return NextResponse.json({ sections });
}
