"use client";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../../components/loadingIndicator/loadingIndicator";
import Spinner from '../../../components/Spinner/loadSpinner'
import BackButton from "@/app/components/backButton/backButton";
import Select from "react-select";

export default function AssignAreaPage() {
  const [loading, setLoading] = useState(false);
  const [salesman, setSalesman] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedSalesman, setSelectedSalesman] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [assignedAreas, setAssignedAreas] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const areaRes = await fetch("/api/areas");
      const salesmanRes = await fetch("/api/salesman/addUpdateSalesman");
      const areaJson = await areaRes.json();
      const salesmanJson = await salesmanRes.json();

      if (areaRes.ok) setAreas(areaJson.data || []);
      if (salesmanRes.ok) setSalesman(salesmanJson.salesman_data || []);
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const areaOptions = areas.map((a) => ({
    value: a.area_id,
    label: a.area_name,
  }));

  const salesmanOptions = salesman.map((s) => ({
    value: s.salesman_id,
    label: s.salesman_name,
  }));

  // Add area to salesman
  const handleAssignArea = (areaId) => {
    if (!selectedSalesman) return;
    setAssignedAreas((prev) => {
      const current = prev[selectedSalesman] || [];
      if (current.includes(areaId)) return prev; // avoid duplicates
      return {
        ...prev,
        [selectedSalesman]: [...current, areaId],
      };
    });
  };

  // Remove area from salesman
  const handleRemoveArea = (areaId) => {
    setAssignedAreas((prev) => {
      const current = prev[selectedSalesman] || [];
      return {
        ...prev,
        [selectedSalesman]: current.filter((id) => id !== areaId),
      };
    });
  };

  const fetchAssignedAreas = async (salesmanId) => {
  setLoading(true);
  try {
    const res = await fetch(`/api/salesman/assign/${salesmanId}`);
    if (!res.ok) throw new Error("Failed to fetch assigned areas");

    const data = await res.json();
    setAssignedAreas((prev) => ({
      ...prev,
      [salesmanId]: data.areas.map((a) => a.area_id), // ✅ use area_id
    }));
  } catch (err) {
    console.error(err);
    alert("Error fetching assigned areas");
  } finally {
    setLoading(false);
  }
};

  // Save assignments to backend
 const handleSave = async () => {
  if (!selectedSalesman) return;
  setSaving(true);
  try {
    const res = await fetch(`/api/salesman/assign/${selectedSalesman}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        areaIds: assignedAreas[selectedSalesman] || [], // must be array of IDs
      }),
    });
    if (!res.ok) throw new Error("Failed to save");
    alert("Areas assigned successfully!");
  } catch (err) {
    console.error(err);
    alert("Error saving assignments.");
  } finally{
    setSaving(false);
  }
};

  // Get list of assigned areas for current salesman
  const currentAreas = (assignedAreas[selectedSalesman] || []).map((id) =>
    areas.find((a) => a.area_id === id)
  );

  // Filter with search term
  const filteredAreas = currentAreas.filter((a) =>
    a?.area_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="p-10 flex flex-col">
      {loading && (
        <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="p-3 flex items-center justify-center h-[50px] text-white w-[100px] rounded-lg">
            <LoadingIndicator />
          </div>
        </div>
      )}
      <div className="flex flex-row mb-10">
        <BackButton />
        <p className="font-bold text-3xl">Assign Area</p>
      </div>

      <div className="flex justify-center align-middle w-full">
        <div className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-md w-4/5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                options={salesmanOptions}
                value={salesmanOptions.find((o) => o.value === selectedSalesman)}
                onChange={(opt) => {
                  setSelectedSalesman(opt.value);
                  fetchAssignedAreas(opt.value); // fetch existing areas
                }}
                placeholder="Select Salesman.."
                isSearchable
              />
            </div>
            <div>
              <Select
                options={areaOptions}
                value={areaOptions.find((o) => o.value === selectedArea)}
                onChange={(opt) => {
                  setSelectedArea(opt.value);
                  handleAssignArea(opt.value);
                }}
                placeholder="Select Area..."
                isDisabled={!selectedSalesman}
                isSearchable
              />
            </div>
          </div>

          {/* Assigned areas list */}
          {selectedSalesman && (
            <div className="mt-6">
              <h2 className="font-bold mb-2">Assigned Areas</h2>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded p-2 mb-4 w-full"
              />
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Area Name</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAreas.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center p-2">
                        No areas assigned
                      </td>
                    </tr>
                  ) : (
                    filteredAreas.map((a) => (
                      <tr key={a.area_id}>
                        <td className="border p-2">{a.area_id}</td>
                        <td className="border p-2">{a.area_name}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleRemoveArea(a.area_id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <button className='p-3 flex justify-center align-middle border h-[50px] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[100px]'
                                  type='button'
                                  onClick={handleSave}
                                  disabled={saving} >{saving ? <Spinner/> : "Save"}</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
