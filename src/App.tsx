import { useEffect, useState, useMemo } from "react";
import TableOfContent from "./components/TableOfContent";
import ContentView from "./components/ContentView";
import api from "./services/api";
import "./App.css";
import { ListItem } from "./types/types";

const App: React.FC = () => {
  const [data, setData] = useState<ListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setIsloading] = useState(false);
  const [errorMsg, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true);
      if (errorMsg) setErrorMessage("");

      try {
        const response = await api.get("/data");
        setData(response.data.content.document);
        setSelectedId(response.data.content.document[0].id);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Something went wrong");
      } finally {
        setIsloading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const filteredData = useMemo(
    () => data.filter((item) => item.level === 1 || item.level === 2),
    [data]
  );

  if (loading) {
    return (
      <div className="fx-centar">
        <p>Loading...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="fx-centar">
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="main-container">
      <TableOfContent
        data={filteredData}
        onSelect={handleSelect}
        selectedId={selectedId}
      />
      {selectedId && (
        <ContentView
          data={data}
          onSelect={handleSelect}
          selectedId={selectedId}
        />
      )}
    </div>
  );
};

export default App;
