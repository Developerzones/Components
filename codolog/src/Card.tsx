import React, { useRef, useEffect, useState } from "react";

// Define job type
interface Job {
  title: string;
  company: string;
  location: string;
  ctc: string | number;
  image?: string;
}

// Card Component
function Card({ title, company, location, ctc, image }: Job) {
  return (
    <div
      className="min-w-[280px] max-w-[280px] flex-shrink-0 rounded-2xl 
      bg-white/70 backdrop-blur-lg border border-slate-200 shadow-md 
      p-4 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="mb-3 h-32 w-full rounded-xl object-cover"
        />
      )}

      <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
        <span className="material-symbols-outlined text-sm">verified</span>
        Actively Hiring
      </div>

      <h3 className="text-base font-semibold text-slate-900 leading-tight">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-600">{company}</p>

      <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">location_on</span>
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined">payments</span>
          <span>{ctc} /year</span>
        </div>
      </div>

      <div className="mt-4">
        <button className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
          View Details
        </button>
      </div>
    </div>
  );
}

// Props type for CardList
interface CardListProps {
  jobs: Job[];
}

// CardList Component
function CardList({ jobs }: CardListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth - 100;
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => scroll("left")}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-100"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-none"
      >
        {jobs.map((job, index) => (
          <Card key={index} {...job} />
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-slate-100"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}

// App Component
export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "https://mocki.io/v1/a4bac30a-056c-43b3-bb75-114c11f3d921"
        );
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-50 p-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Fresher Jobs</h1>

      {loading ? (
        <p className="text-slate-600">Loading jobs...</p>
      ) : (
        <CardList jobs={jobs} />
      )}
    </div>
  );
}
