export default function Badge({ item, className }) {
  return (
    <div
      className={
        "badge " +
        (item.cancelled
          ? "cancelled "
          : item.status === 1
          ? "claiming"
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
        : item.status === 1
        ? "Claiming"
        : item.startDate < Date.now()
        ? item.endDate < Date.now()
          ? "Sale Ended"
          : "Sale Live"
        : "Upcoming"}
    </div>
  );
}
