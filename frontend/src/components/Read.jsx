import Story from "./Story";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

export default function Sightings() {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        setIsLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error(`${error.status}: ${error}`);
        setError(`Error uploading stories occurred. Please try again`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStories();
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <NavLink
        className="font-custom text-center text-base font-semibold"
        to="/"
      >
        From the Other Side
      </NavLink>
      <h1 className="font-custom text-center text-4xl">Sightings</h1>
      {isLoading && (
        <p className="text-bold mt-6 text-center text-lg">Loading...</p>
      )}
      {!isLoading && error && (
        <p className="text-bold mt-6 text-center text-lg">{error}</p>
      )}
      {!isLoading && !error && (
        <div className="flex flex-col items-center justify-center gap-4">
          {stories.map((story) => (
            <Story
              key={story.title}
              location={story.location}
              timeStamp={story.timeStamp}
              title={story.title}
              text={story.text}
            />
          ))}
        </div>
      )}
    </div>
  );
}
