import { useState } from "react";
import { NavLink } from "react-router";

export default function UploadSighting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(formData) {
    setIsSubmitting(true);
    setStatusMessage("");
    const rawData = Object.fromEntries(formData);

    const formattedDate = new Date(rawData.datetime).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const payload = {
      title: rawData.title,
      location: rawData.location,
      timeStamp: formattedDate,
      text: rawData.details,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatusMessage({
          type: "Success",
          message: "Your sighting was uploaded!",
        });
      } else {
        setStatusMessage({
          type: "Error",
          message: "The server Ghosted you(!). Please try again",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: "Serious ghouls! Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle =
    "rounded-md bg-white px-2 py-2 text-neutral-800 placeholder:text-neutral-500";

  const inputLabelStyle = "flex flex-col gap-1";

  return (
    <div className="flex flex-col items-center gap-2">
      <NavLink
        className="font-custom text-center text-base font-semibold"
        to="/"
      >
        From the Other Side
      </NavLink>

      <h1 className="font-custom text-center text-4xl" id="form-title">
        Add Sighting
      </h1>

      <form
        id="eventForm"
        action={handleSubmit}

        className="mt-4 flex w-full max-w-xl flex-col gap-4 rounded-md bg-stone-700 px-5 py-7 lg:text-sm"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <div className={`${inputLabelStyle} flex-1`}>
            <label className="font-semibold" htmlFor="title">
              Title:
            </label>
            <input
              required
              type="text"
              id="title"
              name="title"
              placeholder="A ghostly encounter"
              className={`${inputStyle}`}
            />
          </div>

          <div className={`${inputLabelStyle} flex-1`}>
            <label className="font-semibold" htmlFor="datetime">
              Time/Date:
            </label>
            <input
              required
              type="datetime-local"
              id="datetime"
              name="datetime"
              className={`${inputStyle}`}
            />
          </div>
        </div>

        <div className={`${inputLabelStyle}`}>
          <label className="font-semibold" htmlFor="location">
            Location:
          </label>
          <input
            required
            type="text"
            id="location"
            name="location"
            placeholder="London, UK"
            className={`${inputStyle}`}
          />
        </div>

        <div className={`${inputLabelStyle}`}>
          <label className="font-semibold" htmlFor="details">
            Details:
          </label>
          <textarea
            required
            id="details"
            name="details"
            rows="5"
            placeholder="I was trying to get to sleep when..."
            className={`${inputStyle}`}
          ></textarea>
        </div>

        <button
          type="submit"
          className="font-custom rounded-md py-4 text-2xl ring ring-white"
        >
          {isSubmitting ? "Uploading..." : "Submit"}
        </button>
        <div>
          {statusMessage && statusMessage.type === "Error" && (
            <p className="font-bold">
              {statusMessage.type}! {statusMessage.message}
            </p>
          )}
          <p>
            All sightings will be published on our
            <NavLink to="/sightings" className="underline">
              {" "}
              sightings
            </NavLink>{" "}
            page.
          </p>
        </div>
      </form>
    </div>
  );
}
