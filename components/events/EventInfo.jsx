// @/components/events/EventInfo.js
const EventInfo = ({ event }) => (
  <div>
    <h1 className="text-3xl font-bold text-center mb-8 text-white">
      {event.event_name}
    </h1>
    {/* <p className="text-lg text-center mb-6">{event.event_description}</p> */}
  </div>
);

export default EventInfo;
