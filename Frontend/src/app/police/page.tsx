import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, MapPin, PhoneCall, Clock } from 'lucide-react'
import Map from "../components/Map"


export default function PoliceDashboard() {
    // This data would typically come from your backend
    const stats = {
        totalCalls: 127,
        pendingAccidents: 14,
        solvedAccidents: 0,
        officersOnDuty: 32
    }

    const recentReports = [
        { id: 1, location: "Kathmandu, Durbar Marg", time: "10:30 AM", status: "Pending" },
        { id: 2, location: "Lalitpur, Pulchowk", time: "11:15 AM", status: "Responded" },
        { id: 3, location: "Bhaktapur, Suryabinayak", time: "11:45 AM", status: "Pending" },
        { id: 4, location: "Pokhara, Lakeside", time: "12:20 PM", status: "Cleared" },
        { id: 5, location: "Chitwan, Bharatpur", time: "1:05 PM", status: "Pending" },
    ]

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-primary text-white p-4">
                <h1 className="text-2xl font-bold">Accident Response Dashboard - Police</h1>
            </header>
            <main className="flex-grow p-6 bg-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Accident Calls</CardTitle>
                            <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCalls}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Accidents</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingAccidents}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Officers on Duty</CardTitle>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                className="h-4 w-4 text-muted-foreground"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.officersOnDuty}</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>Accident Map</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                        <Map/>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Accident Reports</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[500px] p-4">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="mb-4 p-3 bg-white rounded-lg shadow">
                                        <div className="font-semibold">{report.location}</div>
                                        <div className="text-sm text-gray-500">{report.time}</div>
                                        <div className={`text-sm mt-1 ${report.status === 'Pending' ? 'text-yellow-600' :
                                                report.status === 'Responded' ? 'text-blue-600' : 'text-green-600'
                                            }`}>
                                            {report.status}
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}