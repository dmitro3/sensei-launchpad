import { useState } from "react";

export default function useChart(values) {
  const [chart, setChart] = useState(values);

  function handleChartArray(segmentIndex) {
    setChart((state) =>
      state.map((item, index) => ({ ...item, active: index === segmentIndex }))
    );
  }

  return {
    chart,
    handleChartArray,
  };
}
