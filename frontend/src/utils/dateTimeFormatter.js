const dateTimeFormatter = (dateInZFormat) => {
  const options = { year: "numeric", month: "long", "day": "numeric" };
  const date = new Date(dateInZFormat);
  const formattedDate = date.toLocaleDateString("en-us", options);

  const minutesPadded = date.getMinutes().toString().padStart(2, "0");
  const hour = date.getHours();
  const hourPadded = (hour % 12).toString().padStart(2, "0");
  const period = hour < 12 ? "AM" : "PM";
  const formattedTime = `${hourPadded}:${minutesPadded} ${period}`;

  const completeFormattedDateTime = `${formattedDate} | ${formattedTime}`;

  return completeFormattedDateTime;
}

export default dateTimeFormatter
