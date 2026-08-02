import React, { useState } from "react";
import {
  Database,
  Plus,
  Trash2,
  Table,
  Columns,
  Code,
  Sparkles,
  Key,
  Check,
  Search,
  FileCode,
  Edit2
} from "lucide-react";
import { DbProject, DbTable, DbColumn, ColumnType } from "../../types";

interface DatabaseStudioProps {
  dbProject: DbProject;
  setDbProject: React.Dispatch<React.SetStateAction<DbProject>>;
  onOpenAiModal: () => void;
}

export const DatabaseStudio: React.FC<DatabaseStudioProps> = ({
  dbProject,
  setDbProject,
  onOpenAiModal,
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(
    dbProject.tables[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<"data" | "schema" | "sql">("data");
  const [newRowInput, setNewRowInput] = useState<Record<string, string>>({});
  const [isAddingRow, setIsAddingRow] = useState<boolean>(false);

  const selectedTable = dbProject.tables.find((t) => t.id === selectedTableId) || dbProject.tables[0];

  const handleUpdateTable = (updated: Partial<DbTable>) => {
    if (!selectedTable) return;
    setDbProject((prev) => ({
      ...prev,
      tables: prev.tables.map((t) => (t.id === selectedTable.id ? { ...t, ...updated } : t)),
    }));
  };

  const handleAddTable = () => {
    const newId = `tbl-${Date.now().toString(36)}`;
    const newTable: DbTable = {
      id: newId,
      name: `new_table_${dbProject.tables.length + 1}`,
      columns: [
        { name: "id", type: "INTEGER", primaryKey: true, nullable: false },
        { name: "name", type: "VARCHAR", primaryKey: false, nullable: false },
        { name: "created_at", type: "TIMESTAMP", primaryKey: false, nullable: false },
      ],
      rows: [
        { id: 1, name: "サンプルデータ 1", created_at: "2026-08-01 12:00:00" },
      ],
    };

    setDbProject((prev) => ({ ...prev, tables: [...prev.tables, newTable] }));
    setSelectedTableId(newId);
  };

  const handleDeleteTable = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dbProject.tables.length <= 1) return;
    const remaining = dbProject.tables.filter((t) => t.id !== id);
    setDbProject((prev) => ({ ...prev, tables: remaining }));
    if (selectedTableId === id) {
      setSelectedTableId(remaining[0]?.id || "");
    }
  };

  const handleAddColumn = () => {
    if (!selectedTable) return;
    const newCol: DbColumn = {
      name: `col_${selectedTable.columns.length + 1}`,
      type: "VARCHAR",
      primaryKey: false,
      nullable: true,
    };
    handleUpdateTable({ columns: [...selectedTable.columns, newCol] });
  };

  const handleDeleteColumn = (colName: string) => {
    if (!selectedTable || selectedTable.columns.length <= 1) return;
    handleUpdateTable({
      columns: selectedTable.columns.filter((c) => c.name !== colName),
    });
  };

  const handleInsertRow = () => {
    if (!selectedTable) return;
    const newRowData: Record<string, any> = {};
    selectedTable.columns.forEach((col) => {
      let val = newRowInput[col.name];
      if (col.type === "INTEGER") val = Number(val) || Math.floor(Math.random() * 1000);
      newRowData[col.name] = val || (col.type === "TIMESTAMP" ? "2026-08-01 12:00:00" : "Sample");
    });

    handleUpdateTable({ rows: [...selectedTable.rows, newRowData] });
    setNewRowInput({});
    setIsAddingRow(false);
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!selectedTable) return;
    const remainingRows = selectedTable.rows.filter((_, idx) => idx !== rowIndex);
    handleUpdateTable({ rows: remainingRows });
  };

  // Generate DDL SQL schema definition
  const generateSqlScript = () => {
    if (!selectedTable) return "";
    const colDefs = selectedTable.columns.map((c) => {
      let def = `  "${c.name}" ${c.type}`;
      if (c.primaryKey) def += " PRIMARY KEY";
      if (!c.nullable) def += " NOT NULL";
      if (c.defaultValue) def += ` DEFAULT ${c.defaultValue}`;
      return def;
    });

    const createSql = `CREATE TABLE IF NOT EXISTS "${selectedTable.name}" (\n${colDefs.join(",\n")}\n);`;

    const sampleInserts = selectedTable.rows.map((row) => {
      const keys = Object.keys(row).map((k) => `"${k}"`).join(", ");
      const vals = Object.values(row).map((v) => (typeof v === "number" ? v : `'${v}'`)).join(", ");
      return `INSERT INTO "${selectedTable.name}" (${keys}) VALUES (${vals});`;
    }).join("\n");

    return `-- Table Schema DDL Migration for ${selectedTable.name}\n${createSql}\n\n-- Sample Data Ingestion\n${sampleInserts}`;
  };

  const [mobileTab, setMobileTab] = useState<"tables" | "content">("content");

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden">
      {/* Mobile Sub-Navigation Bar (visible only on mobile) */}
      <div className="flex md:hidden bg-slate-900 border-b border-slate-800 p-1.5 shrink-0 justify-around">
        <button
          onClick={() => setMobileTab("tables")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "tables" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>テーブル一覧</span>
        </button>
        <button
          onClick={() => setMobileTab("content")}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            mobileTab === "content" ? "bg-cyan-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>データ・スキーマ</span>
        </button>
      </div>

      {/* Left Column: Tables Navigation */}
      <div
        className={`w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900 flex flex-col shrink-0 ${
          mobileTab === "tables" ? "flex flex-1" : "hidden md:flex"
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm text-white">テーブル一覧</span>
          </div>
          <button
            onClick={onOpenAiModal}
            className="text-xs flex items-center space-x-1 text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI生成</span>
          </button>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {dbProject.tables.map((table) => {
            const isSelected = table.id === selectedTableId;
            return (
              <div
                key={table.id}
                onClick={() => {
                  setSelectedTableId(table.id);
                  if (window.innerWidth < 768) setMobileTab("content");
                }}
                className={`group flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "bg-cyan-500/10 border-cyan-500 text-white shadow-sm"
                    : "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <Table className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono text-xs font-semibold text-slate-200 truncate">{table.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{table.rows.length} rows</span>
                <button
                  onClick={(e) => handleDeleteTable(table.id, e)}
                  className="opacity-80 md:opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:bg-rose-500/20 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Create Table Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-900">
          <button
            onClick={handleAddTable}
            className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新規テーブル作成</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div
        className={`flex-1 flex flex-col bg-slate-950 overflow-hidden ${
          mobileTab === "content" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Header Tabs */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/60 px-3 sm:px-4 flex items-center justify-between shrink-0 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab("data")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition whitespace-nowrap ${
                activeTab === "data" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>データ ({selectedTable?.rows.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab("schema")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition whitespace-nowrap ${
                activeTab === "schema" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>スキーマ ({selectedTable?.columns.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveTab("sql")}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center space-x-1 transition whitespace-nowrap ${
                activeTab === "sql" ? "bg-cyan-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>SQL</span>
            </button>
          </div>

          {selectedTable && (
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-xs font-mono text-cyan-300 font-bold">{selectedTable.name}</span>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        {selectedTable && (
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
            {activeTab === "data" ? (
              <div className="space-y-4">
                {/* Data Grid Toolbar */}
                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-300 font-semibold">データレコード一覧</span>
                  <button
                    onClick={() => setIsAddingRow(true)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新規レコード挿入</span>
                  </button>
                </div>

                {/* Inline Insert Row Form */}
                {isAddingRow && (
                  <div className="bg-slate-900 border border-cyan-500/50 p-4 rounded-xl space-y-3 shadow-lg">
                    <span className="text-xs font-bold text-cyan-400 block">新規行データの入力</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {selectedTable.columns.map((col) => (
                        <div key={col.name}>
                          <label className="block text-[11px] text-slate-400 font-mono mb-1">{col.name}</label>
                          <input
                            type="text"
                            value={newRowInput[col.name] || ""}
                            onChange={(e) => setNewRowInput({ ...newRowInput, [col.name]: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                            placeholder={col.type}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsAddingRow(false)}
                        className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleInsertRow}
                        className="px-4 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded"
                      >
                        追加保存
                      </button>
                    </div>
                  </div>
                )}

                {/* Data Grid Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-800/80 border-b border-slate-700 text-slate-300 font-mono">
                        {selectedTable.columns.map((col) => (
                          <th key={col.name} className="p-3 font-semibold">
                            <div className="flex items-center space-x-1">
                              {col.primaryKey && <Key className="w-3 h-3 text-amber-400" />}
                              <span>{col.name}</span>
                              <span className="text-[10px] text-slate-500 font-normal">({col.type})</span>
                            </div>
                          </th>
                        ))}
                        <th className="p-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono text-slate-200">
                      {selectedTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40 transition">
                          {selectedTable.columns.map((col) => (
                            <td key={col.name} className="p-3 max-w-xs truncate">
                              {String(row[col.name] ?? "null")}
                            </td>
                          ))}
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteRow(rIdx)}
                              className="p-1 text-rose-400 hover:bg-rose-500/20 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === "schema" ? (
              /* Schema Column Designer */
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">テーブルカラム設計</h3>
                    <p className="text-xs text-slate-400">型定義、主キー(Primary Key)、NULL許可属性を設定</p>
                  </div>
                  <button
                    onClick={handleAddColumn}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>カラム追加</span>
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                  <div className="divide-y divide-slate-800">
                    {selectedTable.columns.map((col, cIdx) => (
                      <div key={cIdx} className="p-4 flex items-center justify-between space-x-4 bg-slate-900/50">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                          <input
                            type="text"
                            value={col.name}
                            onChange={(e) => {
                              const newCols = [...selectedTable.columns];
                              newCols[cIdx].name = e.target.value;
                              handleUpdateTable({ columns: newCols });
                            }}
                            className="bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-cyan-300"
                          />

                          <select
                            value={col.type}
                            onChange={(e) => {
                              const newCols = [...selectedTable.columns];
                              newCols[cIdx].type = e.target.value as ColumnType;
                              handleUpdateTable({ columns: newCols });
                            }}
                            className="bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-white"
                          >
                            <option value="INTEGER">INTEGER</option>
                            <option value="VARCHAR">VARCHAR</option>
                            <option value="TEXT">TEXT</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                            <option value="TIMESTAMP">TIMESTAMP</option>
                            <option value="DECIMAL">DECIMAL</option>
                          </select>

                          <div className="flex items-center space-x-4 text-xs text-slate-300">
                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={col.primaryKey}
                                onChange={(e) => {
                                  const newCols = [...selectedTable.columns];
                                  newCols[cIdx].primaryKey = e.target.checked;
                                  handleUpdateTable({ columns: newCols });
                                }}
                                className="accent-amber-500"
                              />
                              <span className="font-mono text-[11px]">Primary Key</span>
                            </label>

                            <label className="flex items-center space-x-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={col.nullable}
                                onChange={(e) => {
                                  const newCols = [...selectedTable.columns];
                                  newCols[cIdx].nullable = e.target.checked;
                                  handleUpdateTable({ columns: newCols });
                                }}
                                className="accent-cyan-500"
                              />
                              <span className="font-mono text-[11px]">Nullable</span>
                            </label>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteColumn(col.name)}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/20 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* SQL DDL Code View */
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
                  <span className="text-xs font-semibold text-slate-300">生成されたSQL Migration Script</span>
                  <pre className="p-4 bg-slate-950 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto border border-slate-800 leading-relaxed">
                    {generateSqlScript()}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
