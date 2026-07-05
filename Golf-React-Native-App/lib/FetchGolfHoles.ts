export default async function fetchGolfHoles(lat: number, lon: number, radiusMeters = 1500) {
    const query = `
        [out:json][timeout:25];
        way["golf"="hole"](around:${radiusMeters},${lat},${lon});
        out body;
        >;
        out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query,
    });

    const data = await response.json();

    return parseGolfHoles(data.elements); // array of { id, lat, lon, tags }

}

function parseGolfHoles(elements: any[]) {
    const nodes = new Map(
        elements.filter(e => e.type === 'node').map(n => [n.id, { lat: n.lat, lon: n.lon }])
    );

    const holes = elements
        .filter(e => e.type === 'way' && e.tags?.golf === 'hole')
        .filter(e => e.tags.ref !== undefined && e.tags.par !== undefined)
        .map(way => {
            const coords = way.nodes.map((id: number) => nodes.get(id));
            return {
                holeNumber: Number(way.tags.ref),
                par: Number(way.tags.par),
                tee: coords[0],
                green: coords[coords.length - 1],
                fullLine: coords
            };
        })
        .sort((a,b) => a.holeNumber - b.holeNumber)

    return holes;
}


