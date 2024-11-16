'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Ambulance } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function AmbulanceDashboard() {
    const { toast } = useToast();

    const handleDispatch = (location: string) => {
        toast({
            title: "Dispatch Initiated",
            description: `An ambulance has been dispatched to ${location}.`,
        });
    };

    // This data would typically come from your backend
    const stats = {
        totalCalls: 92,
        pendingCases: 18,
        resolvedCases: 74,
        ambulancesOnDuty: 15
    };

    const recentReports = [
        { id: 1, location: "Kathmandu, Durbar Marg", time: "10:30 AM", status: "Pending" },
        { id: 2, location: "Lalitpur, Pulchowk", time: "11:15 AM", status: "Dispatched" },
        { id: 3, location: "Bhaktapur, Suryabinayak", time: "11:45 AM", status: "Pending" },
        { id: 4, location: "Pokhara, Lakeside", time: "12:20 PM", status: "Resolved" },
        { id: 5, location: "Chitwan, Bharatpur", time: "1:05 PM", status: "Pending" },
    ];

    return (
        <div className="flex flex-col h-screen">
            <header className="bg-primary text-primary-foreground p-4">
                <h1 className="text-2xl font-bold">Ambulance Response Dashboard</h1>
            </header>
            <main className="flex-grow p-6 bg-background">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Emergency Calls</CardTitle>
                            <Ambulance className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCalls}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Cases</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingCases}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ambulances on Duty</CardTitle>
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
                                <rect x="1" y="3" width="22" height="13" rx="2" ry="2" />
                                <path d="M16 8V7a4 4 0 0 0-8 0v1M2 21h20M5 17h14" />
                            </svg>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.ambulancesOnDuty}</div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Emergency Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">{report.location}</TableCell>
                                        <TableCell>{report.time}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                report.status === 'Dispatched' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleDispatch(report.location)}
                                                disabled={report.status !== 'Pending'}
                                            >
                                                Dispatch
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
