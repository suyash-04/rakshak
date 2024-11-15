export async function getLocationFromCoordinates(latitude: number, longitude: number): Promise<object> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return { place_id: data.place_id, display_name: data.display_name };
    } catch (error: any) {
        return { error: `Error: ${error.message}` };
    }
}
