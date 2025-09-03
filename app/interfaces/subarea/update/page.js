"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import BackButton from "@/app/components/backButton/backButton";
import Spinner from '@/app/components/Spinner/loadSpinner';

export default function UpdateSubarea() {
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubarea, setSelectedSubarea] = useState("");
  const [newSubareaName, setNewSubareaName] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

 
  useEffect(() => {
    async function fetchAreas() {
      const res = await fetch("/api/areas");
      const json = await res.json();
      if (res.ok) setAreas(json.data);
    }
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!selectedArea) return;
    async function fetchSubareas() {
      const res = await fetch(`/api/subareas?areaId=${selectedArea}`);
      const json = await res.json();
      console.log(json)
      if (res.ok) setSubareas(json.data);
    }
    fetchSubareas();
  }, [selectedArea]);

  const onSave = async () => {
    if (!selectedSubarea) {
      setMsg("Please select a subarea");
      return;
    }
    if (!newSubareaName.trim()) {
      setMsg("New subarea name is required");
      return;
    }

    try {
      setSaving(true);
      setMsg("");
      const res = await fetch("/api/subareas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subareaId: selectedSubarea,
          newSubareaName: newSubareaName.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");

      setMsg("Subarea updated successfully!");
      setSelectedSubarea("");
      setNewSubareaName("");
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const areaOptions = areas.map((a) => ({ value: a.area_id, label: a.area_name }));
  const subareaOptions = subareas.map((s) => ({ value: s.subarea_id, label: s.subarea_name }));

  return (
    <main className="m-10 flex flex-col">
       <div className='flex flex-row'>
             <BackButton />
            <p className="text-3xl font-bold">Update a Sub-Area</p></div>
      <div className="flex flex-col gap-6 p-8 bg-white mt-6 rounded-lg shadow-md">
        <div>
          <p>Area</p>
          <Select
            options={areaOptions}
            value={areaOptions.find((o) => o.value === selectedArea)}
            onChange={(opt) => {
              setSelectedArea(opt.value);
              setSelectedSubarea("");
            }}
            placeholder="Select Area..."
            isSearchable
          />
        </div>

        {selectedArea && (
          <div>
            <p>Sub-area</p>
            <Select
              options={subareaOptions}
              value={subareaOptions.find((o) => o.value === selectedSubarea)}
              onChange={(opt) => setSelectedSubarea(opt.value)}
              placeholder="Select Subarea..."
              isSearchable
            />
          </div>
        )}

        <div>
          <p>Enter New Sub-area Name</p>
          <input
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
            type="text"
            placeholder="Subarea Name"
            value={newSubareaName}
            onChange={(e) => setNewSubareaName(e.target.value)}
          />
        </div>

        {msg && <div className="text-sm">{msg}</div>}

        <div className="flex justify-end">
          <button
            className="p-3 flex justify-center align-middle border-2 border-solid border-[#e7ebee] rounded-lg shadow-md cursor-pointer w-[100px] font-semibold hover:shadow-lg"
            type="button"
            onClick={() => {
              setSelectedArea("");
              setSelectedSubarea("");
              setNewSubareaName("");
              setMsg("");
            }}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="p-3 ml-2 h-[50px] w-[180px] flex justify-center align-middle rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] text-white"
            type="button"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? <Spinner /> : "Update Subarea"}
          </button>
        </div>
      </div>
    </main>
  );
}
