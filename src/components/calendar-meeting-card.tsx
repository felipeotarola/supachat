interface CalendarMeetingCardProps {
    date: string;
    time: string;
    meetingName?: string;
  }
  export const CalendarMeetingCardComponent = ({
    date,
    time,
    meetingName,
  }: CalendarMeetingCardProps) => {
    return (
      <div className="bg-[#2a2a2a] p-4 rounded-lg border border-gray-700">
        <h3 className="text-white font-medium mb-2">
          {meetingName || "Meeting"}
        </h3>
        <div className="text-gray-300 text-sm">
          <div>Date: {date}</div>
          <div>Time: {time}</div>
        </div>
      </div>
    );
  };