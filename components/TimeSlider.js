import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const marks = {
  0: "00:00",
  360: "06:00",
  720: "12:00",
  1080: "18:00",
  1380: "23:00"
};

export default function TimeSlider() {
  const [range, setRange] = useState([0, 1440]);

  const formatTime = (val) => {
    const h = String(Math.floor(val / 60)).padStart(2, "0");
    const m = String(val % 60).padStart(2, "0");
    return `${h}:${m}`;
  };

  return (
    <div>
      <Slider
        range
        min={0}
        max={1440}
        step={15}
        value={range}
        onChange={(val) => setRange(val)}
        marks={marks}
      />
      <div className="text-sm mt-2">
        From: {formatTime(range[0])} — To: {formatTime(range[1])}
      </div>
    </div>
  );
}
