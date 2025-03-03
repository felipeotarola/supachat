'use client';

import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, MapPin } from 'lucide-react';

// Mock data for events in March 2025
const mockEvents = [
  {
    id: 1,
    title: "AI Strategy Meeting",
    date: new Date(2025, 2, 5), // March 5, 2025
    time: "10:00 AM - 11:30 AM",
    location: "Conference Room A",
    type: "meeting"
  },
  {
    id: 2,
    title: "Product Launch Preparation",
    date: new Date(2025, 2, 12), // March 12, 2025
    time: "2:00 PM - 4:00 PM",
    location: "Main Office",
    type: "important"
  },
  {
    id: 3,
    title: "Team Building Event",
    date: new Date(2025, 2, 15), // March 15, 2025
    time: "All day",
    location: "City Park",
    type: "social"
  },
  {
    id: 4,
    title: "Quarterly Review",
    date: new Date(2025, 2, 20), // March 20, 2025
    time: "9:00 AM - 12:00 PM",
    location: "Board Room",
    type: "important"
  },
  {
    id: 5,
    title: "AI Model Training Session",
    date: new Date(2025, 2, 20), // March 20, 2025 (same day as another event)
    time: "2:00 PM - 5:00 PM",
    location: "Tech Lab",
    type: "training"
  },
  {
    id: 6,
    title: "Client Presentation",
    date: new Date(2025, 2, 25), // March 25, 2025
    time: "11:00 AM - 12:30 PM",
    location: "Client Office",
    type: "meeting"
  }
];

// Function to get events for a specific date
const getEventsForDate = (date: Date) => {
  return mockEvents.filter(event => 
    event.date.getDate() === date.getDate() &&
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );
};

export default function AIDashboard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 2, 1)); // Set to March 2025
  const [selectedEvents, setSelectedEvents] = React.useState<typeof mockEvents>([]);

  // Update selected events when date changes
  React.useEffect(() => {
    if (date) {
      setSelectedEvents(getEventsForDate(date));
    } else {
      setSelectedEvents([]);
    }
  }, [date]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Calendar</h3>
              <p className="text-sm text-muted-foreground">Your scheduled events for March 2025</p>
            </div>
            <div className="p-6 pt-0">
              <TooltipProvider>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  month={new Date(2025, 2)} // Lock to March 2025
                  modifiers={{
                    hasEvent: (date) => getEventsForDate(date).length > 0,
                  }}
                  modifiersStyles={{
                    hasEvent: { 
                      fontWeight: 'bold',
                      textDecoration: 'underline',
                    }
                  }}
                  components={{
                    DayContent: ({ date, activeModifiers }) => {
                      const events = getEventsForDate(date);
                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="relative w-full h-full flex items-center justify-center">
                              {date.getDate()}
                              {events.length > 0 && (
                                <div className="absolute bottom-0 flex gap-0.5 mt-1">
                                  {events.length > 3 ? (
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  ) : (
                                    events.map((event, i) => (
                                      <span 
                                        key={i} 
                                        className={`h-1.5 w-1.5 rounded-full ${
                                          event.type === 'important' ? 'bg-destructive' : 
                                          event.type === 'social' ? 'bg-green-500' : 
                                          event.type === 'training' ? 'bg-blue-500' : 
                                          'bg-primary'
                                        }`} 
                                      />
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          {events.length > 0 && (
                            <TooltipContent className="p-0 w-64">
                              <div className="p-2 bg-muted/50">
                                <p className="font-medium">{events.length} event{events.length > 1 ? 's' : ''}</p>
                              </div>
                              <div className="p-2 space-y-1 max-h-[200px] overflow-auto">
                                {events.map((event) => (
                                  <div key={event.id} className="text-sm">
                                    <div className="font-medium">{event.title}</div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="mr-1 h-3 w-3" />
                                      {event.time}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <MapPin className="mr-1 h-3 w-3" />
                                      {event.location}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    },
                  }}
                />
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="font-semibold leading-none tracking-tight">
              {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No date selected'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedEvents.length > 0 
                ? `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} scheduled` 
                : 'No events scheduled'}
            </p>
          </div>
          <div className="p-6 pt-0">
            {selectedEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant={
                        event.type === 'important' ? 'destructive' : 
                        event.type === 'social' ? 'outline' : 
                        event.type === 'training' ? 'secondary' : 
                        'default'
                      }>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {event.time}
                      </div>
                      <div className="flex items-center mt-1">
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {date ? 'No events scheduled for this day' : 'Select a date to view events'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
