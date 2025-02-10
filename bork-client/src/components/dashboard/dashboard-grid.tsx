// components/dashboard-grid.tsx
import { useState, useEffect } from "react";
import { WidgetType, GridCell, WidgetConfig } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";
import WidgetRenderer from "./widget-renderer";

const GRID_COLS = 3;
const GRID_ROWS = 2;
const CELLS_PER_PAGE = GRID_COLS * GRID_ROWS;

export default function DashboardGrid() {
  // Start with one page of empty cells.
  const [cells, setCells] = useState<GridCell[]>(Array(CELLS_PER_PAGE).fill({ type: 'empty' }));
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({ type: 'summary', wallet: '' });
  
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboardConfig');
    if (saved) setCells(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever cells change
  useEffect(() => {
    localStorage.setItem('dashboardConfig', JSON.stringify(cells));
  }, [cells]);

  // Handle widget addition on a cell.
  const handleAddWidget = (index: number) => {
    setSelectedCell(index + currentPage * CELLS_PER_PAGE);
    // Reset widget config to default
    setWidgetConfig({ type: 'summary', wallet: '' });
  };
  
  const handleSaveWidget = () => {
    if (selectedCell === null) return;
    
    // When saving, update the cell at selectedCell index.
    setCells(prev => {
      // (Safety) If the selectedCell index is beyond current array length, extend it.
      let newCells = [...prev];
      if (selectedCell >= newCells.length) {
        const pagesToAdd = Math.floor((selectedCell - newCells.length) / CELLS_PER_PAGE) + 1;
        newCells = newCells.concat(Array(pagesToAdd * CELLS_PER_PAGE).fill({ type: 'empty' }));
      }
      newCells[selectedCell] = {
        type: widgetConfig.type,
        wallet: widgetConfig.wallet,
        isLoading: true
      };
      return newCells;
    });

    setSelectedCell(null);
  };

  const handleRemoveWidget = (index: number) => {
    setCells(prev => {
      const newCells = [...prev];
      newCells[index + currentPage * CELLS_PER_PAGE] = { type: 'empty' };
      return newCells;
    });
  };

  // Compute total pages from the cells array
  const totalPages = Math.ceil(cells.length / CELLS_PER_PAGE);

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigate to the next page.
  // If you are on the last page, automatically add a new page.
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      // Extend the cells array with a new page of empty cells.
      setCells(prev => [...prev, ...Array(CELLS_PER_PAGE).fill({ type: 'empty' })]);
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {cells
          .slice(currentPage * CELLS_PER_PAGE, (currentPage + 1) * CELLS_PER_PAGE)
          .map((cell, index) => (
            <div key={index} className="relative h-64 border-2 border-dashed rounded-lg flex items-center justify-center">
              {cell.type === 'empty' ? (
                <button 
                  onClick={() => handleAddWidget(index)}
                  className="text-4xl text-gray-500 hover:text-gray-700"
                >
                  +
                </button>
              ) : (
                <>
                  <WidgetRenderer 
                    type={cell.type}
                    wallet={cell.wallet ?? ""}
                    onLoaded={() =>
                      setCells(prev => {
                        const newCells = [...prev];
                        newCells[index + currentPage * CELLS_PER_PAGE].isLoading = false;
                        return newCells;
                      })
                    }
                  />
                  <button 
                    onClick={() => handleRemoveWidget(index)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                  {cell.isLoading && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                      <Loader2 className="animate-spin" />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </Button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <Button onClick={handleNextPage}>
          Next
        </Button>
      </div>

      {/* Add Widget Dialog */}
      <Dialog open={selectedCell !== null} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Widget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <select
              value={widgetConfig.type}
              onChange={(e) =>
                setWidgetConfig(prev => ({ ...prev, type: e.target.value as WidgetType }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="summary">Summary</option>
              <option value="topNft">Top NFT</option>
              <option value="volumeChart">Volume Chart</option>
              <option value="netWorth">Net Worth</option>
              <option value="balancesTable">Balances Table</option>
              <option value="stakedTable">Staked Table</option>
            </select>
            <Input
              placeholder="Enter wallet address"
              value={widgetConfig.wallet ?? ""}
              onChange={(e) =>
                setWidgetConfig(prev => ({ ...prev, wallet: e.target.value }))
              }
            />
            <Button onClick={handleSaveWidget} className="w-full">
              Add Widget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
