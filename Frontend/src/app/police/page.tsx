'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertTriangle, PhoneCall } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"


export default function PoliceDashboard() {

    const { toast } = useToast();

    const handleRespond = (location: string) => {
        toast({
            title: "Response Initiated",
            description: `An officer has been dispatched to ${location}.`,
        });
    };

    // This data would typically come from your backend
    const stats = {
        totalCalls: 127,
        pendingAccidents: 14,
        solvedAccidents: 113,
        officersOnDuty: 32
    };

    const recentReports = [
        { id: 1, location: "Kathmandu, Durbar Marg", time: "10:30 AM", status: "Pending" },
        { id: 2, location: "Lalitpur, Pulchowk", time: "11:15 AM", status: "Responded" },
        { id: 3, location: "Bhaktapur, Suryabinayak", time: "11:45 AM", status: "Pending" },
        { id: 4, location: "Pokhara, Lakeside", time: "12:20 PM", status: "Cleared" },
        { id: 5, location: "Chitwan, Bharatpur", time: "1:05 PM", status: "Pending" },
    ];

    return (
            <div className="flex flex-col h-screen">
                <header className="bg-primary text-primary-foreground p-4">
                    <h1 className="text-2xl font-bold">Accident Response Dashboard - Police</h1>
                </header>
                <main className="flex-grow p-6 bg-background">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Recent Accident Reports</CardTitle>
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
                                                        report.status === 'Responded' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={() => handleRespond(report.location)}
                                                    disabled={report.status !== 'Pending'}
                                                >
                                                    Respond
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