import { AlertCircle } from 'react-feather';

interface NewsProps {
    accidents: { id: number; location: string }[];
}

const News: React.FC<NewsProps> = ({ accidents }) => (
    <div className="bg-white p-4 md:w-80 flex flex-col shadow-lg">
        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Recent Accidents
            </h2>
            <div className="space-y-2">
                {accidents.map((accident) => (
                    <div
                        key={accident.id}
                        className="p-3 rounded-lg bg-red-50"
                    >
                        <p className="font-medium text-sm">
                            Accident Reported at {accident.location}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default News;