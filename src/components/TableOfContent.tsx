import React, { useState, useEffect, MouseEvent } from "react";
import { ListItem } from '../types/types'; 
import ArrowLeft from "../assets/arrow-left.svg";

interface TableOfContentProps {
  data: ListItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const TableOfContent: React.FC<TableOfContentProps> = ({ data, onSelect, selectedId }) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const level1ItemsWithChildren = data
      .filter(item => item.level === 1 && data.some(child => child.parent_id === item.id))
      .map(item => item.id);

    setOpenItems(level1ItemsWithChildren);
  }, [data]);

  const toggleItem = (id: string) => {
    setOpenItems(prevItems =>
      prevItems.includes(id) ? prevItems.filter(item => item !== id) : [...prevItems, id]
    );
  };

  const hasChildren = (id: string) => data.some(child => child.parent_id === id);

  const renderDropdownLink = (item: ListItem) => {
    const dropdown = hasChildren(item.id);

    return (
      <div key={item.id} className="relative">
        <a
          href="#"
          onClick={(e: MouseEvent) => {
            e.preventDefault();
            toggleItem(item.id);

            if (!dropdown) onSelect(item.id);
          }}
          className={`tree-node ${!dropdown && selectedId === item.id ? "selected-node" : ""}`}
        >
          {hasChildren(item.id) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              className={`${openItems.includes(item.id) ? 'rotate' : ''}`}
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M10.47 8L6.46997 4L5.52997 4.94L8.5833 8L5.52997 11.06L6.46997 12L10.47 8Z"
                fill="black"
                fillOpacity="0.6"
              />
            </svg>
          ) : (
            <img src={ArrowLeft} alt="Arrow" />
          )}
          <span className="tree-title">{item.name}</span>
        </a>
        {openItems.includes(item.id) && hasChildren(item.id) && (
          <div>
            {renderItems(data.filter(child => child.parent_id === item.id))}
          </div>
        )}
      </div>
    );
  };

  const renderItems = (items: ListItem[]) =>
    items.map(item => (
      <div key={item.id}>
        {item.level === 1 ? (
          renderDropdownLink(item)
        ) : (
          <div
            className={`tree-node ${selectedId === item.id ? "selected-node" : ""} level-${item.level}`}
            onClick={() => onSelect(item.id)}
          >
            <img src={ArrowLeft} alt="Arrow" />
            <span className="tree-title">{item.name}</span>
          </div>
        )}
      </div>
    ));

  return (
    <nav className="toc-view">
      {renderItems(data.filter(item => item.level === 1))}
    </nav>
  );
};

export default TableOfContent;
