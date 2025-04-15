<label className="block text-sm font-medium mb-1">Departure Time</label>
<div className="flex gap-2">
  <select className="w-full rounded-lg border border-gray-300 p-2">
    {times.map((time) => (
      <option key={time}>{time}</option>
    ))}
  </select>
  <span className="self-center">to</span>
  <select className="w-full rounded-lg border border-gray-300 p-2">
    {times.map((time) => (
      <option key={time}>{time}</option>
    ))}
  </select>
</div>
