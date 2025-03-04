"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AITasks() {
  const { id } = useParams(); // Get the task id from the URL
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("ai_tasks")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setTask(data);
      } catch (error) {
        console.error("Error fetching AI task:", error);
        toast.error("Failed to load AI task. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  // Helper to format dates for the ICS file in UTC (YYYYMMDDTHHmmssZ)
  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Handler to generate and download the ICS file
  const handleAddToCalendar = () => {
    // Our actual fields are date, time, meetingName, meetingContext
    const { date, time, meetingName, meetingContext } = task.parameters || {};

    // Check if we have the minimal required fields
    if (!date || !time || !meetingName) {
      toast.error("Missing event details in task parameters.");
      return;
    }

    // Combine date + time into a JavaScript Date
    const startDateTime = new Date(`${date}T${time}`);
    // Add 1 hour for the end time (adjust as needed)
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const dtStart = formatDateForICS(startDateTime);
    const dtEnd = formatDateForICS(endDateTime);
    const uid = task.id; // or generate a random UID

    // Build ICS content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your App//EN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtStart}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${meetingName}
DESCRIPTION:${meetingContext || ""}
END:VEVENT
END:VCALENDAR`;

    // Create a blob and trigger the download
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Use the meeting name for the file name
    a.download = `${meetingName.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 bg-[#121212] text-white min-h-screen">
        <h1 className="text-2xl font-bold text-white">AI Task Details</h1>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-4 bg-[#121212] text-white min-h-screen">
        No task found for id: {id}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-[#121212] text-white min-h-screen">
      <h1 className="text-2xl font-bold text-white">AI Task Details</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Property</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">ID</TableCell>
            <TableCell>{task.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">User ID</TableCell>
            <TableCell>{task.user_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Task Type</TableCell>
            <TableCell>{task.task_type}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Parameters</TableCell>
            <TableCell>
              <pre className="whitespace-pre-wrap rounded bg-[#222222] p-2 text-sm">
                {JSON.stringify(task.parameters, null, 2)}
              </pre>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Result</TableCell>
            <TableCell>
              <pre className="whitespace-pre-wrap rounded bg-[#222222] p-2 text-sm">
                {JSON.stringify(task.result, null, 2)}
              </pre>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Status</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  task.status === "completed"
                    ? "bg-[#4D8B76]/20 text-[#4D8B76]"
                    : task.status === "failed"
                    ? "bg-red-900/20 text-red-400"
                    : "bg-gray-800/40 text-gray-400"
                }`}
              >
                {task.status}
              </span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Created At</TableCell>
            <TableCell>{new Date(task.created_at).toLocaleString()}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Updated At</TableCell>
            <TableCell>{new Date(task.updated_at).toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {/* Conditionally render the "Add to Calendar" button if the task type is showCalendarMeeting */}
      {task.task_type === "showCalendarMeeting" && (
        <button
          onClick={handleAddToCalendar}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add to Calendar
        </button>
      )}
    </div>
  );
}
