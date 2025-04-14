import React from "react";
import CreateEvent from "./components/createEventForm";
import DisplayEvents from "./components/DisplayEvents";

function Events() {
  return (
    <div className="font-primary">
      <CreateEvent />
      <DisplayEvents />
    </div>
  );
}

export default Events;
