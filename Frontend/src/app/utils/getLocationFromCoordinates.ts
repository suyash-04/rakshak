const apiKey = '723912d1aa5143ca8b597c5077687f6d';

export async function getLocationFromCoordinates(latitude: number, longitude: number): Promise<string> {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
    } else {
        throw new Error('Location not found');
    }
}