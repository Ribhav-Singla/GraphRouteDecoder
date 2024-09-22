import { NextRequest, NextResponse } from 'next/server';
import { Dijsktra_Navigator } from './dijsktra.js'

interface Graph {
    id: number;
    nodeValue: string;
    edgeValue: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nodes, source, dest }: { nodes: Graph, source: string, dest: string } = body;
        // console.log('body received in the backend: ',body);
        const output = Dijsktra_Navigator(nodes, source, dest);
        // console.log('output: ',output);
        return NextResponse.json({ output }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}