"use client";
import { useState, useEffect } from "react";
import LoadingIndicator from "@/app/components/loadingIndicator/loadingIndicator";
import Spinner from "@/app/components/Spinner/loadSpinner";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import BackButton from "@/app/components/backButton/backButton";
import {toast } from 'react-toastify'

export default function CustomerManagement() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubarea, setSelectedSubarea] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [nextCustomerId, setNextCustomerId] = useState("");
  const [msg, setMsg] = useState("");

  async function fetchAreas() {
    try {
      const res = await fetch("/api/areas");
      const json = await res.json();
      if (res.ok) setAreas(json.data);
    } catch (err) {
      toast.error('Fetching areas failed')
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch("/api/customer");
      if (res.ok) {
        const { customer_data, nextCustomerId } = await res.json();
        setCustomers(customer_data);
        setNextCustomerId(nextCustomerId);
      } else {
        const json = await res.json();
        toast.error('Failed to fetch Customers')
      }
    } catch (err) {
      toast.error('Failed to fetch Customers')
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
    fetchAreas();
  }, []);

  useEffect(() => {
    if (!selectedArea) return;
    async function fetchSubareas() {
      const res = await fetch(`/api/subareas?areaId=${selectedArea}`);
      const json = await res.json();
      if (res.ok) setSubareas(json.data);
    }
    fetchSubareas();
  }, [selectedArea]);

  const areaOptions = areas.map((a) => ({
    value: a.area_id,
    label: a.area_name,
  }));
  const subareaOptions = subareas.map((s) => ({
    value: s.subarea_id,
    label: s.subarea_name,
  }));

  const onSubmit = async (data) => {
    try {
      const payload = {
        customer_name: data.customerName,
        customer_contact: data.customerContact,
        customer_address: data.customerAddress,
        customer_shop_name: data.customerShopName,
        customer_credit_limit: data.customerCredit,
        subarea_id: selectedSubarea,
      };
      let res;
      if (data.searchCustomer) {
        res = await fetch(`/api/customer/${data.searchCustomer.value}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        setErrorFlag(true);
        setMsg(json.error || "Something went wrong");
        return;
      }
      
      data.searchCustomer ? toast.success("Customer updated successfully!") : toast.success("Customer saved successfully!");
      await fetchCustomers();
      reset({
        customerName: "",
        customerContact: "",
        customerAddress: "",
        customerShopName: "",
        customerCredit: "",
        searchCustomer: null,
        selectedSubarea: "",
        selectedArea: "",
      });
    } catch (err) {
      toast.error('Saving the Customer Failed')
    }
  };

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
        <p className="font-bold text-3xl">Add or Edit Customers</p>
      </div>
      <div className="flex justify-center align-middle w-full">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-md w-4/5"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Customer ID (auto)</p>
              <input
                readOnly
                value={
                  watch("searchCustomer")
                    ? watch("searchCustomer").value
                    : nextCustomerId || ""
                }
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full bg-gray-100"
              />
            </div>
            <div>
              <p className="font-semibold">Search Customer</p>
              <Controller
                control={control}
                name="searchCustomer"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={customers.map((p) => ({
                      value: p.customer_id,
                      label: p.customer_name,
                    }))}
                    placeholder="Search Customers..."
                    isSearchable
                    onChange={(opt) => {
                      field.onChange(opt);
                      if (opt) {
                        setLoading(true);
                        fetch(`/api/customer/${opt.value}`)
                          .then((res) => res.json())
                          .then((customers) => {
                            if (customers) {
                              reset({
                                searchCustomer: opt,
                                customerName: customers.customer_name,
                                customerContact: customers.customer_contact,
                                customerAddress: customers.customer_address,
                                customerShopName: customers.customer_shop_name,
                                customerCredit: customers.customer_credit_limit,
                              });
                              setSelectedArea(customers.area_id);
                              setSelectedSubarea(customers.subarea_id);
                              setMsg("");
                            }
                            setLoading(false);
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Customer Name *</p>
              <input
                {...register("customerName", { required: true })}
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
                placeholder="Enter Customer name "
              />
              {errors.customerName && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>
            <div>
              <p className="font-semibold">Contact *</p>
              <input
                {...register("customerContact", { required: true })}
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
                placeholder="Enter Customer contact number "
                type="tel"
              />
              {errors.customerContact && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold">Customer Address *</p>
            <input
              {...register("customerAddress", { required: true })}
              className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
              placeholder="Enter Customer Address "
            />
            {errors.customerAddress && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Shop/Business Name *</p>
              <input
                {...register("customerShopName", { required: true })}
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
                placeholder="Enter Customer shop or business name "
              />
              {errors.customerShopName && (
                <span className="text-red-500 text-sm">Required</span>
              )}
            </div>
            <div>
              <p className="font-semibold">Credit Limit *</p>
              <input
                type="number"
                {...register("customerCredit", { required: true })}
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full"
                placeholder="Enter the credit limit"
              />
            </div>
            <div>
              <p className=" font-semibold">Area</p>
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
                <p className=" font-semibold">Sub-area</p>
                <Select
                  options={subareaOptions}
                  value={subareaOptions.find(
                    (o) => o.value === selectedSubarea
                  )}
                  onChange={(opt) => setSelectedSubarea(opt.value)}
                  placeholder="Select Subarea..."
                  isSearchable
                />
              </div>
            )}
          </div>
          <span
            className={
              msg
                ? "font-semibold text-[#d82222]"
                : "font-semibold text-[#33cf33]"
            }
          >
            {msg}
          </span>
          <div className="flex justify-end">
            <button
              type="submit"
              className="p-3 flex justify-center align-middle border h-[50px] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[250px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner />
              ) : watch("searchSalesman") ? (
                "Update Customer"
              ) : (
                "Add Customer"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
