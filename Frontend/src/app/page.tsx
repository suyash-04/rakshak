'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertTriangle, Info } from 'lucide-react'
import AccidentReportForm from './components/AccidentForm'

const DynamicMap = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
})

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [coordinates, setCoordinates] = useState<[number, number]>([27.7172, 85.324])




  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Rakshak
          </h1>
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Report an Accident
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Rakshak
            </h2>
            <p className="text-muted-foreground">
              Rakshak provides an enhanced map for safer travel by highlighting accident and disaster-prone areas.
              Stay informed and plan your journey with safety in mind.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-3">
            <CardContent className="p-4">
              <DynamicMap onCoordinateChange={setCoordinates} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Map Legend</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 bg-red-500 rounded-full"></span>
                  High-risk area
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 bg-yellow-500 rounded-full"></span>
                  Moderate-risk area
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-4 w-4 bg-green-500 rounded-full"></span>
                  Low-risk area
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px] z-50">
          <DialogHeader>
            <DialogTitle>Report an Accident</DialogTitle>
          </DialogHeader>
          <AccidentReportForm
            onClose={() => setShowForm(false)}
            coordinates={coordinates}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}