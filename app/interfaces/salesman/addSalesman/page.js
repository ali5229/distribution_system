"use client"
import {useState, useEffect} from 'react'
import BackButton from '@/app/components/backButton/backButton'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'
import Spinner from '@/app/components/Spinner/loadSpinner'
import LoadingIndicator from '@/app/components/loadingIndicator/loadingIndicator'
import {toast } from 'react-toastify'

export default function SalesmanPage() {
  const {
      register,
      handleSubmit,
      watch,
      control,
      reset,
      formState: { errors,isSubmitting },
    } = useForm();

    const [salesman, setSalesman] = useState([]);
    const [nextSalesmanId, setNextSalesmanId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] =useState("");


    const bloodGroupOptions = [
      { value: 'A+', label: 'A+' },
      { value: 'A-', label: 'A-' },
      { value: 'B+', label: 'B+' },
      { value: 'B-', label: 'B-' },
      { value: 'AB+', label: 'AB+' },
      { value: 'AB-', label: 'AB-' },
      { value: 'O+', label: 'O+' },
      { value: 'O-', label: 'O-' },
    ];
  
   async function fetchSalesman() {
      setLoading(true);
      try {
        const res = await fetch("/api/salesman/addUpdateSalesman"); 
        setLoading(false);
        if (res.ok) {
          const { salesman_data, nextSalesmanId } = await res.json();
            setSalesman(salesman_data);
            setNextSalesmanId(nextSalesmanId);
            
        } else {
           const json = await res.json(); 
          setMsg(json.error || "Failed to load Salesman");
        }
      } catch (err) {
        setMsg('Error during fetch request');
      }
    }
    

     useEffect(() => {
    fetchSalesman();
  }, []);


  const onSubmit = async (data) => {
        try {
          const payload = {
            salesman_name: data.salesmanName,
            salesman_bld_grp: data.bloodGroup.value, 
            salesman_contact: data.salesmanContact,
            salesman_emg_contact: data.salesmanEmgContact,
            salesman_address: data.salesmanAddress,
            salesman_reference: data.salesmanReference || "",
          };

          let res;
          if (data.searchSalesman) {
            // Update salesman
            res = await fetch(`/api/salesman/addUpdateSalesman/${data.searchSalesman.value}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } else {
            // Add new salesman
            res = await fetch("/api/salesman/addUpdateSalesman", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }

          const json = await res.json();
          if (!res.ok) {
            setMsg(json.error || "Something went wrong");
            return;
          }

          data.searchSalesman ? toast.success("Salesman updated!") :  toast.success("Salesman added!");

          await fetchSalesman();
          reset({
            salesmanName: "",
            bloodGroup: '1',
            salesmanContact: "",
            salesmanEmgContact: "",
            salesmanAddress: "",
            salesmanReference: "",
            searchSalesman: null,
          });
        } catch (err) {
          setMsg(`Save failed: ${err.message}`);
          alert(err.message);
        }
      };


  

  return (
    <main className='p-10 flex flex-col'>
      {loading && <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center">
                    <div className="p-3 flex items-center justify-center h-[50px] text-white w-[100px] rounded-lg">
                      <LoadingIndicator />
                    </div>
                  </div>}
      <div className="flex flex-row mb-10">
       <BackButton/>
       <p className="font-bold text-3xl">Add or Edit Salesman</p>
      </div>
     <div className="flex justify-center align-middle w-full">
      <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-6 p-8 bg-white rounded-lg shadow-md w-4/5'
      >
       <div className="grid grid-cols-2 gap-4">
          <div>
              <p className="font-semibold">Salesman ID (auto)</p>
              <input
                readOnly
                value={
                  watch("searchSalesman") 
                    ? watch("searchSalesman").value 
                    : nextSalesmanId || ""             
                }
                className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-full bg-gray-100"
              />
            </div>
          <div>
              <p className="font-semibold">Search Salesmen</p>
              <Controller
                control={control}
                name="searchSalesman"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={salesman.map((p) => ({
                      value: p.salesman_id,
                      label: p.salesman_name,
                    }))}
                    placeholder="Search Salesman..."
                    isSearchable
                    onChange={(opt) => {
                      field.onChange(opt);
                      if (opt) {setLoading(true);
                        fetch(`/api/salesman/addUpdateSalesman/${opt.value}`)  
                          .then((res) => res.json())
                          .then((salesman) => {
                            if (salesman) { 
                             reset({
                                  searchSalesman: opt,
                                  salesmanName: salesman.salesman_name,
                                  bloodGroup: bloodGroupOptions.find(bg => bg.value === salesman.salesman_bld_grp),
                                  salesmanContact: salesman.salesman_contact,
                                  salesmanEmgContact: salesman.salesman_emg_contact,
                                  salesmanAddress: salesman.salesman_address,
                                  salesmanReference: salesman.salesman_reference || "",
                                });
                            }  setLoading(false);
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
          <p  className="font-semibold">Salesman Name *</p>
          <input
            {...register("salesmanName", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman name "
          />
          {errors.salesmanName && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
          <div>
            <p className='font-semibold'>Blood Group *</p>
            <Controller
              control={control}
              name="bloodGroup"
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={bloodGroupOptions}
                  placeholder="Select Blood Group"
                  isClearable
                />
              )}
            />
            {errors.bloodGroup && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
           <div>
          <p className="font-semibold">Contact *</p>
          <input
            {...register("salesmanContact", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman contact number "
            type='tel'
          />
          {errors.salesmanContact && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
         <div>
          <p className="font-semibold">Emergency Contact *</p>
          <input
            {...register("salesmanEmgContact", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman contact number "
            type='tel'
          />
          {errors.salesmanEmgContact && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
         
        
      </div>
      <div className="grid grid-cols-2 gap-4">
           <div>
          <p className="font-semibold">Address *</p>
          <input
            {...register("salesmanAddress", { required: true })}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman address "
            type='text'
          />
          {errors.salesmanAddress && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
         <div>
          <p className="font-semibold">Reference</p>
          <input
            {...register("salesmanReference")}
            className="h-[50px] border-2 border-[#F3F6F8] rounded-lg p-3 w-md"
            placeholder="Enter Salesman reference "
            type='text'
          />
          {errors.salesmanReference && (
            <span className="text-red-500 text-sm">Required</span>
          )}
        </div>
      </div>
       { msg && (<span className='text-sm'>{msg}</span>)}
        <div className="flex justify-end">
                  <button
                    type="submit"
                    className="p-3 flex justify-center align-middle border h-[50px] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[250px]"
                    disabled={isSubmitting}
                  >
                    { isSubmitting ? <Spinner /> : watch("searchSalesman") ? "Update Salesman" : "Add Salesman"}
                  </button>
                </div>

      </form>
     </div>

    </main>
  )
}

