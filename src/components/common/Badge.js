export default function Badge({ item, className }) {
  return (
    <div
      className={
        "badge " +
        (item.status === 0
          ? "upcoming"
          : item.cancelled
          ? "cancelled "
          : item.status === 2
          ? "claiming"
          : item.startDate < Date.now()
          ? item.endDate < Date.now()
            ? "finished"
            : "live "
          : "upcoming ") +
        (className ? className : "")
      }
    >
      {item.status === 0
        ? "Revision"
        : item.cancelled
        ? "Cancelled"
        : item.status === 2
        ? "Claiming"
        : item.startDate < Date.now()
        ? item.endDate < Date.now()
          ? "Sale Ended"
          : "Sale Live"
        : "Upcoming"}
    </div>
  );
}
