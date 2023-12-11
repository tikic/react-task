import React, { useRef, useEffect } from "react";
import { ListItem } from "../types/types";

interface ContentViewProps {
  data: ListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ContentView: React.FC<ContentViewProps> = ({
  data,
  selectedId,
  onSelect,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (selectedId && headingRef.current) {
      headingRef.current.scrollIntoView({
        block: "start",
      });
    }
  }, [selectedId]);

  const onSelectHeading = (id: string) => {
    onSelect(id);
  };

  return (
    <main className="content-view">
      {data.map((item, index) => (
        <div key={`${index}-${item.id}`} id={item.id}>
          <div className="heading-container">
            <h3
              ref={selectedId === item.id ? headingRef : null}
              className={`title ${
                selectedId === item.id && item.level <= 2
                  ? "selected-heading"
                  : ""
              } ${item.level > 2 ? "not-clickable" : ""}`}
              onClick={() => {
                if (item.level > 2) return;
                onSelectHeading(item.id);
              }}
            >
              {item.name}
            </h3>
          </div>

          <p className="desc">{item.content}</p>
        </div>
      ))}
    </main>
  );
};

export default ContentView;
