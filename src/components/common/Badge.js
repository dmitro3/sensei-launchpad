export default function Badge({ item, className }) {
  return (
    <div
      className={
        "badge " +
        (item.cancelled
          ? "cancelled "
          : item.startDate < Date.now()
          ? item.endDate < Date.now()
            ? "finished"
            : "live "
          : "upcoming ") +
        (className ? className : "")
      }
    >
      {item.cancelled
        ? "Cancelled"
        : item.startDate < Date.now()
        ? item.endDate < Date.now()
          ? "Sale Ended"
          : "Sale Live"
        : "Upcoming"}
    </div>
  );
}
