import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const SearchBar = ({ searchTerm, setSearchTerm, searchResults }) => (
  <div className="relative w-full max-w-md">
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <Input
        type="text"
        placeholder="Search courses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    {searchResults && searchResults.length > 0 && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
        {searchResults.map((course) => (
          <Link
            key={course.id}
            href={`/course/${course.slug}`}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {course.title}
          </Link>
        ))}
      </div>
    )}
  </div>
);

export default SearchBar;
