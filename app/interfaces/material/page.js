"use client";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Image from "next/image";
import AddBlue from '../../assets/area/add-blue.png'
import Spinner from "@/app/components/Spinner/loadSpinner";
import BackButton from "@/app/components/backButton/backButton";
import LoadingIndicator from "@/app/components/loadingIndicator/loadingIndicator";

export default function MaterialForm() {

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors,isSubmitting },
  } = useForm();

  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [types, setTypes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [nextProductId, setNextProductId] = useState(null);
  const [savingModal, setSavingModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(null); 
  const [newOptionName, setNewOptionName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
  setLoading(true);
  const [prodRes, unitRes, typeRes, compRes] = await Promise.all([
    fetch("/api/materials"),
    fetch("/api/units"),
    fetch("/api/types"),
    fetch("/api/companies"),
  ]);
  setLoading(false);
  if (prodRes.ok) {
    const { products, nextId } = await prodRes.json();
    setProducts(products);
    setNextProductId(nextId);
  }
  if (unitRes.ok) {
    const { data } = await unitRes.json();
    setUnits(data);
  }
  if (typeRes.ok) {
    const { data } = await typeRes.json();
    setTypes(data);
  }
  if (compRes.ok) {
    const { data } = await compRes.json();
    setCompanies(data);
  }
};


  useEffect(() => {
  fetchData();
}, []);

  const onSubmit = async (data) => {
        try {
          const payload = {
            product_name_eng: data.nameEng,
            product_name_urd: data.nameUrd || null,
            packing_no: Number(data.packing),
            unit_id: data.unit.value,
            reorder_level: Number(data.reorder),
            sales_mc: Number(data.saleMc),
            purchase_price: Number(data.pPrice),
            sale_price: Number(data.sPrice),
            type_id: data.type.value,
            company_id: data.company.value,
            location: data.pLocation || null,
          };

          let res;
          if (data.previousProduct) {
             res = await fetch(`/api/materials/${data.previousProduct.value}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

          } else {
            res = await fetch("/api/materials", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Something went wrong");

          alert(data.previousProduct ? "Product updated!" : "Product created!");

          await fetchData(); 
           reset({
            previousProduct: null,
            nameEng: "",
            nameUrd: "",
            packing: "",
            unit: null,
            reorder: "",
            saleMc: "",
            pPrice: "",
            sPrice: "",
            type: null,
            company: null,
            pLocation: "",
          });
        } catch (err) {
          console.error("Save failed:", err);
          alert(err.message);
        }
      };


  const addOption = async (type) => {
  if (!newOptionName.trim()) return;

  setSavingModal(true);
  try {
    let url = "";
    if (type === "unit") url = "/api/units";
    else if (type === "type") url = "/api/types";
    else if (type === "company") url = "/api/companies";
    else throw new Error("Invalid type");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newOptionName.trim() }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Failed to add");

    await fetchData();
  } catch (err) {
    console.error("Add option failed:", err);
    alert(err.message);
  } finally {
    setSavingModal(false);
    setModalOpen(null);
    setNewOptionName("");
  }
};

  return (
    <main className="relative m-10 flex flex-col">
          {loading && <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center">
              <div className="p-3 flex items-center justify-center h-[50px] text-white w-[100px] rounded-lg">
                <LoadingIndicator />
              </div>
            </div>}
      <div className='flex flex-row mb-10'>
                      <BackButton />
                     <p className="text-3xl font-bold">Add New Material</p></div>
      <div className="w-full flex justify-center align-middle">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-md w-4/5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
              <p className="font-semibold">Product ID (auto)</p>
              <input
                readOnly
                value={
                  watch("previousProduct") 
                    ? watch("previousProduct").value 
                    : nextProductId || ""             
                }
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full bg-gray-100"
              />
            </div>
          <div>
              <p className="font-semibold">Previous Products</p>
              <Controller
                control={control}
                name="previousProduct"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={products.map((p) => ({
                      value: p.product_id,
                      label: p.product_name_eng,
                    }))}
                    placeholder="Search product..."
                    isSearchable
                    onChange={(opt) => {
                      field.onChange(opt);
                      if (opt) {setLoading(true);
                        fetch(`/api/materials/${opt.value}`)  
                          .then((res) => res.json())
                          .then((product) => {
                            if (product) { 
                             reset({
                                  previousProduct: opt,
                                  nameEng: product.product_name_eng,
                                  nameUrd: product.product_name_urd || "",
                                  packing: product.packing_no,
                                  unit: units.find((u) => u.unit_id === product.unit_id)
                                    ? {
                                        value: product.unit_id,
                                        label: units.find((u) => u.unit_id === product.unit_id).unit_name,
                                      }
                                    : null,
                                  reorder: product.reorder_level,
                                  saleMc: product.sales_mc,
                                  pPrice: product.purchase_price,
                                  sPrice: product.sale_price,
                                  type: types.find((t) => t.type_id === product.type_id)
                                    ? {
                                        value: product.type_id,
                                        label: types.find((t) => t.type_id === product.type_id).type_name,
                                      }
                                    : null,
                                  company: companies.find((c) => c.company_id === product.company_id)
                                    ? {
                                        value: product.company_id,
                                        label: companies.find((c) => c.company_id === product.company_id).company_name,
                                      }
                                    : null,
                                  pLocation: product.location || "",
                                });

                            } setLoading(false);
                          });

                      } else {
                        reset(); 
                      }
                    }}
                  />
                )}
              />
            </div>
        </div>

        <div>
          <p  className="font-semibold">Product Name (English) *</p>
          <input
            {...register("nameEng", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
            placeholder="Enter product name in English"
          />
          {errors.nameEng && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

       
        <div>
          <p  className="font-semibold">Product Name (Urdu)</p>
          <input
            {...register("nameUrd")}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
            placeholder="Enter product name in Urdu"
          />
        </div>

   
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p  className="font-semibold">Packing *</p>
            <input
              type="number"
              {...register("packing", { required: true })}
              className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
              placeholder="Enter packing quantity"
            />
          </div>
          <div>
            <p  className="font-semibold">Unit *</p>
            <div className="flex gap-2">
              <Controller
                control={control}
                name="unit"
               
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                   
                    {...field}
                    options={units.map((u) => ({ value: u.unit_id, label: u.unit_name }))}
                    placeholder="Select unit..."
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "200px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        minWidth: "150px", 
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: "200px", 
                      }),
                    }}
                    
                  />
                )}
              />

              <button
                type="button"
                onClick={() => setModalOpen("unit")}
                className="p-3 flex justify-around align-middle border h-[50px] w-[100px] rounded-xl cursor-pointer hover:shadow-lg bg-[#141413] border-none text-white ml-2'"
              > <Image height={30} width={25} src={AddBlue} alt='Add-icon'/>
                Add
              </button>
            </div>
            {errors.unit && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p  className="font-semibold">ReOrder *</p>
            <input
              type="number"
              {...register("reorder", { required: true })}
              className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
              placeholder="Enter reorder level"
            />
          </div>
          <div>
            <p  className="font-semibold">Sale M.C. *</p>
            <input
              type="number"
              {...register("saleMc", { required: true })}
              className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
              placeholder="Enter Sale M.C."
            />
          </div>
        </div>

       
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p  className="font-semibold">P Price *</p>
            <input
              type="number"
              {...register("pPrice", { required: true })}
              className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
              placeholder="Enter purchase price"
            />
          </div>
          <div>
            <p  className="font-semibold">S Price *</p>
            <input
              type="number"
              {...register("sPrice", { required: true })}
              className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
              placeholder="Enter sale price"
            />
          </div>
        </div>

        <div>
          <p  className="font-semibold">Type *</p>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={types.map((t) => ({ value: t.type_id, label: t.type_name }))}
                  placeholder="Select type..."
                   styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "400px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        minWidth: "250px", 
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: "400px", 
                      }),
                    }}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setModalOpen("type")}
             className="p-3 flex justify-around align-middle border h-[50px] w-[100px] rounded-xl cursor-pointer hover:shadow-lg bg-[#141413] border-none text-white ml-2'"
              > <Image height={30} width={25} src={AddBlue} alt='Add-icon'/>
              Add
            </button>
          </div>
          {errors.type && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>

        <div>
          <p  className="font-semibold">Company Name *</p>
          <div className="flex gap-2">
            <Controller
              control={control}
              name="company"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={companies.map((c) => ({
                    value: c.company_id,
                    label: c.company_name,
                  }))}
                  placeholder="Select company..."
                   styles={{
                      container: (provided) => ({
                        ...provided,
                        width: "400px",
                      }),
                      control: (provided) => ({
                        ...provided,
                        minWidth: "250px", 
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: "400px", 
                      }),
                    }}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setModalOpen("company")}
              className="p-3 flex justify-around align-middle border h-[50px] w-[100px] rounded-xl cursor-pointer hover:shadow-lg bg-[#141413] border-none text-white ml-2'"
              > <Image height={30} width={25} src={AddBlue} alt='Add-icon'/>
              Add
            </button>
          </div>
          {errors.company && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
        <div>
          <p  className="font-semibold">Location</p>
          <input
            {...register("pLocation")}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
            placeholder="Enter location here"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="p-3 flex justify-center align-middle border h-[50px] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[150px]"
            disabled={isSubmitting}
          >
            { isSubmitting ? <Spinner /> : watch("previousProduct") ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
     </div>
    
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add New {modalOpen === "unit"
                ? "Unit"
                : modalOpen === "type"
                ? "Type"
                : "Company"}
            </h3>
            <input
              className="w-full border rounded-lg p-2 mb-4"
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              placeholder="Enter name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setModalOpen(null);
                  setNewOptionName("");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => addOption(modalOpen)}
                className="p-3 flex justify-center align-middle border h-[50px] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[100px]"
              >
                {savingModal ? <Spinner/> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
