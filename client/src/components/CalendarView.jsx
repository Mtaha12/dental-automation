import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef } from "react";

export default function CalendarView({ events = [], onDateClick }) {
  const calendarRef = useRef(null);

  const handleDateClick = (arg) => {
    if (onDateClick) {
      onDateClick(arg);
    }
  };

  return (
    <div className="glass-card p-3">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        contentHeight="auto"
        events={events}
        dateClick={handleDateClick}
        selectable={true}
        selectConstraint="businessHours"
        eventClick={(arg) => {
          // Allow event clicking for navigation
          console.log("Event clicked:", arg.event);
        }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        }}
        datesSet={(info) => {
          // Called when the calendar dates change
          console.log("Calendar range changed:", info.startStr, info.endStr);
        }}
        initialDate={new Date()}
      />
    </div>
  );
}
